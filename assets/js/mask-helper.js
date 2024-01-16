   unmaskMoney = (val) => {
    val = val.toString()
    let unmaskedValue = val;
    
    unmaskedValue.toLocaleString('pt-br', {minimumFractionDigits: 2})

    return parseFloat(unmaskedValue).toFixed(2);
  }

   maskMoneyBR = (val) => {


    return val.toLocaleString('pt-br', {minimumFractionDigits: 2});
  }

  unmaskDate = (val) => { return val.replace(/\//g, '-').split('-').reverse().join('-') }

  maskDateBR = (val) => { 
  
  var data = new Date(val),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
  
  

}


module.exports =  unmaskMoney,maskMoneyBR,unmaskDate,maskDateBR;