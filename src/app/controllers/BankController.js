const Controller = require('./Controller')
const BankController = require('./RealEstateController')


class BanksController extends Controller {
  constructor () {
    super('BankService')
  }


  async updateAll (body,next,req,res) {
   
      
    
      body.banks.forEach(async bank => {
        console.log('bank',bank)
        
        var dto = Object.create({ tr: 0, poupanca: 0, selic: 5.5 });
        dto.tr = bank.tr;
        dto.poupanca = bank.poupanca;
        dto.selic = bank.selic;
        dto.name = bank.name;
        dto.simulator = bank.simulator;
        dto.commission = bank.commission;
        dto.active = bank.actives;
        

        const a = await this.service.update(bank._id,dto);
        

      })
      return res.status(200).json('ok')
    }
  
}

module.exports = new BanksController()
