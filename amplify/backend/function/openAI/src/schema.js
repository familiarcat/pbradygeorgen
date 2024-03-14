/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { initSchema } = require("@aws-amplify/datastore")
const schema = require("./schema.common")
const models = initSchema(schema)

module.exports = models
