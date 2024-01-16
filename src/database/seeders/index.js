const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

module.exports = {
  run () {
    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
      })
      .forEach(file => {
        const seeder = require(path.join(__dirname, file))
        const seederToRun = Object.keys(seeder)
        seederToRun.forEach((item) => {
          seeder[item]()
        })
      })
  }
}
