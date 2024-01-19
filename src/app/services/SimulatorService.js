const Services = require('./Services')
const { InternalServerError } = require('../middlewares/errors')
const simulationBanks = require('../../../assets/js/simulation-banks')
const SimulationHelper = require('../../../assets/js/simulation-helper')
const constants = require('../../../assets/js/constants');
const senderEmail = require('../../../assets/js/email-sender');
//const { unmaskMoney,maskMoneyBR,unmaskDate,maskDateBR } = require('../../../assets/js/mask-helper');
const { DateTime, Interval } = require("luxon");
const axios = require('axios')
const RealEstateService = require('./RealEstateService')

const services = require('../services')



class SimulatorService extends Services {
  constructor () {
    super(
      'simulators',
      'Simulator'
    )
  }


  data () {
    return {
      // filters
      buildingCost: '',
      buildingEntryCost: '',
      birthDate: '',
      months: '',
      // simulation
      simulations: []
    }
  }


  mounted () {
		// this.$store.commit('setFilters', {
		// 	buildingCost: 'R$ 1.500.000,00',
		// 	birthDate: '13/09/1966',
		// });

	}


  //setGenerateReportEvent () {
  //  this.$root.$on('generateReport', (simulation) => this.$refs.simulationReport.generateReport(simulation));
  //}

  checkDataSource (req) {

    //if (typeof req.query.partnership != "undefined") {
      
      this.getDataFromQuery(req);
  //  }

    this.getDataFromStore(req);
    this.autocompleteEmptyFilters(req);
    this.simulate(req);
  }

  getDataFromQuery (req) {
   // console.log(' req.query', req.query)
    let { value, entryValue, birthDate, months } = req.query;

    //console.log('value do imovel',value)

    const floatingBuildingCostString = `${value.substring(0, value.length - 2)}.${value.substring(value.length - 2)}`;
  
    const maskedBuildingCost = maskMoneyBR(parseFloat(floatingBuildingCostString));
   
    let maskedBuildingEntryCost = '';

    if (entryValue) {
      const floatingBuildingEntryCostString = `${entryValue.substring(0, entryValue.length - 2)}.${entryValue.substring(entryValue.length - 2)}`;

      maskedBuildingEntryCost = maskMoneyBR(parseFloat(floatingBuildingEntryCostString));

    } else {
    
      maskedBuildingEntryCost = maskMoneyBR(parseFloat(floatingBuildingCostString) * defaultEntryValuePercent);
     
    }

    if (birthDate) {

      birthDate = (birthDate);
    }




  let storage = {
      buildingCost: maskedBuildingCost,
      buildingEntryCost: maskedBuildingEntryCost,
      birthDate: birthDate,
      months: months
    };

   return storage;
  }

  getDataFromStore (req) {
    //console.log('query 1')
    const filters = this.getDataFromQuery(req);
    //console.log('query 1 final')
    //console.log('filters',filters)

    this.buildingCost = filters.buildingCost;
    this.buildingEntryCost = filters.buildingEntryCost;
    this.birthDate = filters.birthDate;
    this.months = filters.months;
  }
  autocompleteEmptyFilters () {
    if (this.buildingCost) {
      if (!this.buildingEntryCost) {
        const rawBuildingEntryCost = unmaskMoney(this.buildingCost) * defaultEntryValuePercent;

        this.buildingEntryCost = maskMoneyBR(rawBuildingEntryCost);
       
      }
    }

    if (this.birthDate) {
      if (!this.months) {
        let inputBirthDate = (this.birthDate);
        const birthDate = DateTime.fromISO(inputBirthDate);
        const today = DateTime.now();
        const age = Interval.fromDateTimes(birthDate, today);

        const ageValue = parseInt((maxYears - age.length('years')) * 12);

        this.months = Math.min(ageValue, defaultMonths);
      }
    }

  

    let storage ={
      buildingCost: this.buildingCost,
      buildingEntryCost: this.buildingEntryCost,
      birthDate: this.birthDate,
      months: this.months,
    };

    return storage;


  }

