//Ordenações
exports.compararPontos = function(a, b){
  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }
}

exports.compararVitorias = function(a, b){
  if (a.qtdVitorias && b.qtdVitorias){
    var diffVitorias = (a.qtdVitorias - b.qtdVitorias);
    if (diffVitorias != 0){
      return diffVitorias * -1;
    }
  } else {
    qtdVitoriasA = a.historicoJogos.find(j => j.lugar == 1).quantidade;
    qtdVitoriasB = b.historicoJogos.find(j => j.lugar == 1).quantidade;

    var diffVitorias = (qtdVitoriasA - qtdVitoriasB);
    if (diffVitorias != 0){
      return diffVitorias * -1;
    }
  }

  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}

exports.compararHUs = function(a, b){
  var diffHUs = (a.qtdHUs - b.qtdHUs);
  if (diffHUs != 0){
    return diffHUs * -1;
  }
}

exports.compararSaldo = function(a, b){
  var diffSaldo = ((a.valorRecebido - a.valorInvestido) - (b.valorRecebido - b.valorInvestido));
  if (diffSaldo != 0){
    return diffSaldo * -1;
  }

  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  var diffVitorias = (a.qtdVitorias - b.qtdVitorias);
  if (diffVitorias != 0){
    return diffVitorias * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}

exports.compararVezesDealer = function(a, b){
  var diffqtdVezesDealer = (a.qtdVezesDealer - b.qtdVezesDealer);
  if (diffqtdVezesDealer != 0){
    return diffqtdVezesDealer;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}

exports.compararValorRecebido = function(a, b){
  var diffValorRecebido = (a.valorRecebido - b.valorRecebido);
  if (diffValorRecebido != 0){
    return diffValorRecebido * -1;
  }

  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  var diffVitorias = (a.qtdVitorias - b.qtdVitorias);
  if (diffVitorias != 0){
    return diffVitorias * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}


exports.compararPontosPorJogo = function(a, b){
  var diffPontosPorJogo = (a.pontosPorJogo - b.pontosPorJogo);
  if (diffPontosPorJogo != 0){
    return diffPontosPorJogo * -1;
  }

  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  var diffVitorias = (a.qtdVitorias - b.qtdVitorias);
  if (diffVitorias != 0){
    return diffVitorias * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}

exports.compararMediaPosicao = function(a, b){
  var diffMediaPosicao = (a.mediaPosicao - b.mediaPosicao);
  if (diffMediaPosicao != 0){
    return diffMediaPosicao;
  }
}

exports.compararPontuacoes = function(a, b){
  var diffPontuacoes = (a.qtdPontuacoes - b.qtdPontuacoes);
  if (diffPontuacoes != 0){
    return diffPontuacoes * -1;
  }
}

exports.compararJogadores = function(a, b){
  var diffPontos = (a.pontos - b.pontos);
  if (diffPontos != 0){
    return diffPontos * -1;
  }

  for (var i = 1; i <= 15; i++){
    var diffPos = (a.historicoJogos[i].quantidade - b.historicoJogos[i].quantidade);

    if (diffPos != 0){
      return diffPos * -1;
    }
  }

  var diffValor = (a.valorRecebido - b.valorRecebido);
  if (diffValor != 0){
    return diffValor * -1;
  }

  var diffJogos = (a.jogos - b.jogos);
  if (diffJogos != 0){
    return diffJogos;
  }
}
