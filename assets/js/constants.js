const constant = 
  {
 maxMonths : 420,
  maxYears : 80,
  minEntryValuePercent : 0.1,
  defaultEntryValuePercent : 0.2,
  defaultMonths : 360,
  fixedSelic : 6.17
  }


 module.exports =  constant;
/*
  O cálculo da simulação para poupança deve incluir 70% da selic com o teto de 6.17,
  porém a  ja nos fornece o valor corrigido pelos 70% e ajustado ao teto.
*/