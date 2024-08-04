const Amplify = require("@aws-amplify/core").default
const AWSAppSyncClient = require("aws-appsync").default
const gql = require("graphql-tag")
const fetch = require("isomorphic-fetch")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Amplify configuration
const awsconfig = {
  aws_project_region: process.env.REGION,
  aws_cognito_identity_pool_id: process.env.IDENTITY_POOL_ID,
  aws_cognito_region: process.env.REGION,
  aws_user_pools_id: process.env.USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.USER_POOL_WEB_CLIENT_ID,
  aws_appsync_graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.REGION,
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: process.env.API_KEY,
}

Amplify.configure(awsconfig)

// AWS AppSync client setup
const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  disableOffline: true, // Disables offline features for server-side use
})

// Utility function to convert a date string to AWSDate format
function AWSDateConverter(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${year}-${month}-${day}`
}

// GraphQL mutations
const ADD_CONTACT_INFORMATION_MUTATION = gql`
  mutation CreateContactInformation($input: CreateContactInformationInput!) {
    createContactInformation(input: $input) {
      id
      name
      email
      phone
    }
  }
`

const ADD_REFERENCE_MUTATION = gql`
  mutation CreateReference($input: CreateReferenceInput!) {
    createReference(input: $input) {
      id
      name
      phone
      email
      contactinformationID
    }
  }
`

const ADD_RESUME_MUTATION = gql`
  mutation CreateResume($input: CreateResumeInput!) {
    createResume(input: $input) {
      id
      title
    }
  }
`

const ADD_SUMMARY_MUTATION = gql`
  mutation CreateSummary($input: CreateSummaryInput!) {
    createSummary(input: $input) {
      id
      goals
      persona
      url
      headshot
      gptResponse
    }
  }
`

const ADD_EDUCATION_MUTATION = gql`
  mutation CreateEducation($input: CreateEducationInput!) {
    createEducation(input: $input) {
      id
      summary
    }
  }
`

const ADD_SCHOOL_MUTATION = gql`
  mutation CreateSchool($input: CreateSchoolInput!) {
    createSchool(input: $input) {
      id
      name
      educationID
    }
  }
`

const ADD_DEGREE_MUTATION = gql`
  mutation CreateDegree($input: CreateDegreeInput!) {
    createDegree(input: $input) {
      id
      major
      startYear
      endYear
      schoolID
    }
  }
`

const ADD_EXPERIENCE_MUTATION = gql`
  mutation CreateExperience($input: CreateExperienceInput!) {
    createExperience(input: $input) {
      id
      title
      text
      gptResponse
    }
  }
`

const ADD_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      role
      startDate
      endDate
      historyID
      title
      gptResponse
    }
  }
`

const ADD_ENGAGEMENT_MUTATION = gql`
  mutation CreateEngagement($input: CreateEngagementInput!) {
    createEngagement(input: $input) {
      id
      client
      startDate
      endDate
      companyID
      gptResponse
    }
  }
`

const ADD_ACCOMPLISHMENT_MUTATION = gql`
  mutation CreateAccomplishment($input: CreateAccomplishmentInput!) {
    createAccomplishment(input: $input) {
      id
      title
      description
      link
      companyID
      engagementID
    }
  }
`

const ADD_SKILL_MUTATION = gql`
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(input: $input) {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
    }
  }
`

// GraphQL delete mutations
const DELETE_REFERENCE_MUTATION = gql`
  mutation DeleteReference($input: DeleteReferenceInput!) {
    deleteReference(input: $input) {
      id
    }
  }
`

const DELETE_CONTACT_INFORMATION_MUTATION = gql`
  mutation DeleteContactInformation($input: DeleteContactInformationInput!) {
    deleteContactInformation(input: $input) {
      id
    }
  }
`

const DELETE_RESUME_MUTATION = gql`
  mutation DeleteResume($input: DeleteResumeInput!) {
    deleteResume(input: $input) {
      id
    }
  }
`

const DELETE_EDUCATION_MUTATION = gql`
  mutation DeleteEducation($input: DeleteEducationInput!) {
    deleteEducation(input: $input) {
      id
    }
  }
`

const DELETE_DEGREE_MUTATION = gql`
  mutation DeleteDegree($input: DeleteDegreeInput!) {
    deleteDegree(input: $input) {
      id
    }
  }
`

const DELETE_COMPANY_MUTATION = gql`
  mutation DeleteCompany($input: DeleteCompanyInput!) {
    deleteCompany(input: $input) {
      id
    }
  }
`

const DELETE_ACCOMPLISHMENT_MUTATION = gql`
  mutation DeleteAccomplishment($input: DeleteAccomplishmentInput!) {
    deleteAccomplishment(input: $input) {
      id
    }
  }
`

const DELETE_SCHOOL_MUTATION = gql`
  mutation DeleteSchool($input: DeleteSchoolInput!) {
    deleteSchool(input: $input) {
      id
    }
  }
`

const DELETE_EXPERIENCE_MUTATION = gql`
  mutation DeleteExperience($input: DeleteExperienceInput!) {
    deleteExperience(input: $input) {
      id
    }
  }
`

const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($input: DeleteSkillInput!) {
    deleteSkill(input: $input) {
      id
    }
  }
`

const DELETE_ENGAGEMENT_MUTATION = gql`
  mutation DeleteEngagement($input: DeleteEngagementInput!) {
    deleteEngagement(input: $input) {
      id
    }
  }
`

const DELETE_SUMMARY_MUTATION = gql`
  mutation DeleteSummary($input: DeleteSummaryInput!) {
    deleteSummary(input: $input) {
      id
    }
  }
`

// Function to delete all data with pagination and batch processing
async function deleteAllData() {
  // Pagination query to get the list of all items for each type
  const listQueries = [
    { queryName: "listReferences", deleteMutation: DELETE_REFERENCE_MUTATION },
    { queryName: "listContactInformations", deleteMutation: DELETE_CONTACT_INFORMATION_MUTATION },
    { queryName: "listResumes", deleteMutation: DELETE_RESUME_MUTATION },
    { queryName: "listEducations", deleteMutation: DELETE_EDUCATION_MUTATION },
    { queryName: "listDegrees", deleteMutation: DELETE_DEGREE_MUTATION },
    { queryName: "listCompanies", deleteMutation: DELETE_COMPANY_MUTATION },
    { queryName: "listAccomplishments", deleteMutation: DELETE_ACCOMPLISHMENT_MUTATION },
    { queryName: "listSchools", deleteMutation: DELETE_SCHOOL_MUTATION },
    { queryName: "listExperiences", deleteMutation: DELETE_EXPERIENCE_MUTATION },
    { queryName: "listSkills", deleteMutation: DELETE_SKILL_MUTATION },
    { queryName: "listEngagements", deleteMutation: DELETE_ENGAGEMENT_MUTATION },
    { queryName: "listSummaries", deleteMutation: DELETE_SUMMARY_MUTATION },
  ]

  for (const { queryName, deleteMutation } of listQueries) {
    let nextToken = null
    do {
      const listQuery = gql`
        query ${queryName}($limit: Int, $nextToken: String) {
          ${queryName}(limit: $limit, nextToken: $nextToken) {
            items {
              id
              _version
            }
            nextToken
          }
        }
      `

      const result = await client.query({
        query: listQuery,
        variables: { limit: 100, nextToken },
        fetchPolicy: "network-only",
      })

      const items = result.data[queryName].items
      nextToken = result.data[queryName].nextToken

      const deletePromises = items.map(({ id, _version }) =>
        client.mutate({
          mutation: deleteMutation,
          variables: { input: { id, _version } },
        }),
      )

      // Process deletions in batches of 25 to avoid overwhelming AppSync
      for (let i = 0; i < deletePromises.length; i += 25) {
        await Promise.all(deletePromises.slice(i, i + 25))
      }
    } while (nextToken)
  }
}

// Function to create records concurrently
async function createRecords() {
  // Create Contact Information
  const contactInfoResult = await client.mutate({
    mutation: ADD_CONTACT_INFORMATION_MUTATION,
    variables: {
      input: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
    },
  })

  const contactInfoID = contactInfoResult.data.createContactInformation.id

  // Create References for Contact Information concurrently
  const referencePromises = Array.from({ length: 3 }, (_, i) =>
    client.mutate({
      mutation: ADD_REFERENCE_MUTATION,
      variables: {
        input: {
          name: `Reference ${i + 1}`,
          phone: `123-456-789${i}`,
          email: `reference${i + 1}@example.com`,
          contactinformationID: contactInfoID,
        },
      },
    }),
  )
  await Promise.all(referencePromises)

  // Create Resume
  const resumeResult = await client.mutate({
    mutation: ADD_RESUME_MUTATION,
    variables: {
      input: {
        title: "Sample Resume",
      },
    },
  })

  const resumeID = resumeResult.data.createResume.id

  // Create Summary for Resume
  await client.mutate({
    mutation: ADD_SUMMARY_MUTATION,
    variables: {
      input: {
        goals: "Become a software developer",
        persona: "Hardworking and dedicated",
        url: "http://example.com",
        headshot: "http://example.com/headshot.jpg",
        gptResponse: "Generated by GPT",
      },
    },
  })

  // Create Education for Resume
  const educationResult = await client.mutate({
    mutation: ADD_EDUCATION_MUTATION,
    variables: {
      input: {
        summary: "Education Summary",
      },
    },
  })

  const educationID = educationResult.data.createEducation.id

  // Create Schools and Degrees concurrently
  const schoolPromises = Array.from({ length: 3 }, async (_, i) => {
    const schoolResult = await client.mutate({
      mutation: ADD_SCHOOL_MUTATION,
      variables: {
        input: {
          name: `School ${i + 1}`,
          educationID: educationID,
        },
      },
    })

    const schoolID = schoolResult.data.createSchool.id

    const degreePromises = Array.from({ length: 3 }, (_, j) =>
      client.mutate({
        mutation: ADD_DEGREE_MUTATION,
        variables: {
          input: {
            major: `Major ${j + 1}`,
            startYear: AWSDateConverter(`${new Date().getFullYear() - j}-01-01`),
            endYear: AWSDateConverter(`${new Date().getFullYear() - j + 4}-01-01`),
            schoolID: schoolID,
          },
        },
      }),
    )

    const accomplishmentPromises = Array.from({ length: 3 }, (_, k) =>
      client.mutate({
        mutation: ADD_ACCOMPLISHMENT_MUTATION,
        variables: {
          input: {
            title: `School Accomplishment ${k + 1}`,
            description: "Accomplishment Description",
            link: "http://example.com",
            companyID: null,
            engagementID: null,
          },
        },
      }),
    )

    await Promise.all([...degreePromises, ...accomplishmentPromises])
  })

  await Promise.all(schoolPromises)

  // Create Experience for Resume
  const experienceResult = await client.mutate({
    mutation: ADD_EXPERIENCE_MUTATION,
    variables: {
      input: {
        title: "Experience Title",
        text: "Experience Description",
        gptResponse: "Generated by GPT",
      },
    },
  })

  const experienceID = experienceResult.data.createExperience.id

  // Create Companies, Engagements, Accomplishments, and Skills concurrently
  const companyPromises = Array.from({ length: 3 }, async (_, i) => {
    const companyResult = await client.mutate({
      mutation: ADD_COMPANY_MUTATION,
      variables: {
        input: {
          name: `Company ${i + 1}`,
          role: `Role ${i + 1}`,
          startDate: AWSDateConverter(new Date().toISOString()),
          endDate: AWSDateConverter(new Date().toISOString()),
          historyID: experienceID,
          title: `Title ${i + 1}`,
          gptResponse: "Generated by GPT",
        },
      },
    })

    const companyID = companyResult.data.createCompany.id

    const engagementPromises = Array.from({ length: 3 }, async (_, j) => {
      const engagementResult = await client.mutate({
        mutation: ADD_ENGAGEMENT_MUTATION,
        variables: {
          input: {
            client: `Client ${j + 1}`,
            startDate: AWSDateConverter(new Date().toISOString()),
            endDate: AWSDateConverter(new Date().toISOString()),
            companyID: companyID,
            gptResponse: "Generated by GPT",
          },
        },
      })

      const engagementID = engagementResult.data.createEngagement.id

      const accomplishmentPromises = Array.from({ length: 3 }, (_, k) =>
        client.mutate({
          mutation: ADD_ACCOMPLISHMENT_MUTATION,
          variables: {
            input: {
              title: `Engagement Accomplishment ${k + 1}`,
              description: "Accomplishment Description",
              link: "http://example.com",
              companyID: companyID,
              engagementID: engagementID,
            },
          },
        }),
      )

      await Promise.all(accomplishmentPromises)
    })

    const companyAccomplishmentPromises = Array.from({ length: 3 }, (_, j) =>
      client.mutate({
        mutation: ADD_ACCOMPLISHMENT_MUTATION,
        variables: {
          input: {
            title: `Company Accomplishment ${j + 1}`,
            description: "Accomplishment Description",
            link: "http://example.com",
            companyID: companyID,
            engagementID: null,
          },
        },
      }),
    )

    const skillPromises = Array.from({ length: 3 }, (_, j) =>
      client.mutate({
        mutation: ADD_SKILL_MUTATION,
        variables: {
          input: {
            title: `Skill ${j + 1}`,
            link: "http://example.com",
            companyID: companyID,
            resumeID: resumeID,
            accomplishmentID: null,
          },
        },
      }),
    )

    await Promise.all([...engagementPromises, ...companyAccomplishmentPromises, ...skillPromises])
  })

  await Promise.all(companyPromises)

  // Create Skills for Resume concurrently
  const resumeSkillPromises = Array.from({ length: 3 }, (_, i) =>
    client.mutate({
      mutation: ADD_SKILL_MUTATION,
      variables: {
        input: {
          title: `Resume Skill ${i + 1}`,
          link: "http://example.com",
          resumeID: resumeID,
        },
      },
    }),
  )

  await Promise.all(resumeSkillPromises)
}

// Lambda handler
exports.handler = async (event) => {
  try {
    // Clear the existing data in the database
    await deleteAllData()

    // Create new records
    await createRecords()

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data reset and populated successfully",
      }),
    }
  } catch (error) {
    console.error("Error resetting and populating data:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error resetting and populating data",
        error: error.message,
      }),
    }
  }
}
