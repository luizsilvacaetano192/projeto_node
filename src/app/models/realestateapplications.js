const mongoosePaginate = require('mongoose-paginate-v2')

const { model, Schema } = require('mongoose')

const RealEstateApplicationsSchema = new Schema(
  {
    real_estate_name: { type: String, required: true },
    real_estate_liaison: { type: String, required: true },
    real_estate_phone: { type: String, required: true },
    real_estate_email: { type: String, required: true },
    applicant_email: { type: String, required: true },
    applicant_name: { type: String, required: true }
  },
  { timestamps: true }
)
RealEstateApplicationsSchema.plugin(mongoosePaginate)

RealEstateApplicationsSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest
})

module.exports = model('realEstateApplications', RealEstateApplicationsSchema)
