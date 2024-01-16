module.exports = {
  ProcessList: [
    {
      phases: [
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92d8',
          status: {
            creditAnalysis: false
          },
          detail: {
            bank: 'null',
            bankAgency: 'null',
            CCA: 'null',
            immobileValue: 'null',
            buyAndSell: 'null',
            dispatchValue: 'null',
            financedValue: 150000,
            status: 'null',
            valueAproved: 'null',
            financedPercentage: 'null'
          },
          identificator: 1,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.677Z',
          history: {
            registerHistory: [],
            _id: '613160207cd66e002ada92de',
            phaseIdentificator: 1,
            startDate: '2021-09-02T23:37:04.665Z',
            createdAt: '2021-09-02T23:37:04.675Z',
            updatedAt: '2021-09-02T23:37:04.675Z'
          }
        },
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92d9',
          status: {
            paymentDone: false,
            documentationDone: false,
            surveyDone: false,
            immobileAcept: false,
            documentationReady: false
          },
          detail: {
            reportValue: 'null',
            survey: {
              date: 'null',
              hour: 'null'
            }
          },
          identificator: 2,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.665Z'
        },
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92da',
          status: {
            legalAnalysis: false
          },
          detail: {
            analysisSended: 'null',
            analysisDate: 'null',
            analysisResults: [
              {
                date: 'null',
                status: 'null',
                reason: 'null'
              }
            ]
          },
          identificator: 3,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.665Z'
        },
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92db',
          status: {
            subscriptionScheduled: false,
            signedContract: false
          },
          detail: {
            interviewScheduled: false,
            interviewConducted: false,
            interview: {
              date: 'null',
              hour: 'null',
              manager: 'null',
              docs: 'null',
              location: 'null'
            },
            signature: {
              date: 'null',
              hour: 'null',
              location: 'null'
            }
          },
          identificator: 4,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.665Z'
        },
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92dc',
          status: {
            guideFilled: false,
            paymentDone: false,
            budgetSended: false,
            filedProcess: false
          },
          detail: {
            guideProtocol: 'null',
            processProtocol: 'null'
          },
          identificator: 5,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.665Z'
        },
        {
          observation: [],
          docs: [],
          done: false,
          _id: '613160207cd66e002ada92dd',
          status: {
            contractSended: false,
            fundReleased: false,
            finished: false
          },
          detail: {
            submissionDate: 'null'
          },
          identificator: 6,
          createdAt: '2021-09-02T23:37:04.665Z',
          updatedAt: '2021-09-02T23:37:04.665Z'
        }
      ],
      archived: false,
      active: true,
      _id: '613160207cd66e002ada92df',
      bank: {
        active: true,
        _id: '5f32cfeaf6132c001705941f',
        name: 'ITAÚ',
        commission: 0.008,
        createdAt: '2020-08-11T17:05:46.903Z',
        updatedAt: '2020-08-11T17:05:46.903Z',
        commissionPercentage: 0.8,
        id: '5f32cfeaf6132c001705941f'
      },
      buyer: {
        active: true,
        isMaster: false,
        resetPassword: false,
        _id: '612e47168ed5e600388311b2',
        name: 'BRUNO DAMIATI',
        CPF: '36924434800',
        email: 'bhdamiati@gmail.com',
        phone: '43991125243',
        password: '$2b$04$9hhx9xq4ZmRGilCGZby9WuoWxvh8ZYFPhj..x6/XS19LaoStwV/mu',
        role: 'BUYER',
        createdAt: '2021-08-31T15:13:26.105Z',
        updatedAt: '2021-08-31T15:13:26.105Z'
      },
      currentPhase: {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92d8',
        status: {
          creditAnalysis: false
        },
        detail: {
          bank: 'null',
          bankAgency: 'null',
          CCA: 'null',
          immobileValue: 'null',
          buyAndSell: 'null',
          dispatchValue: 'null',
          financedValue: 150000,
          status: 'null',
          valueAproved: 'null',
          financedPercentage: 'null'
        },
        identificator: 1,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.677Z',
        history: '613160207cd66e002ada92de'
      },
      value: 150000,
      manager: {
        active: true,
        isMaster: false,
        resetPassword: true,
        _id: '5f3197f3f6132c001705941e',
        name: 'BRUNO DAMIATI',
        CPF: '48573548029',
        email: 'bhdamiati@gmail.com',
        phone: '43991125243',
        realEstate: '5f31977ef6132c001705941d',
        birthDate: 'null',
        password: '$2b$04$9U9aFQ7PBYpnXQa4.1gBiuANSELcpkiAlgEUtWfbpcRM7Zld5xXVm',
        role: 'MANAGER',
        createdAt: '2020-08-10T18:54:43.151Z',
        updatedAt: '2020-10-14T15:48:09.056Z'
      },
      agent: {
        active: true,
        isMaster: false,
        resetPassword: true,
        _id: '5f32cfb438fea50010e3c33b',
        name: 'BRUNO DAMIATI',
        CPF: '12233996054',
        email: 'bhdamiati@gmail.com',
        phone: '43991125243',
        realEstate: '5f31977ef6132c001705941d',
        birthDate: 'null',
        password: '$2b$04$47apTddQFKhtakRGfCdTXucZcFjGsHRR.wIoKvVdQwHazFNQAOzmy',
        role: 'AGENT',
        createdAt: '2020-08-11T17:04:52.977Z',
        updatedAt: '2021-03-19T00:19:39.955Z',
        notificationToken: 'fdkwk4SESsisN40DaX3K3s:APA91bESjzu0xy1qIGdd39auSVx0eQ4vA_m2aKiQxqDTAY28gmcw_038E3tQ2BubMelQMBdXQkbFgutJsD1C1ggZ1gJxYdRMXpw5_IEj9S67zCZGv-lOEhBoiTqbaY-xHQkVRUSsr8jp'
      },
      seller: {
        active: true,
        isMaster: false,
        resetPassword: false,
        _id: '5f32d4e7f6132c0017059427',
        name: 'BRUNO DAMIATI',
        CPF: '19407898000154',
        email: 'bhdamiati@gmail.com',
        password: '$2b$04$jHHEtTaAljFO80YWG.WXQ.9OBPtxkJ9K5TT2Kg.zcO1nnza44VIX.',
        role: 'SELLER',
        createdAt: '2020-08-11T17:27:03.107Z',
        updatedAt: '2021-09-02T23:40:19.948Z',
        phone: '43991125243'
      },
      responsible: '5f2ac5c190bac50c158ebf0c',
      agentCommission: 0.06,
      createdAt: '2021-09-02T23:37:04.689Z',
      updatedAt: '2021-09-02T23:37:04.689Z'
    }],
  ProcessItem: {
    phases: [
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92d8',
        status: {
          creditAnalysis: false
        },
        detail: {
          bank: 'null',
          bankAgency: 'null',
          CCA: 'null',
          immobileValue: 'null',
          buyAndSell: 'null',
          dispatchValue: 'null',
          financedValue: 150000,
          status: 'null',
          valueAproved: 'null',
          financedPercentage: 'null'
        },
        identificator: 1,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.677Z',
        history: {
          registerHistory: [],
          _id: '613160207cd66e002ada92de',
          phaseIdentificator: 1,
          startDate: '2021-09-02T23:37:04.665Z',
          createdAt: '2021-09-02T23:37:04.675Z',
          updatedAt: '2021-09-02T23:37:04.675Z'
        }
      },
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92d9',
        status: {
          paymentDone: false,
          documentationDone: false,
          surveyDone: false,
          immobileAcept: false,
          documentationReady: false
        },
        detail: {
          reportValue: 'null',
          survey: {
            date: 'null',
            hour: 'null'
          }
        },
        identificator: 2,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.665Z'
      },
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92da',
        status: {
          legalAnalysis: false
        },
        detail: {
          analysisSended: 'null',
          analysisDate: 'null',
          analysisResults: [
            {
              date: 'null',
              status: 'null',
              reason: 'null'
            }
          ]
        },
        identificator: 3,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.665Z'
      },
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92db',
        status: {
          subscriptionScheduled: false,
          signedContract: false
        },
        detail: {
          interviewScheduled: false,
          interviewConducted: false,
          interview: {
            date: 'null',
            hour: 'null',
            manager: 'null',
            docs: 'null',
            location: 'null'
          },
          signature: {
            date: 'null',
            hour: 'null',
            location: 'null'
          }
        },
        identificator: 4,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.665Z'
      },
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92dc',
        status: {
          guideFilled: false,
          paymentDone: false,
          budgetSended: false,
          filedProcess: false
        },
        detail: {
          guideProtocol: 'null',
          processProtocol: 'null'
        },
        identificator: 5,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.665Z'
      },
      {
        observation: [],
        docs: [],
        done: false,
        _id: '613160207cd66e002ada92dd',
        status: {
          contractSended: false,
          fundReleased: false,
          finished: false
        },
        detail: {
          submissionDate: 'null'
        },
        identificator: 6,
        createdAt: '2021-09-02T23:37:04.665Z',
        updatedAt: '2021-09-02T23:37:04.665Z'
      }
    ],
    archived: false,
    active: true,
    _id: '613160207cd66e002ada92df',
    bank: {
      active: true,
      _id: '5f32cfeaf6132c001705941f',
      name: 'ITAÚ',
      commission: 0.008,
      createdAt: '2020-08-11T17:05:46.903Z',
      updatedAt: '2020-08-11T17:05:46.903Z',
      commissionPercentage: 0.8,
      id: '5f32cfeaf6132c001705941f'
    },
    buyer: {
      active: true,
      isMaster: false,
      resetPassword: false,
      _id: '612e47168ed5e600388311b2',
      name: 'BRUNO DAMIATI',
      CPF: '36924434800',
      email: 'bhdamiati@gmail.com',
      phone: '43991125243',
      password: '$2b$04$9hhx9xq4ZmRGilCGZby9WuoWxvh8ZYFPhj..x6/XS19LaoStwV/mu',
      role: 'BUYER',
      createdAt: '2021-08-31T15:13:26.105Z',
      updatedAt: '2021-08-31T15:13:26.105Z'
    },
    currentPhase: {
      observation: [],
      docs: [],
      done: false,
      _id: '613160207cd66e002ada92d8',
      status: {
        creditAnalysis: false
      },
      detail: {
        bank: 'null',
        bankAgency: 'null',
        CCA: 'null',
        immobileValue: 'null',
        buyAndSell: 'null',
        dispatchValue: 'null',
        financedValue: 150000,
        status: 'null',
        valueAproved: 'null',
        financedPercentage: 'null'
      },
      identificator: 1,
      createdAt: '2021-09-02T23:37:04.665Z',
      updatedAt: '2021-09-02T23:37:04.677Z',
      history: '613160207cd66e002ada92de'
    },
    value: 150000,
    manager: {
      active: true,
      isMaster: false,
      resetPassword: true,
      _id: '5f3197f3f6132c001705941e',
      name: 'BRUNO DAMIATI',
      CPF: '48573548029',
      email: 'bhdamiati@gmail.com',
      phone: '43991125243',
      realEstate: '5f31977ef6132c001705941d',
      birthDate: 'null',
      password: '$2b$04$9U9aFQ7PBYpnXQa4.1gBiuANSELcpkiAlgEUtWfbpcRM7Zld5xXVm',
      role: 'MANAGER',
      createdAt: '2020-08-10T18:54:43.151Z',
      updatedAt: '2020-10-14T15:48:09.056Z'
    },
    agent: {
      active: true,
      isMaster: false,
      resetPassword: true,
      _id: '5f32cfb438fea50010e3c33b',
      name: 'BRUNO DAMIATI',
      CPF: '12233996054',
      email: 'bhdamiati@gmail.com',
      phone: '43991125243',
      realEstate: '5f31977ef6132c001705941d',
      birthDate: 'null',
      password: '$2b$04$47apTddQFKhtakRGfCdTXucZcFjGsHRR.wIoKvVdQwHazFNQAOzmy',
      role: 'AGENT',
      createdAt: '2020-08-11T17:04:52.977Z',
      updatedAt: '2021-03-19T00:19:39.955Z',
      notificationToken: 'fdkwk4SESsisN40DaX3K3s:APA91bESjzu0xy1qIGdd39auSVx0eQ4vA_m2aKiQxqDTAY28gmcw_038E3tQ2BubMelQMBdXQkbFgutJsD1C1ggZ1gJxYdRMXpw5_IEj9S67zCZGv-lOEhBoiTqbaY-xHQkVRUSsr8jp'
    },
    seller: {
      active: true,
      isMaster: false,
      resetPassword: false,
      _id: '5f32d4e7f6132c0017059427',
      name: 'BRUNO DAMIATI',
      CPF: '19407898000154',
      email: 'bhdamiati@gmail.com',
      password: '$2b$04$jHHEtTaAljFO80YWG.WXQ.9OBPtxkJ9K5TT2Kg.zcO1nnza44VIX.',
      role: 'SELLER',
      createdAt: '2020-08-11T17:27:03.107Z',
      updatedAt: '2021-09-02T23:40:19.948Z',
      phone: '43991125243'
    },
    responsible: '5f2ac5c190bac50c158ebf0c',
    agentCommission: 0.06,
    createdAt: '2021-09-02T23:37:04.689Z',
    updatedAt: '2021-09-02T23:37:04.689Z'
  },
  AddProcess: {
    bank: '5f32cfeaf6132c001705941f',
    buyer: {
      name: 'BRUNO DAMIATI',
      CPF: '12233996054',
      email: 'bhdamiati@gmail.com',
      phone: '43991125243'
    },
    manager: '5f3197f3f6132c001705941e',
    agent: '5f32cfb438fea50010e3c33b',
    seller: {
      name: 'BRUNO DAMIATI',
      CPF: '65507982058',
      email: 'bhdamiati@gmail.com',
      phone: '43991125243'
    },
    detail: {
      bank: 'null',
      bankAgency: 'null',
      CCA: 'null',
      immobileValue: 'null',
      buyAndSell: 'null',
      dispatchValue: 'null',
      financedValue: 150000,
      status: 'null',
      valueAproved: 'null',
      financedPercentage: 'null'
    },
    status: { creditAnalysis: false },
    idAnalysis: '5f52849aa94d670010d8d19a',
    administratorId: '5f2ac5c190bac50c158ebf0c',
    agentCommission: 0.06
  },
  ProcessPaginated: {
    total: 13,
    docs: [
      {
        _id: '5f4951c40766fb001004bd44',
        phases: [
          '5f4951c40766fb001004bd3c',
          '5f4951c40766fb001004bd3d',
          '5f4951c40766fb001004bd3e',
          '5f4951c40766fb001004bd3f',
          '5f4951c40766fb001004bd40',
          '5f4951c40766fb001004bd41'
        ],
        archived: false,
        active: true,
        bank: {
          _id: '5f35435af6132c001705947a',
          active: true,
          name: 'CAIXA - SBPE',
          commission: 0.011000000000000001,
          createdAt: '2020-08-13T13:42:50.994Z',
          updatedAt: '2020-08-13T13:42:50.994Z'
        },
        buyer: {
          name: 'TEST BUYER ',
          CPF: '05894559073'
        },
        currentPhase: {
          _id: '5f4951c40766fb001004bd3c',
          observation: [],
          docs: [],
          done: false,
          status: {
            creditAnalysis: true
          },
          detail: {
            bank: 'CAIXA - SBPE',
            bankAgency: '0449',
            CCA: '670421',
            immobileValue: 185000,
            buyAndSell: 18.5,
            dispatchValue: 500,
            financedValue: 148000,
            status: 'approved',
            valueAproved: '',
            financedPercentage: '',
            buyer: {
              name: 'TEST BUYER ',
              CPF: '05894559073',
              email: 'test@test.com.br',
              phone: '99999999999'
            },
            seller: {
              active: true,
              isMaster: false,
              resetPassword: false,
              _id: '5f3fc0d1f6132c00170594ef',
              name: 'TEST SELLER ',
              CPF: '04544541042',
              email: 'test@test.com',
              password: '$2b$04$HUiSYWH7EjIFkyhRMvEssOdNvqEUoRHxRRpHwgcyMNbGBjMMNsZ0m',
              role: 'SELLER',
              createdAt: '2020-08-21T12:40:49.969Z',
              updatedAt: '2020-08-21T12:40:49.969Z'
            },
            secondBuyer: {
              name: '',
              CPF: '',
              phone: ''
            }
          },
          identificator: 1,
          createdAt: '2020-08-28T18:49:40.344Z',
          updatedAt: '2021-07-01T17:23:19.238Z',
          history: '5f4951c40766fb001004bd42'
        },
        value: 185000,
        manager: {
          name: 'TEST MANAGER',
          realEstate: {
            _id: '5f3eb810f6132c00170594a8',
            resetPassword: false,
            active: true,
            name: 'TEST IMOVEIS',
            CNPJ: '53963743000123',
            email: 'test@test.com',
            phone: '99999999999',
            password: '$2b$04$WEXIThOAfosgSXUtCGuWleID10rI/w1BpolEfuwwas2NnOU2n494y',
            createdAt: '2020-08-20T17:51:12.528Z',
            updatedAt: '2020-08-20T17:51:12.528Z'
          }
        },
        agent: {
          name: 'TEST AGENT'
        },
        responsible: '5f3a72a538fea50010e3c361',
        createdAt: '2020-08-28T18:49:40.785Z',
        updatedAt: '2021-07-01T17:23:19.232Z',
        status: 'waiting'
      }
    ],
    limit: 1,
    page: 1,
    pages: 1
  },
  ProcessPaginated2: {
    docs: [
      {
        phases: [
          '6133ebf50be6b7008459ba2f',
          '6133ebf50be6b7008459ba30',
          '6133ebf50be6b7008459ba31',
          '6133ebf50be6b7008459ba32',
          '6133ebf50be6b7008459ba33',
          '6133ebf50be6b7008459ba34'
        ],
        archived: false,
        active: true,
        _id: '6133ebf50be6b7008459ba41',
        bank: '5f32cfeaf6132c001705941f',
        responsible: '5f2ac5c190bac50c158ebf0c',
        buyer: '612e47168ed5e600388311b2',
        manager: '5f3197f3f6132c001705941e',
        agent: '5f32cfb438fea50010e3c33b',
        seller: '6133ea510be6b7008459b9b6',
        fromAnalysis: '5f52849aa94d670010d8d19a',
        agentCommission: 0.06,
        currentPhase: '6133ebf50be6b7008459ba2f',
        value: 150000,
        createdAt: '2021-09-04T21:58:13.089Z',
        updatedAt: '2021-09-04T21:58:13.089Z'
      }
    ],
    totalDocs: 290,
    limit: 1,
    totalPages: 290,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: 'null',
    nextPage: 2
  },
  ProcessHistory: [
    {
      _id: 1,
      startDate: '2020-08-11T17:27:03.019Z',
      finalDate: '2020-08-11T17:35:00.092Z',
      registers: [
        {
          _id: '5f32d585f6132c001705942a',
          active: true,
          type: 'StatusRegister',
          newStatus: {
            creditAnalysis: true
          },
          date: '2020-08-11T17:29:41.514Z',
          createdAt: '2020-08-11T17:29:41.516Z',
          updatedAt: '2020-08-11T17:29:41.516Z'
        }
      ]
    }
  ]
}
