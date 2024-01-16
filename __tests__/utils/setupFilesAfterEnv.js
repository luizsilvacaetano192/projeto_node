const { beforeAll, afterAll } = require('@jest/globals')
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')

let connection
let db

// Conecta com o banco
beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  db = await connection.db()
})

afterAll(async () => {
  // Limpa os dados
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }

  // Encerra a conexão
  await connection.close()
})
