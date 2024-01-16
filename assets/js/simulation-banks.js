

const simulationBanks = [
  {
    name: 'Caixa',
    yearlyFeeTR: 8.7,
    yearlyFeeSavings: 3.15,
    minIncomeRatio: 0.244,
    minEntryValuePercent: 20,
    maxMonths: 420,
    img: 'caixa-ic.png',
    mip: [
      { idadeInicial: 18, idadeFinal: 25, taxa: 0.0000929 },
      { idadeInicial: 26, idadeFinal: 30, taxa: 0.0000929 },
      { idadeInicial: 31, idadeFinal: 35, taxa: 0.0001159 },
      { idadeInicial: 36, idadeFinal: 40, taxa: 0.0001536 },
      { idadeInicial: 41, idadeFinal: 45, taxa: 0.0002519 },
      { idadeInicial: 46, idadeFinal: 50, taxa: 0.0003860 },
      { idadeInicial: 51, idadeFinal: 55, taxa: 0.0006760 },
      { idadeInicial: 56, idadeFinal: 60, taxa: 0.0012638 },
      { idadeInicial: 61, idadeFinal: 65, taxa: 0.0025065 },
      { idadeInicial: 66, idadeFinal: 70, taxa: 0.0027511 },
      { idadeInicial: 71, idadeFinal: 75, taxa: 0.0039351 },
      { idadeInicial: 76, idadeFinal: 77, taxa: 0.0045716 },
      { idadeInicial: 78, idadeFinal: 80, taxa: 0.0046892 },
    ]
  },
  {
    name: 'Bradesco',
    yearlyFeeTR: 9.5,
    yearlyFeeSavings: 2.99,
    minIncomeRatio: 0.3,
    minEntryValuePercent: 20,
    maxMonths: 360,
    img: 'bradesco-ic.png',
    mip: [
      { idadeInicial: 18, idadeFinal: 25, taxa: 0.0000929 },
      { idadeInicial: 26, idadeFinal: 30, taxa: 0.0000929 },
      { idadeInicial: 31, idadeFinal: 35, taxa: 0.0001159 },
      { idadeInicial: 36, idadeFinal: 40, taxa: 0.0001536 },
      { idadeInicial: 41, idadeFinal: 45, taxa: 0.0002519 },
      { idadeInicial: 46, idadeFinal: 50, taxa: 0.0003860 },
      { idadeInicial: 51, idadeFinal: 55, taxa: 0.0006760 },
      { idadeInicial: 56, idadeFinal: 60, taxa: 0.0012638 },
      { idadeInicial: 61, idadeFinal: 65, taxa: 0.0025065 },
      { idadeInicial: 66, idadeFinal: 70, taxa: 0.0027511 },
      { idadeInicial: 71, idadeFinal: 75, taxa: 0.0039351 },
      { idadeInicial: 76, idadeFinal: 77, taxa: 0.0045716 },
      { idadeInicial: 78, idadeFinal: 80, taxa: 0.0046892 },
    ]
  },
  {
    name: 'Itau',
    yearlyFeeTR: 9.1,
    yearlyFeeSavings: 3.49,
    minIncomeRatio: 0.35,
    minEntryValuePercent: 10,
    maxMonths: 360,
    img: 'itau-ic.png',
    mip: [
      { idadeInicial: 18, idadeFinal: 30, taxa: 0.000100 },
      { idadeInicial: 31, idadeFinal: 35, taxa: 0.000127 },
      { idadeInicial: 36, idadeFinal: 40, taxa: 0.000170 },
      { idadeInicial: 41, idadeFinal: 45, taxa: 0.000269 },
      { idadeInicial: 46, idadeFinal: 50, taxa: 0.000388 },
      { idadeInicial: 51, idadeFinal: 55, taxa: 0.000678 },
      { idadeInicial: 56, idadeFinal: 60, taxa: 0.0001266 },
      { idadeInicial: 61, idadeFinal: 65, taxa: 0.002509 },
      { idadeInicial: 66, idadeFinal: 70, taxa: 0.002798 },
      { idadeInicial: 71, idadeFinal: 75, taxa: 0.004055 },
      { idadeInicial: 76, idadeFinal: 80, taxa: 0.004765 },
    ]
  },
  {
    name: 'Santander',
    yearlyFeeTR: 9.49,
    minIncomeRatio: 0.35,
    minEntryValuePercent: 20,
    maxMonths: 420,
    img: 'santander-ic.png',
    mip: [
      { idadeInicial: 18, idadeFinal: 30, taxa: 0.000100 },
      { idadeInicial: 31, idadeFinal: 35, taxa: 0.000127 },
      { idadeInicial: 36, idadeFinal: 40, taxa: 0.000170 },
      { idadeInicial: 41, idadeFinal: 45, taxa: 0.000269 },
      { idadeInicial: 46, idadeFinal: 50, taxa: 0.000388 },
      { idadeInicial: 51, idadeFinal: 55, taxa: 0.000678 },
      { idadeInicial: 56, idadeFinal: 60, taxa: 0.0001266 },
      { idadeInicial: 61, idadeFinal: 65, taxa: 0.002509 },
      { idadeInicial: 66, idadeFinal: 70, taxa: 0.002798 },
      { idadeInicial: 71, idadeFinal: 75, taxa: 0.004055 },
      { idadeInicial: 76, idadeFinal: 80, taxa: 0.004765 },
    ]
  },
]

module.exports =  simulationBanks;