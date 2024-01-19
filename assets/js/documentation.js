const documentation = {
  partnership: '',
  email: '',
  code: {
    tag: 'a',
    text: 'Fazer Simulação',
    attributes: [
      {
        name: 'target',
        value: `_blank`,
      },
      {
        name: 'style',
        value: `background-color: #005FAC;
        color: white;
        padding: 10px 32px;
        text-decoration: none;
        border-radius: 4px;`,
      },
    ]
  },
  params: [
    {
      name: 'partnership',
      type: 'string',
      required: true,
      descriptions: [
        'ID do parceiro no sistema.',
        'Não Alterar'
      ],
    },
    {
      name: 'email',
      type: 'string',
      required: true,
      descriptions: ['Email para o qual será notificado quando uma simulação for feita.'],
    },
    {
      name: 'value',
      type: 'int',
      required: true,
      descriptions: [
        'Valor do imóvel.',
        'Ex.: R$ 250.000,00 deve ser informado como 25000000.'
      ],
    },
    {
      name: 'entryValue',
      type: 'int',
      required: false,
      descriptions: [
        'Valor de entrada do imóvel.',
        'Ex.: R$ 50.000,00 deve ser informado como 5000000.',
        'Caso não informado o sistema irá preencher como 20% do valor do imóvel.'
      ],
    },
    {
      name: 'birthDate',
      type: 'string',
      required: true,
      descriptions: ['Data de nascimento no formato aaaa-mm-dd.'],
    },
    {
      name: 'months',
      type: 'int',
      required: false,
      descriptions: [
        'Número de parcelas.',
        'Valor máximo de 420 parcelas.',
        'Caso o número informado seja maior que o permitido pela data de nascimento o sistema irá corrigir o valor baseado na data de nascimento.',
        'Caso não informado o sistema irá preencher com o maior número de parcelas possíveis baseado na data de nascimento.'
      ],
    },
  ],
  setRequiredData (partnership, email) {
    this.partnership = partnership;
    this.email = email;

    this.code.attributes.unshift({
      name: 'href',
      value: `https://simulador/#/results?partnership=${this.partnership}&email=${this.email}&value=25000000&entryValue=5000000&birthDate=2001-01-01&months=300`,
    });
  }
}

export default documentation;