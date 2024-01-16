module.exports = {
  NotificationList:
    [
      {
        opened: false,
        _id: '60feed94a6b1f00017a59b94',
        process: {
          phases: [
            '60fabcc073fd5e0017329478',
            '60fabcc073fd5e0017329479',
            '60fabcc073fd5e001732947a',
            '60fabcc073fd5e001732947b',
            '60fabcc073fd5e001732947c',
            '60fabcc073fd5e001732947d'
          ],
          archived: false,
          active: true,
          _id: '60fabcc073fd5e001732947f',
          bank: '5f35436238fea50010e3c360',
          buyer: '60dcae381c866b002eca9f12',
          currentPhase: '60fabcc073fd5e001732947a',
          value: 160000,
          manager: '5f3eb855f6132c00170594a9',
          agent: '5f3ebbb4f6132c00170594be',
          seller: '60f81cbb9df3d400102e0a8b',
          responsible: '60a54c6c7357dd00176e790e',
          agentCommission: 0.06,
          createdAt: '2021-07-23T12:57:36.516Z',
          updatedAt: '2021-08-10T18:49:39.058Z',
          secondBuyer: {
            name: '',
            CPF: '',
            phone: ''
          }
        },
        buyer: {
          active: true,
          isMaster: false,
          resetPassword: true,
          _id: '60dcae381c866b002eca9f12',
          name: 'Teste Buyer',
          CPF: '85445215091',
          email: 'testebuyer@gmail.com',
          phone: '78573891025',
          password: '$2b$04$zCCP/zujj5rXFvJa1lSSL.lwUhk5PFuqFB.BEAxfeHpbdCmKRvClu',
          role: 'BUYER',
          createdAt: '2021-06-30T17:47:36.500Z',
          updatedAt: '2021-07-26T14:28:17.825Z'
        },
        phase: {
          observation: [
            '60fad2c59df3d400102e0b1c',
            '60fff2357981ff0010b2a7a2',
            '6101c5267981ff0010b2a804'
          ],
          docs: [],
          done: true,
          _id: '60fabcc073fd5e0017329479',
          status: {
            paymentDone: true,
            documentationDone: true,
            surveyDone: true,
            immobileAcept: true,
            documentationReady: true
          },
          detail: {
            reportValue: 160000,
            survey: {
              date: '02/08/2021',
              hour: '08:30'
            }
          },
          identificator: 2,
          createdAt: '2021-07-23T12:57:36.491Z',
          updatedAt: '2021-08-10T18:49:39.080Z',
          history: '60fad2c09df3d400102e0b1b'
        },
        administrator: '60a54c6c7357dd00176e790e',
        document: 'Comprovante de Pagamento',
        createdAt: '2021-07-26T17:15:00.190Z',
        updatedAt: '2021-07-26T17:15:00.190Z'
      }
    ],
  NotificationItem: {
    opened: true,
    _id: '5f773d16bd089000105deba1',
    process: '5f3fc6cff6132c0017059503',
    buyer: '5f3fc6cff6132c0017059502',
    phase: '5f3fc6cef6132c00170594fb',
    administrator: '5f3a72a538fea50010e3c361',
    document: 'documento complementar',
    createdAt: '2020-10-02T14:45:42.370Z',
    updatedAt: '2021-09-20T05:49:23.219Z'
  }
}
