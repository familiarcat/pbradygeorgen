const { initSchema } = require("@aws-amplify/datastore")
const { schema } = require("./schema")

const {
  Reference,
  ContactInformation,
  Resume,
  Education,
  Degree,
  Company,
  Accomplishment,
  School,
  Experience,
  Skill,
  Engagement,
  Summary,
} = initSchema(schema)

module.exports = {
  Reference,
  ContactInformation,
  Resume,
  Education,
  Degree,
  Company,
  Accomplishment,
  School,
  Experience,
  Skill,
  Engagement,
  Summary,
}
