import { useEffect, useState } from "react";
import { GraphVisualizator } from "./components/GraphVisualizator";
import { passeios } from "./data/passeios";
import { rotas } from "./data/rotas";
import { rotasWH } from "./data/rotasWH";
import { Graph } from "./services/graph";
import { IntervalScheduling } from "./services/IntervalScheduling";

function App() {
  const grafo = new Graph(rotasWH);
  const [locais, setLocais] = useState<any>([]);
  const [localIncial, setLocalInicial] = useState('');
  const [localFinal, setLocalFinal] = useState('');
  const [render, setRender] = useState<any>();
  const [graphData, setGraphData] = useState<any>();
  const [layoutName, setLayoutName] = useState<any>('breadthfirst');
  const [nodeSelected, setNodeSelected] = useState<any>('breadthfirst');

  useEffect(() => {
    const listaDeLocais = passeios
      .map((it: any) => Object.keys(it)[0]) as Array<string>;

    setLocais([...new Set(listaDeLocais)]);
  }, []);

  useEffect(() => {
    const data = [] as any;

    const listaDeLocais = passeios
      .map((it: any) => Object.keys(it)[0]) as Array<string>;

    listaDeLocais.forEach(loc => data.push(setNode(loc.replaceAll(" ", ""), loc.replaceAll(" ", ""))));

    console.log(rotas.map((it: any) => Object.keys(it)));

    // const listaDeRotas = rotas
    //   .map((it: any) => Object.keys(it)[0]) as Array<string>;

    const listaDeRotas = [] as any;

    rotas.map((it: any) => listaDeRotas.push(...Object.keys(it)));

    console.log(rotas)
    
    listaDeRotas.forEach((rota: string, index: number) => {
      const [primeiro, segundo] = rota.split(':');
      console.log(`${primeiro} - ${segundo}`)
      
      data.push(setEdge(primeiro.replaceAll(" ", ""), segundo.replaceAll(" ", "")));
    });

    setGraphData(data);
    setLayoutName('concentric');
  }, []);

  useEffect(() => {
    if (localIncial == '') {
      setLocalInicial(nodeSelected);
      return;
    }

    if (localFinal == '') {
      setLocalInicial(nodeSelected);
      return;
    }
  }, [nodeSelected]);

  function calcularRota(e: any) {
    e.preventDefault();
    console.log(localFinal)
    // let localIncial = 'Belem';
    // let localFinal = 'Campo Grande';
    let passeioCadaCidade = null; // 'on'
    let horaPartida = parseFloat('12:00'.replace(":", ""));
    let interval = new IntervalScheduling();
    let destinos;
    
    if (passeioCadaCidade != null) {
      destinos = grafo
        .menorCaminho(localIncial, localFinal, true)
        .concat([localIncial])
        .reverse();
    } else {
      destinos = grafo
        .menorCaminho(localIncial, localFinal, false)
        .concat([localIncial])
        .reverse();
    }

    let tempoTotal = [];

    if (passeioCadaCidade != null) {
      tempoTotal.push(grafo.tempoTotal[0] + horaPartida / 100);

      for (let i = 1; i < grafo.tempoTotal.length; i++) {
        if (grafo.tempoTotal[i] < 24) {
          //Menos de um dia
          tempoTotal.push(grafo.tempoTotal[i]);
        } else {
          //Se passar de um dia essa é a hora que chega
          tempoTotal.push(grafo.tempoTotal[i] % 24);
        }
      }
    } else {
      tempoTotal = grafo.tempoTotalUnico as any;
    }

    var l = 0;
    var resultado = [];
    let x = 0;
    let destinoEjs = [];

    while (destinos.length > l) {
      console.log(l);
      var ultimaCidade = destinos[destinos.length - 1];
      var cidadeAtual = destinos[l];
      //  if (passeioCadaCidade != 'on') {cidadeAtual=ultimaCidade}
      var horarios = [];
      for (var i = 0; i < passeios.length; i++) {
        var obj = passeios[i];
        for (var cidade in obj) {
          var value = obj[cidade];
          console.log(destinos);
          if (cidade == cidadeAtual) {
            for (var passeio in value) {
              var value2 = value[passeio];
              //   console.log(passeio)
              for (let j = 0; j < value2.length; j++) {
                //    console.log(value2[j].inicio + " - " + value2[j].fim);
                var result = {
                  inicio: parseInt(value2[j].inicio.replace(":", "")),
                  fim: parseInt(value2[j].fim.replace(":", "")),
                  passeio: passeio,
                };

                horarios.push(result);
              }
            }
            //console.log(horarios)
            horarios.sort(function (hor1, hor2) {
              if (hor1.fim < hor2.fim) return -1;
              if (hor1.fim > hor2.fim) return 1;
              return 0;
            });
            if (passeioCadaCidade != null) {
              var horariosScheduling = interval.calculaScheduling(
                horarios.length,
                horarios,
                tempoTotal[x]
              );
              for (let index = 0; index < horariosScheduling.length; index++) {
                resultado.push([
                  destinos[l],
                  `${horariosScheduling[index].passeio}: inicio: ${[
                    horariosScheduling[index].inicio.toString().slice(0, 2),
                    ":",
                    horariosScheduling[index].inicio.toString().slice(2),
                  ].join("")}; fim: ${[
                    horariosScheduling[index].fim.toString().slice(0, 2),
                    ":",
                    horariosScheduling[index].fim.toString().slice(2),
                  ].join("")}.`,
                ]);
              }
              destinoEjs.push(destinos[l]);
              //   console.log(tempoTotal[x])
            } else if (l == destinos.length - 1) {
              var horariosScheduling = interval.calculaScheduling(
                horarios.length,
                horarios,
                tempoTotal
              );
              for (let index = 0; index < horariosScheduling.length; index++) {
                resultado.push([
                  destinos[l],
                  `${horariosScheduling[index].passeio}: inicio: ${[
                    horariosScheduling[index].inicio.toString().slice(0, 2),
                    ":",
                    horariosScheduling[index].inicio.toString().slice(2),
                  ].join("")}; fim: ${[
                    horariosScheduling[index].fim.toString().slice(0, 2),
                    ":",
                    horariosScheduling[index].fim.toString().slice(2),
                  ].join("")}.`,
                ]);
              }
              destinoEjs.push(destinos[l]);
              console.log(destinoEjs);
            }
          }
        }
      }
      l++;
      x++;
    }

    console.log(localFinal);

    const render =  {
      result: resultado,
      destinos: destinoEjs,
      destinosTotal: destinos,
    };

    console.log(render);
    setRender(render);
  };

  function setNode(id: string, label: string, image: string = ''): Object {
    const node = {
      data: {
        id,
        label,
        image,
      }     
    };

    return node;
  }

  function setEdge(source: string, target: string): Object {
    const edge = {
      data: {
        source,
        target,
        label: `${source} -> ${target}`,
      }
    };

    return edge;
  }

  return (
    <div className="">
      <div>
        <form>
          <div className="">
            <label>Local inicial</label>
            <select
              onChange={(e) => setLocalInicial(e.target.value)}
            >
              <option>Capital Inicial</option>
              {
                locais.map((it: string) => (
                  <option 
                    key={it} 
                    value={it}
                  >
                    {it}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="">
            <label>Local final</label>
            <select
              onChange={(e) => setLocalFinal(e.target.value)}
            >
              <option>Capital localFinal</option>
              {
                locais.map((it: string) => (
                  <option 
                    key={it} 
                    value={it}
                  >
                    {it}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="">
            <label>Informe o horários que começará as reides</label>
            <input
              min="09:00"
              max="20:00"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm float-end"
            onClick={calcularRota}
          >
            Pesquisar por locais
          </button>
        </form>

        <div>
          {
            render?.destinosTotal?.map((dest: string, index: number) => (
              <span key={index}>
                {dest} {(index < render.destinosTotal.length-1) && ' -> '}
              </span>
            ))
          }
        </div>

        <div>
          {
            render?.result.map((it: any, index: number) => (
              (index === 0) ? (
                <div key={index}>
                  Local: {it[0]}
                </div>
              ) : (
                <div key={index}>
                  Reide/Ginásio: {it[1]}
                </div>
              )
            ))
          }
          

          {/* 
            <% for(var j=0; j<destinosTotal.length; j++) { %>
              <%= destinosTotal[j] %>
            <% } %>
            
            <% for(var j=0; j<destinos.length; j++) { %>
              <li>
                  <%= destinos[j] %>
              </li>
            
              <% for(var i=1; i<result.length; i++) { %>
                <% if(result[i][0] == destinos[j]) { %>
                  <ul>
                      <%= result[i][1] %>
                  </ul>
                <% } %>
              <% } %>
            <% } %> */} 
        </div>
      </div>

      <GraphVisualizator 
        title="Teste"
        layoutName={layoutName}
        graphData={graphData}
        setNodeSelected={setNodeSelected}
      />
    </div>
  );
}

export default App;
