export class Graph {

  constructor(vet) {
    this.INFINITY = 1 / 0;
    this.vertices = {};
    this.tempoTotal = [];
    this.tempoTotalUnico = 0;

    for (let i = 0; i < vet.length; i++) {
      let objeto = vet[i];
      let name;
      let objLiteral = {};
      
      for (let chave in objeto) {
        name = chave.substring(0, chave.indexOf(":"));
        objLiteral[chave.substring(chave.indexOf(":") + 1)] = objeto[chave];
      }

      this.adicionaVertice(name, objLiteral);
    }
  }

  adicionaVertice(name, edges) {
    this.vertices[name] = edges;
  }

  menorCaminho(inicio, fim, queroPasseios) {
    var nodes = new PriorityQueue(),
      distances = {},
      previous = {},
      path = [],
      smallest,
      vertex,
      neighbor,
      alt;
    this.tempoTotal = [];
    this.tempoTotalUnico = 0;

    for (vertex in this.vertices) {
      if (vertex === inicio) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        distances[vertex] = this.INFINITY;
        nodes.enqueue(this.INFINITY, vertex);
      }
      previous[vertex] = null;
    }

    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if (smallest === fim) {
        path = [];
        while (previous[smallest]) {
          if (queroPasseios) {
            this.tempoTotal.push(
              this.vertices[smallest][previous[smallest]] / 80
            );
          } else {
            this.tempoTotalUnico =
              this.tempoTotalUnico +
              this.vertices[smallest][previous[smallest]] / 80;
          }
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }

      if (!smallest || distances[smallest] === this.INFINITY) {
        continue;
      }

      for (neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;
          nodes.enqueue(alt, neighbor);
        }
      }
    }
    return path;
  }
}
class PriorityQueue {
  constructor() {
    this._nodes = [];
  }

  enqueue(priority, key) {
    this._nodes.push({ key: key, priority: priority });
    this.sort();
  }
  dequeue() {
    return this._nodes.shift().key;
  }
  sort() {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }
  isEmpty() {
    return !this._nodes.length;
  }
}
