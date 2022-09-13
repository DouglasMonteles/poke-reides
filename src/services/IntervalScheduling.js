export class IntervalScheduling {
  calculaScheduling(qtd, horarios, horarioAtual) {
    var max = [];
    var anterior = 0;
    var passeioAnterior = "";
    for (var i = 0; i < qtd; i++) {
      if (
        horarios[i].inicio >= anterior &&
        horarios[i].inicio >= horarioAtual &&
        horarios[i].passeio != passeioAnterior
      ) {
        if (horarios[i].inicio < 1000) {
          horarios[i].inicio = String(horarios[i].inicio);
          horarios[i].inicio = "0" + horarios[i].inicio;
        }
        if (horarios[i].fim < 1000) {
          horarios[i].fim = String(horarios[i].fim);
          horarios[i].fim = "0" + horarios[i].fim;
        }

        max.push(horarios[i]);
        anterior = horarios[i].fim;
        passeioAnterior = horarios[i].passeio;
      }
    }
    return max;
  }
}
