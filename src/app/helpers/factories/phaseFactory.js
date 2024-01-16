const PHASE = require('../enum/phases.enum')

const phaseOneFactory = (
  status = {
    creditAnalysis: false
  },
  detail = {
    bank: null,
    bankAgency: null,
    CCA: null,
    immobileValue: null,
    buyAndSell: null,
    dispatchValue: null,
    financedValue: null,
    status: null,
    valueAproved: null,
    financedPercentage: null
  }
) => ({
  status,
  detail,
  identificator: PHASE.ONE,
  history : null
})

const phaseTwoFactory = (
  status = {
    paymentDone: false,
    documentationDone: false,
    surveyDone: false,
    immobileAcept: false,
    documentationReady: false
  },
  detail = {
    reportValue: null,
    survey: {
      date: null,
      hour: null
    }
  }
) => ({
  status,
  detail,
  identificator: PHASE.TWO
})

const phaseThreeFactory = (
  status = {
    legalAnalysis: false
  },
  detail = {
    analysisSended: null,
    analysisDate: null,
    analysisResults: [
      {
        date: null,
        status: null,
        reason: null
      }
    ]
  }
) => ({
  status,
  detail,
  identificator: PHASE.THREE
})

const phaseFourFactory = (
  status = {
    subscriptionScheduled: false,
    signedContract: false
  },
  detail = {
    interviewScheduled: false,
    interviewConducted: false,
    interview: {
      date: null,
      hour: null,
      manager: null,
      docs: null,
      location: null
    },
    signature: {
      date: null,
      hour: null,
      location: null
    }
  }
) => ({
  status,
  detail,
  identificator: PHASE.FOUR
})

const phaseFiveFactory = (
  status = {
    guideFilled: false,
    paymentDone: false,
    budgetSended: false,
    filedProcess: false
  },
  detail = {
    guideProtocol: null,
    processProtocol: null
  }
) => ({
  status,
  detail,
  identificator: PHASE.FIVE
})

const phaseSixFactory = (
  status = {
    contractSended: false,
    fundReleased: false,
    finished: false
  },
  detail = {
    submissionDate: null
  }
) => ({
  status,
  detail,
  identificator: PHASE.SIX
})

module.exports = {
  phaseOneFactory,
  phaseTwoFactory,
  phaseThreeFactory,
  phaseFourFactory,
  phaseFiveFactory,
  phaseSixFactory
}
