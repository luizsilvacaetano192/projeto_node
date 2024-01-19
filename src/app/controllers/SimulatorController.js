const Controller = require('./Controller')




class SimulatorController extends Controller {
  constructor () {
    super('SimulatorService')
  }



  
  async calculed (req, res, next) {
    this.service.scope = req.scope
    
    const response = await this.service.calculed(req, res, next)

    return res.status(200).send(response)
  } catch (error) {
    next(error)
  

  }
 
}

module.exports = new SimulatorController()
