const Services = require('./Services')
const AnalysisService = require('./AnalysisService')
const PhaseService = require('./PhaseService')
const HistoryService = require('./HistoryService')
const UserService = require('./UserService')
const phaseFactory = require('../helpers/factories/phaseFactory')
const PHASE = require('../helpers/enum/phases.enum')
const ROLE = require('../helpers/enum/roles.enum')
const processModel = require('../models/process')
const phaseModel = require('../models/phase')
const {
  Types: { ObjectId }
} = require('mongoose')
const { DateTime } = require('luxon')
const { BadRequestException } = require('../middlewares/errors')

const userService = new UserService()
const phaseService = new PhaseService()
const historyService = new HistoryService()
const analysisService = new AnalysisService()

class ProcessService extends Services {
  constructor () {
    super(
      'processes',
      'Process'
    )
  }

  async create (data, details) {
    console.log('chamou o create');
    analysisService.scope = this.scope
    historyService.scope = this.scope
    phaseService.scope = this.scope
    userService.scope = this.scope

    if (data.fromAnalysis) {
      await analysisService.update(data.fromAnalysis, { active: false })
    }

    data.phases = await Promise.all(
      Object.keys(PHASE).map((phase) => {
        const phaseCreator = this.createPhases(phase, details.status, details.detail)
        return phaseCreator()
      })
    )

    const phases = data.phases.find(
      (phase) => phase.identificator === PHASE.ONE
    )

    data.currentPhase = phases._id

    const historyPhaseOne = await historyService.create({
      phaseIdentificator: PHASE.ONE,
      startDate: phases.createdAt
    })

    const ret = await phaseModel.findByIdAndUpdate(data.currentPhase, 
      {history: historyPhaseOne._id}
    )


 

    if (data.seller.CPF !== '') {
      
      let seller



      seller = await userService.findOne({
        CPF: data.seller.CPF,
        active: true,
        role: ROLE.SELLER
      })

      if (seller) {
        await userService.update(
          { _id: seller._id },
          {
            email: data.seller.email,
            name: data.seller.name,
            CPF: data.seller.CPF,
            phone: data.seller.phone
          }
        )
      } else {
        seller = await userService.create(
          {
            name: data.seller.name,
            CPF: data.seller.CPF,
            email: data.seller.email,
            phone: data.seller.phone
          },
          ROLE.SELLER
        )
      }
      data.seller = seller._id
    }

    if (data.seller.CPF == '') {
      delete data.seller;
    }

    let buyer = await userService.findOne({
      CPF: data.buyer.CPF,
      active: true,
      role: ROLE.BUYER
    })

    if (buyer) {
      data.buyer = buyer._id
      data.value = details.detail.financedValue

      const newProcess = await super.create({
        ...data
      })
      return newProcess
    }


    buyer = await userService.create(
      {
        ...data.buyer
      },
      ROLE.BUYER
    )

    data.buyer = buyer._id
    data.value = details.detail.financedValue
    const newProcess = await super.create({
      ...data
    })
    return newProcess
  }

  createPhases (phase, status, detail) {
    phaseService.scope = this.scope
    const phases = {
      ONE: () => phaseService.create(phaseFactory.phaseOneFactory(status, detail)),
      TWO: () => phaseService.create(phaseFactory.phaseTwoFactory()),
      THREE: () => phaseService.create(phaseFactory.phaseThreeFactory()),
      FOUR: () => phaseService.create(phaseFactory.phaseFourFactory()),
      FIVE: () => phaseService.create(phaseFactory.phaseFiveFactory()),
      SIX: () => phaseService.create(phaseFactory.phaseSixFactory())
    }
    return phases[phase]
  }

  async getById (id) {
    return processModel.findById(id)
      .populate({
        path: 'phases',
        populate: [
          {
            path: 'history',
            populate: { path: 'registerHistory', match: { active: true } }
          },
          {
            path: 'observation',
            match: { active: true }
          }
        ]
      })
      .populate('currentPhase')
      .populate('buyer')
      .populate('manager')
      .populate('agent')
      .populate('seller')
      .populate('bank')
  }

