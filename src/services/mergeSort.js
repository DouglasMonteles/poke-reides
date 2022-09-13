export class MergeSort {
  constructor() {
    this.vet = [];
  }
  mergeSort(vet, inicio, fim) {
    if (fim - inicio > 1) {
      var meio = Math.round((fim + inicio) / 2);
      this.mergeSort(vet, inicio, meio);
      this.mergeSort(vet, meio, fim);
      this.merge(vet, inicio, meio, fim);
    }
  }

  merge(vet, incio, meio, fim) {
    var x = 0;
    var y = incio;
    var z = meio;
    var vetAux = [];
    while (y < meio && z < fim) {
      if (vet[y] < vet[z]) vetAux[x] = vet[y++];
      else vetAux[x] = vet[z++];

      x++;
    }
    while (y < meio) {
      vetAux[x++] = vet[y++];
    }
    while (z < fim) {
      vetAux[x++] = vet[z++];
    }
    for (var i = 0; i < x; i++) {
      vet[incio + i] = vetAux[i];
    }
  }
}
