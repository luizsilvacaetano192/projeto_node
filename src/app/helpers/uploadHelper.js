const AWS = require('aws-sdk')
const { InternalServerError } = require('../middlewares/errors')

const config = {
  accessKeyId: process.env.AWSAccessKeyId,
  region: process.env.region,
  secretAccessKey: process.env.AWSSecretKey
}

const s3 = new AWS.S3(config)

const upload = async (
  phaseId,
  processId,
  complementar,
  file
) => {
  try {
    const key = file.originalname

    const params = {
      ACL: 'public-read',
      Body: Buffer.from(file.buffer),
      Bucket: process.env.bucketName,
      Key: complementar
        ? `processos/${processId}/fase/${phaseId}/${key}`
        : `processos/${processId}/fase/${phaseId}/DocumentosComplementares/${key}`
    }
    return await s3.upload(params).promise()
  } catch (error) {
    throw new InternalServerError('Não foi possível fazer upload do arquivo!')
  }
}

module.exports = {
  upload
}