  async getProcessByUserId (stringId) {
    const id = ObjectId(stringId)
    return processModel.aggregate([
      {
        $match: {
          active: true,
          archived: false
        }
      },
      {
        $lookup: {
          from: 'banks',
          localField: 'bank',
          foreignField: '_id',
          as: 'bank'
        }
      },
      { $unwind: { path: '$bank', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'manager',
          foreignField: '_id',
          as: 'manager'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $lookup: {
          from: 'phases',
          localField: 'phases.0',
          foreignField: '_id',
          as: 'phaseOne'
        }
      },
      { $unwind: { path: '$agent', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$manager', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
      { $unwind: '$phaseOne' },
      {
        $match: {
          $or: [
            { buyer: id },
            { 'manager._id': id },
            { 'manager.realEstate': id },
            { 'agent._id': id },
            { 'agent.realEstate': id },
            { 'seller._id': id },
            { 'docs.[0].currentPhase.detail.operationalAnalyst': id }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer'
        }
      },
      {
        $lookup: {
          from: 'phases',
          localField: 'currentPhase',
          foreignField: '_id',
          as: 'currentPhase'
        }
      },
      { $unwind: '$currentPhase' },
      { $unwind: '$buyer' },
      {
        $addFields: {
          commission: {
            $multiply: [parseFloat('$phaseOne.detail.buyAndSell'), parseFloat('$agentCommission')]
          }
        }
      },
      {
        $set: {
          showInList: {
            $cond: {
              if: {
                $eq: ['$currentPhase.identificator', 6],
                // eslint-disable-next-line no-dupe-keys
                $eq: ['$currentPhase.status.finished', true]
              },
              then: false,
              else: true
            }
          }
        }
      },
      {
        $match: {
          showInList: true
        }
      }
    ])
  }

  async paginateHome (options) {
    
    console.log('options',options)
    userService.scope = this.scope
    console.log('userService.scope',userService.scope)
    const {
      limit,
      page,
      archived,
      finished,
      bank,
      startDate,
      endDate,
      phase,
      search,
      status,
      value,
      administratorId,
    } = options

    const admin = await userService.getById(administratorId)
    const responsible = {}
    if (admin.isMaster) responsible.$ne = ''
    else responsible.$eq = ObjectId(administratorId)



    const bankFilter = {}
    if (bank) bankFilter.$eq = ObjectId(bank)
    else bankFilter.$ne = ''

    const sort = options.sort
    var $pagination = options.pagination


    let statusFilter = ''
    if (finished === 'true') statusFilter = 'finished'
    else statusFilter = status

    const [processResults] = await processModel.aggregate([
      {
        $lookup: {
          from: 'phases',
          localField: 'currentPhase',
          foreignField: '_id',
          as: 'currentPhase'
        }
      },
      { $unwind: '$currentPhase' },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer'
        }
      },
      { $unwind: '$buyer' },
      {
        $lookup: {
          from: 'users',
          localField: 'manager',
          foreignField: '_id',
          as: 'manager'
        }
      },
      { $unwind: { path: '$manager', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'banks',
          localField: 'bank',
          foreignField: '_id',
          as: 'bank'
        }
      },
      { $unwind: { path: '$bank', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'realestates',
          localField: 'manager.realEstate',
          foreignField: '_id',
          as: 'manager.realEstate'
        }
      },
      {
        $unwind: {
          path: '$manager.realEstate',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent'
        }
      },
      { $unwind: { path: '$agent', preserveNullAndEmptyArrays: true } },
      {
        $set: { statusArray: { $objectToArray: '$currentPhase.status' } }
      },
      {
        $set: {
          filteredFalseStatus: {
            $filter: {
              input: '$statusArray',
              as: 'el',
              cond: { $eq: ['$$el.v', false] }
            }
          }
        }
      },
      {
        $set: { currentStatus: { $arrayElemAt: ['$filteredFalseStatus', 0] } }
      },
      {
        $set: {
          status: {
            $cond: {
              if: { $eq: ['$currentPhase.detail.status', 'disapproved'] },
              then: 'disapproved',
              else: {
                $cond: {
                  if: { $eq: ['$currentPhase.status.finished', true] },
                  then: 'finished',
                  else: {
                    $cond: {
                      if: {
                        $eq: [{ $size: '$filteredFalseStatus' }, 0]
                      },
                      then: 'waiting',
                      else: '$currentStatus.k'
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          active: 1,
          archived: 1,
          phases: 1,
          bank: 1,
          value: 1,
          responsible: 1,
          currentPhase: 1,
          status: 1,
          'buyer.name': 1,
          'buyer.CPF': 1,
          'agent.name': 1,
          'manager.name': 1,
          'manager.realEstate': 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $match: {

          archived: archived === 'true',
          active: { $eq: true },
          'bank._id': bankFilter,
          createdAt:
            startDate || endDate ? this.matchDate(startDate, endDate) : { $ne: '' },
          'currentPhase.identificator': Number(phase) || { $ne: '' },
          status: statusFilter || { $ne: 'finished' },
        /*  "currentPhase.detail.operationalAnalyst":administratorId || { $ne: '' }  ,*/
          value: value && value !== '0' ? Number(value) : { $ne: '' },
        
        
          $and: [
            { 
              $or: [
                { 'responsible': responsible },
                { 'currentPhase.detail.operationalAnalyst': administratorId }
              ]
            },
            {
              $or: [
                {
                  'buyer.name': search
                    ? { $regex: `.*${search}.*`, $options: '-i' }
                    : {
                        $ne: ''
                      }
                },
                
                {
                  'manager.name': search
                    ? { $regex: `.*${search}.*`, $options: '-i' }
                    : {
                        $ne: ''
                      }
                },
                {
                  'manager.realEstate.name': search
                    ? { $regex: `.*${search}.*`, $options: '-i' }
                    : {
                        $ne: ''
                      }
                },
                {
                  'agent.name': search
                    ? { $regex: `.*${search}.*`, $options: '-i' }
                    : {
                        $ne: ''
                      }
                }
              ]

            }
          ],
              
        
        }
      },
      { $sort: sort },
      
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          docs: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          docs: {
            $slice: [
              '$docs',
              Math.ceil(limit * (page - 1)),
              Math.ceil(limit * page)
            ]
          },
          total: 1
        }
      },
      { $unset: '_id' }
    ])
    if (!processResults) return {}
    const total = processResults.docs.length > 0 ? processResults.total : 0
    const resultsFormated = {
      ...processResults,
      total,
      limit: Number(($pagination == false ? total : limit)),
      page: Number(page),
      pages: total === 0 ? 0 : ($pagination == false ? 1 : Math.ceil(total / 10) )
    }
    return resultsFormated
  }

  matchDate (start, end) {
    start = DateTime.fromFormat(start, 'dd/MM/yyyy')
    end = DateTime.fromFormat(end, 'dd/MM/yyyy')
    if (
      !start || !end ||
      (start.toSeconds() > end.toSeconds())
    ) {
      throw new BadRequestException('Favor informar uma data válida')
    }

    return {
      $gte: start,
      $lte: end
    }
  }

  async getProcessHistory (id) {
    const process = await processModel.findById(id)
    const history = phaseModel.aggregate([
      {
        $match: {
          _id: { $in: process.phases }
        }
      },
      {
        $lookup: {
          from: 'observations',
          localField: 'observation',
          foreignField: '_id',
          as: 'observations'
        }
      },
      {
        $lookup: {
          from: 'histories',
          localField: 'history',
          foreignField: '_id',
          as: 'history'
        }
      },
      { $unwind: '$history' },
      {
        $project: {
          identificator: 1,
          startDate: '$history.startDate',
          finalDate: '$history.finalDate',
          observations: 1,
          history: '$history.registerHistory'
        }
      },
      {
        $lookup: {
          from: 'registers',
          localField: 'history',
          foreignField: '_id',
          as: 'registers'
        }
      },
      {
        $project: {
          identificator: 1,
          startDate: 1,
          finalDate: 1,
          registers: { $concatArrays: ['$observations', '$registers'] }
        }
      },
      { $unwind: { path: '$registers', preserveNullAndEmptyArrays: true } },
      {
        $sort: {
          'registers.createdAt': 1
        }
      },
      {
        $group: {
          _id: '$identificator',
          startDate: { $first: '$startDate' },
          finalDate: { $first: '$finalDate' },
          registers: { $push: '$registers' }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ])
    return history
  }
}

module.exports = ProcessService