  simulate (req) {
    this.getDataFromStore(req);

   // if (this.hasMinimumData()) {
      //this.openLoadingModal();
     // this.createSimulations();

      //setTimeout(this.closeLoadingModal, 750);
   // }
  }
  /*openFiltersModal () {
    this.$modal.show('filters-modal')
  }
  openLoadingModal () {
    this.$modal.show('loading-modal')
  }
  closeLoadingModal () {
    this.$modal.hide('loading-modal')
  }
  hasMinimumData () {
    return this.buildingCost && this.buildingEntryCost && this.birthDate && this.months;
  }*/
  debugData () {
  //  console.log('store: ', this.$store.getters.getFilters);
  //  console.log('buildingCost: ', this.buildingCost);
  //  console.log('buildingEntryCost: ', this.buildingEntryCost);
  //  console.log('birthDate: ', this.birthDate);
   // console.log('months: ', this.months);
  }

  async calculed (req, res, next) {

      this.checkDataSource(req);
      //this.setGenerateReportEvent();
      
			this.simulations = [];

			const buildingCost = parseFloat(parseFloat(req.query.value).toFixed(2)) ;
			const buildingEntryCost = parseFloat(parseFloat(req.query.entryValue).toFixed(2)) ; 
			const entryCostPercent = (buildingEntryCost * 100) / buildingCost;


			for (let i = 0; i < simulationBanks.length; i++) {
				const bank = simulationBanks[i];

				let exceedsMonthLimit = parseInt(req.query.months) > parseInt(bank.maxMonths);

				if (exceedsMonthLimit) {
					continue;
				}

				if (entryCostPercent < bank.minEntryValuePercent) {
					continue;
				}

				let simulationInfoTR;
				let simulationInfoSavings;

				if (bank.yearlyFeeTR) {

					const simulationTR = new SimulationHelper(buildingCost, buildingEntryCost, (bank.yearlyFeeTR / 100), req.query.months, req.query.birthDate, bank.mip, bank.name, bank.minIncomeRatio, bank.img);
    
        
          simulationTR.calcular();

					simulationInfoTR = simulationTR.getValoresFormatados();
 
				}

				if (bank.yearlyFeeSavings) {

      
       
					const simulationSavings = new SimulationHelper(buildingCost, buildingEntryCost, (bank.yearlyFeeSavings + constants.fixedSelic) / 100, req.query.months, this.birthDate, bank.mip, bank.name, bank.minIncomeRatio, bank.img);
				
          simulationSavings.calcular();
         
					simulationInfoSavings = simulationSavings.getValoresFormatados();
				}

				if (simulationInfoTR && simulationInfoSavings) {
					if (simulationInfoTR.comparativeFinancedValue < simulationInfoSavings.comparativeFinancedValue) {
						this.simulations.push(simulationInfoTR);
					} else {
						this.simulations.push(simulationInfoSavings);
					}

				} else if (simulationInfoTR) {
					this.simulations.push(simulationInfoTR);

				} else {
					this.simulations.push(simulationInfoSavings);
				}
       
			}


    
      console.log('req.query.partnershi',req.query.partnership)

      if((typeof req.query.partnership != 'undefined') && (req.query.partnership !== "")  ){

         const realEstateService = new RealEstateService()

        const retorno = await realEstateService.findOne({_id: req.query.partnership})

    
        let message = `<h3>Nova simulação realizada pelo parceiro: ${retorno.name}</h3>
        com o lead : ${req.query.leadName} - Data de Nascimento: ${maskDateBR(req.query.birthDate)} <br>
        Contato:  ${req.query.leadEmail} - ${req.query.leadPhone}<br>
        No valor de ${req.query.value} com ${req.query.entryValue} de entrada em ${req.query.months} parcelas <br>`;

      
        let message2 = `<h3>Nova simulação realizada por : ${req.query.leadName}</h3>
        Data de Nascimento: ${maskDateBR(req.query.birthDate)} <br>
        Contato:  ${req.query.leadEmail} - ${req.query.leadPhone}<br>
        No valor de ${req.query.value} com ${req.query.entryValue} de entrada em ${req.query.months} parcelas <br>`;

     
        senderEmail.sendEmail(message2,req.query.email);
        senderEmail.sendEmail(message,'email@email');

      }
      else
      {

    
   
        let message2 = `<h3>Nova simulação realizada por : ${req.query.leadName}</h3>
        Data de Nascimento: ${maskDateBR(req.query.birthDate)} <br>
        Contato:  ${req.query.leadEmail} - ${req.query.leadPhone}<br>
        No valor de ${req.query.value} com ${req.query.entryValue} de entrada em ${req.query.months} parcelas <br>`;

        senderEmail.sendEmail(message2,'simulador@email');
    

      }

     
      return this.simulations
	

  }



  
}

module.exports = SimulatorService
