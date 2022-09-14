import { useEffect, useState } from "react";
import { GraphVisualizator } from "./components/GraphVisualizator";
import { locaisData } from "./data/locais";
import { rotas } from "./data/rotas";
import { rotasWH } from "./data/rotasWH";
import { Graph } from "./services/graph";
import { IntervalScheduling } from "./services/IntervalScheduling";

function App() {
  const grafo = new Graph(rotasWH);
  const [locais, setLocais] = useState<any>([]);
  const [localInicial, setLocalInicial] = useState<string | null>(null);
  const [localFinal, setLocalFinal] = useState<string | null>(null);
  const [render, setRender] = useState<any>();
  const [graphData, setGraphData] = useState<any>();
  const [layoutName, setLayoutName] = useState<any>('breadthfirst');
  const [nodeSelected, updateNodeSelected] = useState<any>();

  useEffect(() => {
    const listaDeLocais = locaisData
      .map((it: any) => Object.keys(it)[0]) as Array<string>;

    setLocais([...new Set(listaDeLocais)]);
  }, []);

  useEffect(() => {
    const data = [] as any;

    const listaDeLocais = locaisData
      .map((it: any) => Object.keys(it)[0]) as Array<string>;

    listaDeLocais.forEach(loc => data.push(setNode(loc.replaceAll(" ", ""), loc)));

    // const listaDeRotas = rotas
    //   .map((it: any) => Object.keys(it)[0]) as Array<string>;

    const listaDeRotas = [] as any;

    rotas.map((it: any) => listaDeRotas.push(...Object.keys(it)));
    
    listaDeRotas.forEach((rota: string, index: number) => {
      const [primeiro, segundo] = rota.split(':');
      
      data.push(setEdge(primeiro.replaceAll(" ", ""), segundo.replaceAll(" ", "")));
    });

    setGraphData(data);
    setLayoutName('concentric');
  }, []);

  function calcularRota(e: any) {
    e.preventDefault();
    // let localInicial = 'Belem';
    // let localFinal = 'Campo Grande';
    let isReideEmCadaLocal = null; // 'on'
    let horaPartida = parseFloat('12:00'.replace(":", ""));
    let interval = new IntervalScheduling();
    let destinos;
    
    if (isReideEmCadaLocal != null) {
      destinos = grafo
        .menorCaminho(localInicial, localFinal, true)
        .concat([localInicial])
        .reverse();
    } else {
      destinos = grafo
        .menorCaminho(localInicial, localFinal, false)
        .concat([localInicial])
        .reverse();
    }

    let tempoTotal = [];

    if (isReideEmCadaLocal != null) {
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
      var ultimaCidade = destinos[destinos.length - 1];
      var cidadeAtual = destinos[l];
      //  if (isReideEmCadaLocal != 'on') {cidadeAtual=ultimaCidade}
      var horarios = [];
      for (var i = 0; i < locaisData.length; i++) {
        var obj = locaisData[i];
        for (var cidade in obj) {
          var value = obj[cidade];
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
            if (isReideEmCadaLocal != null) {
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
            }
          }
        }
      }
      l++;
      x++;
    }

    const render =  {
      result: resultado,
      destinos: destinoEjs,
      destinosTotal: destinos,
    };

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

  function getNodeSelected(node: any): void {
    console.log(node)
    setLocalInicial((nodeAnt: any) => {
      if (nodeAnt) {
        setLocalFinal(node);
        return nodeAnt;
      } else {
        return node;
      }
    });
  }

  return (
    <div className="w-full container mx-auto">
      {(!render && !render?.destinosTotal && !render?.result) ? (
        <div>
        <div className="rounded-md ">
          <h1 className="text-center font-bold text-2xl my-4 mb-8">
            Grafo de conexões entre os ginásios
          </h1>

          <div className="hint text-gray-600">
            Clique em dois pontos que deseja saber dos 
            ginásios com reides ativas
          </div>

          <GraphVisualizator 
            title="Grafo de conexões entre os ginásios"
            layoutName={layoutName}
            graphData={graphData}
            setNodeSelected={getNodeSelected}
          />
        </div>
      
        <div>
          <form className="">
            <div className={"flex flex border-2 p-2 gap-4 mt-4 rounded-md "}>
              <label>Você selecionou os locais</label>  
              <p>
                De: &nbsp; <span className="bg-blue-200 rounded-md p-2">
                  {localInicial}
                  </span>&nbsp;&nbsp;&nbsp;
                Para: &nbsp; <span className="bg-blue-400 rounded-md p-2">
                  {((localInicial !== localFinal) && localFinal)}
                  </span>
              </p>
            </div>

            <div className="flex flex border-2 p-2 gap-4 mt-4 rounded-md">
              <label>Informe o horário em que começará as reides:</label>
              <input
                type="time"
                min="09:00"
                max="20:00"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 rounded-md text-white my-4 px-4 py-2 mb-12 active:bg-blue-800"
              onClick={calcularRota}
            >
              Pesquisar por locais
            </button>
          </form>
        </div>
      </div>
      ) : (
        <div className="flex border-2 rounded-md shadow-md items-center 
          justify-center p-4 mt-4 mx-8">
          <div className="flex flex-col justify-center items-center gap-4 flex-wrap">
            <p>Você passará por:</p>
            {
              render?.destinosTotal?.map((dest: string, index: number) => (
                <span className="bg-gray-600 rounded-md p-2 text-white" key={index}>
                  {dest} {(index < render.destinosTotal.length-1)}
                </span>
              ))
            }
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            {
              render?.result.map((it: any, index: number) => (
                (index === 0) ? (
                  <div key={index}>
                    <strong>Se liga nas reides que estão acontecendo agora!</strong>
                  </div>
                ) : (
                  <div key={index}>
                    Reide no Ginásio: <span className="text-gray-600">{it[1]}</span>
                  </div>
                )
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
