
var FormData = require('form-data');
var fs = require('fs');
const axios = require('axios')

const emailSender = {
  url: 'https://codefrog.com.br/email/send',
  config: {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  },
  to: 'luizcaetano182@gmail.com',
  subject: 'Simulação -  Crédito Imobiliário',
 
  async sendEmail (message,email) {
    let formData = new URLSearchParams();
    formData.append('to',email);
    formData.append('subject', this.subject);
    formData.append('message', message);

    const response = await axios.request({
      url : this.url,
      method: 'POST',
      //headers: {'Content-Type': 'multipart/form-data'},
      data: formData
    });

   
   /* axios.post(this.url, formData, this.config).then((response) => { 
      console.log('response',response);
    });*/
  }
}

module.exports =  emailSender;