
const { DateTime } = require('luxon')


const maskMoneyBR = require('../../assets/js/mask-helper')


class SimulationHelper {
  banco ="";
  bancoLogo = "";
  bancoRendaMinimaPorcentagem = 0;
  txAdministrativa = 25;
  txDfi = 0.0000660;
  dfi = 0;
  tabelaMip = [];
  idade = [];
  mipAplicada = [];
  mipCalculada = [];
  txJurosAm = 0;
  amortizacao = 0;
  saldoDevedor = [];
  listaJuros = [];
  parcelas = [];
  parcelasFinais = [];
  valorFinanciado = 0;
  valorImovel = 0;
  valorEntrada = 0;
  valorFinanciamento = 0;
  txJurosAa = 0;
  prazo = 0;
  dtNascimento = 0;
  cet = 0;
  constructor(valorImovel, valorEntrada, txJurosAa, prazo, dtNascimento, mip, bankName, bankMinIncomeRatio, bankLogo) {


    // console.log('valorImovel', parseFloat(valorImovel));
    // console.log('valorEntrada', parseFloat(valorEntrada));
    // console.log('txJurosAa', parseFloat(txJurosAa));
    // console.log('prazo', parseInt(prazo));
    // console.log('dtNascimento', dtNascimento);
    // console.log('bankMinIncomeRatio', bankMinIncomeRatio);

    this.valorImovel = parseFloat(valorImovel);
    this.valorEntrada = parseFloat(valorEntrada);
    this.txJurosAa = parseFloat(txJurosAa);
    this.prazo = parseInt(prazo);
    this.dtNascimento = dtNascimento;
    this.tabelaMip = mip;
    this.banco = bankName;
    this.bancoLogo = bankLogo;
    this.bancoRendaMinimaPorcentagem = bankMinIncomeRatio;

    this.valorFinanciamento = this.valorImovel - this.valorEntrada;
  }
  calcular () {
    this.calcTxJurosAm();
    this.calcAmortizacao();
    this.calcSaldoDevedor();
    this.calcListaJuros();
    this.calcParcelas();
    this.calcDfi();
    this.calcMip();
    this.calcParcelasFinais();
    this.calcularCET();
  }
  calcTxJurosAm () {
    this.txJurosAm = ((1 + this.txJurosAa) ** (1 / 12) - 1)
    // console.log('txJurosAm', this.txJurosAm);
  }
  calcAmortizacao () {
    this.amortizacao = (this.valorImovel - this.valorEntrada) / this.prazo
    // console.log('amortizacao', this.amortizacao);
  }
  calcSaldoDevedor () {
    this.saldoDevedor[0] = (this.valorImovel - this.valorEntrada)
    for (let i = 1; i < this.prazo + 2; i++) {
      this.saldoDevedor[i] = this.saldoDevedor[i - 1] - this.amortizacao;
    }
  }
  calcListaJuros () {
    this.listaJuros[0] = 0
    for (let i = 1; i < (this.prazo + 1); i++) {
      this.listaJuros[i] = parseFloat(this.txJurosAm * this.saldoDevedor[i - 1])
    }
  }
  calcParcelas () {
    this.parcelas[0] = 0
    for (let i = 1; i < (this.prazo + 1); i++) {
      this.parcelas[i] = parseFloat(this.listaJuros[i]) + parseFloat(this.amortizacao)
    }
    //console.log('this.parcelas[i]',this.parcelas)
  }
  calcDfi () {
    this.dfi = this.valorImovel * this.txDfi
    //console.log('dfi', this.dfi);
    //console.log('this.valorImovel',this.valorImovel);
  }
  calcMip () {
    const today = new Date()
    for (let i = 1; i <= this.prazo + 1; i++) {
      today.setMonth(today.getMonth() + 1)
  
      this.idade[i] = this.calcIdade(today)
      this.mipAplicada[i] = this.tabelaMip.find(({ idadeInicial, idadeFinal }) => this.idade[i] >= idadeInicial && this.idade[i] <= idadeFinal).taxa
      this.mipCalculada[i] = this.saldoDevedor[i] * this.mipAplicada[i]
    }
  }
  calcIdade (relativeDate) {

    let  dataNascimento = this.dtNascimento.split('-')
    const nascimentoDia = dataNascimento[2]
    const nascimentoMes = dataNascimento[1]
    const nascimentoAno = dataNascimento[0]

    dataNascimento = new Date(nascimentoMes + '/' + nascimentoDia + '/' + nascimentoAno)

    const relativeDateMonth = relativeDate.getMonth() + 1
    const relativeDateDay = relativeDate.getDate()


    let age = relativeDate.getFullYear() - dataNascimento.getFullYear()


    
    if (nascimentoMes >= relativeDateMonth) {
      if (nascimentoDia >= relativeDateDay) {
      
        age--
      }
    }

  
    return age
  }
  calcParcelasFinais () {
    //console.log('this.dfi',this.dfi)
    for (let i = 1; i <= this.prazo; i++) {
      //console.log('this.mipCalculada[i + 1]',this.dfi / 100)
      this.parcelasFinais[i] = this.parcelas[i] + this.dfi + this.mipCalculada[i + 1] + this.txAdministrativa
      //console.log('this.txAdministrativa',this.txAdministrativa)
      this.valorFinanciado += this.parcelasFinais[i];
    }
  }
  calcularCET () {
    let valor = 0;

    for (let i = 1; i < this.listaJuros.length; i++) {
      valor += this.listaJuros[i];
      valor += this.txAdministrativa;
      valor += this.dfi;
      valor += this.mipCalculada[i];
    }

    this.cet = ((valor.toFixed(2) * 100) / this.valorFinanciado).toFixed(2);
  }
  calcularRendaMinima () {
    return this.parcelasFinais[1] / this.bancoRendaMinimaPorcentagem;
  }
  getPrimeiraParcela () {
    //console.log('this.parcelasFinais[1]',this.parcelasFinais[1])
    return this.parcelasFinais[1];
  }
  getUltimaParcela () {
    return this.parcelasFinais[this.parcelasFinais.length - 1];
  }
  getValoresFormatados () {

    const simulation = {
      buildingCost: maskMoneyBR(this.valorImovel),
      yearlyFee: (`${(this.txJurosAa * 100)}%`).replace('.', ','),
      firstPayment: maskMoneyBR(this.getPrimeiraParcela()),
      lastPayment: maskMoneyBR(this.getUltimaParcela()),
      months: this.prazo,
      minIncome: maskMoneyBR(this.calcularRendaMinima()),
      buildingEntryCost: (this.valorEntrada),
      bankName: this.banco,
      bankLogo: this.bancoLogo,
      financedValue: maskMoneyBR(this.valorFinanciamento),
      totalValue: maskMoneyBR(this.valorFinanciado),
      comparativeFinancedValue: maskMoneyBR(this.valorFinanciado),
      amortization: maskMoneyBR(this.amortizacao),
      dfi: maskMoneyBR(this.dfi),
      tba: maskMoneyBR(this.txAdministrativa),
      payments: []
    }

    for (let i = 1; i <= this.prazo; i++) {
      const payment = {
        date: DateTime.now().plus({ months: i }).toLocaleString({ month: 'numeric', year: 'numeric' }),
        number: i,
        remainingValue: maskMoneyBR(this.saldoDevedor[i]),
        fee:maskMoneyBR (this.listaJuros[i]),
        mip: maskMoneyBR(this.mipCalculada[i]),
        payment:maskMoneyBR (this.parcelasFinais[i])
      }

      simulation.payments.push(payment);
    }

    return simulation;
  }
}

module.exports = SimulationHelper;