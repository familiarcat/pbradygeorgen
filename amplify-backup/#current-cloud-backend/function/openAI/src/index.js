/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { DataStore, initSchema } = require("@aws-amplify/datastore")
const awsConfig = require("./post-pull-aws-exports.js")
const { Amplify } = require("aws-amplify")
const schema = require("./schema.js") // Your GraphQL schema
const { Configuration, OpenAIApi } = require("openai")
require("dotenv").config()

// // Initialize Amplify and schema

const {
  ContactInformation,
  Reference,
  Resume,
  School,
  Degree,
  Company,
  Accomplishment,
  Skill,
  Engagement,
  Summary,
} = schema

exports.handler = async (event) => {
  Amplify.configure(awsConfig.default)
  const consoleColors = {
    Reset: "\x1b[0m",
    Cyan: "\x1b[36m",
    LightGreen: "\x1b[92m",
    Orange: "\x1b[33m",
  }

  const logWithColor = (color, message) => {
    console.log(color + message + consoleColors.Reset)
  }

  // console.log(awsConfig.default)

  const apiKey = process.env.OPEN_AI_KEY
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  })
  logWithColor(consoleColors.Cyan, `OpenAI config: \n ${JSON.stringify(configuration, null, 2)}`)

  async function getAiResponse(topic) {
    logWithColor(consoleColors.LightGreen, "\ngettingAiResponse\n")
    const openai = new OpenAIApi(configuration)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: topic,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.7,
    })
    return completion.data.choices[0].text
  }

  try {
    logWithColor(consoleColors.Orange, "before fetching Resumes")
    const fetchedResumes = await DataStore.query(Resume)
    console.log("\n\nafter Resume Fetch", fetchedResumes)
    const hydratedResumes = []

    for (const resume of fetchedResumes) {
      // initialize the resume to hydrate
      const _r = { ...resume }
      _r.Summary = await resume.Summary
      _r.ContactInformation = await resume.ContactInformation
      _r.Education = await {
        ...resume.Education,
        Schools: [],
        summary: "Default Education Summary",
      }
      _r.Experience = await {
        ...resume.Experience,
        Companies: [],
      }

      // hydrate Education
      const Education = await resume.Education
      try {
        for (const school of await Education.Schools.toArray()) {
          const _school = { ...school, Degrees: [] }
          _school.Degrees = await school.Degrees.toArray()
          _r.Education.Schools.push(_school)
        }
        const request = `parse from JSON data and write a summary of my education history given the following JSON data: ${JSON.stringify(
          _r.Education.Schools,
        )}. Include the school name and Degrees in an overview of my education history`
        // logWithColor(consoleColors.LightGreen, request)
        const response = await getAiResponse(request)
        logWithColor(consoleColors.Orange, response)
      } catch (error) {
        console.log(error)
        _r.Education.summary = "Error in Education after parsing"
      }

      // hydrate Experience
      const Experience = await resume.Experience
      try {
        for (const company of await Experience.Companies.toArray()) {
          const _company = {
            ...company,
            Accomplishments: [],
            Engagements: [],
            Skills: [],
          }

          const Accomplishments = await company.Accomplishments.toArray()
          for (const accomplishment of Accomplishments) {
            const _accomplishment = { ...accomplishment, Skills: [] }
            for (const skill of await accomplishment.Skills.toArray()) {
              _accomplishment.Skills.push(skill)
            }
            _company.Accomplishments.push(_accomplishment)
          }

          const Skills = await company.Skills.toArray()
          for (const skill of Skills) {
            const _skill = { ...skill }
            _company.Skills.push(_skill)
          }

          const Engagements = await company.Engagements.toArray()
          for (const engagement of Engagements) {
            const _engagement = { ...engagement, Accomplishments: [] }
            const Accomplishments = await Promise.resolve(engagement.Accomplishments.toArray())

            for (const accomplishment of Accomplishments) {
              const _accomplishment = { ...accomplishment, Skills: [] }
              for (const skill of await accomplishment.Skills.toArray()) {
                _accomplishment.Skills.push(skill)
              }

              const request = `parse the Engagement JSON data: ${JSON.stringify(
                _accomplishment,
              )} and write a brief summary of what individual Accomplishment I achieved for this engagement referencing the list of Skills I employed for that Accomplishment`
              // logWithColor(consoleColors.LightGreen, request)
              const response = await getAiResponse(request)
              logWithColor(consoleColors.Orange, response)
              _engagement.Accomplishments.push(_accomplishment)
            }

            _company.Engagements.push(_engagement)
          }
          // logWithColor(consoleColors.Cyan, JSON.stringify(_r.Experience, null, 2))
          // logWithColor(consoleColors.Reset)
          _r.Experience.Companies.push(_company)
        }
      } catch (error) {
        console.error(error)
        _r.Experience.summary = "No Experience"
      }
      hydratedResumes.push(_r)
    }

    return {
      statusCode: 200,
      body: "Success",
      // body: JSON.stringify(hydratedResumes),
      headers: {
        "Content-Type": "application/json",
      },
    }
  } catch (error) {
    console.error("error: ", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong with loading the data tree." }),
    }
  }
}
