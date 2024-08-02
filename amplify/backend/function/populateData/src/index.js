// const Amplify = require("@aws-amplify/core").default
// const AWSAppSyncClient = require("aws-appsync").default
// const gql = require("graphql-tag")
// require("isomorphic-fetch")

// // Load environment variables in non-production environments
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config()
// }
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Lambda handler returned",
    }),
  }
}
// // Amplify configuration
// const awsconfig = {
//   aws_project_region: process.env.REGION,
//   aws_cognito_identity_pool_id: process.env.IDENTITY_POOL_ID,
//   aws_cognito_region: process.env.REGION,
//   aws_user_pools_id: process.env.USER_POOL_ID,
//   aws_user_pools_web_client_id: process.env.USER_POOL_WEB_CLIENT_ID,
//   aws_appsync_graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
//   aws_appsync_region: process.env.REGION,
//   aws_appsync_authenticationType: "API_KEY",
//   aws_appsync_apiKey: process.env.API_KEY,
// }

// Amplify.configure(awsconfig)

// // AWS AppSync client setup
// const client = new AWSAppSyncClient({
//   url: awsconfig.aws_appsync_graphqlEndpoint,
//   region: awsconfig.aws_appsync_region,
//   auth: {
//     type: awsconfig.aws_appsync_authenticationType,
//     apiKey: awsconfig.aws_appsync_apiKey,
//   },
//   disableOffline: true, // Disables offline features for server-side use
// })

// // Utility function to convert a date string to AWSDate format
// function AWSDateConverter(dateString) {
//   const date = new Date(dateString)
//   const year = date.getFullYear()
//   const month = `0${date.getMonth() + 1}`.slice(-2)
//   const day = `0${date.getDate()}`.slice(-2)
//   return `${year}-${month}-${day}`
// }

// // GraphQL mutations
// const ADD_CONTACT_INFORMATION_MUTATION = gql`
//   mutation CreateContactInformation($input: CreateContactInformationInput!) {
//     createContactInformation(input: $input) {
//       id
//       name
//       email
//       phone
//     }
//   }
// `

// const ADD_REFERENCE_MUTATION = gql`
//   mutation CreateReference($input: CreateReferenceInput!) {
//     createReference(input: $input) {
//       id
//       name
//       phone
//       email
//       contactinformationID
//     }
//   }
// `

// const ADD_RESUME_MUTATION = gql`
//   mutation CreateResume($input: CreateResumeInput!) {
//     createResume(input: $input) {
//       id
//       title
//     }
//   }
// `

// const ADD_SUMMARY_MUTATION = gql`
//   mutation CreateSummary($input: CreateSummaryInput!) {
//     createSummary(input: $input) {
//       id
//       goals
//       persona
//       url
//       headshot
//       gptResponse
//     }
//   }
// `

// const ADD_EDUCATION_MUTATION = gql`
//   mutation CreateEducation($input: CreateEducationInput!) {
//     createEducation(input: $input) {
//       id
//       summary
//     }
//   }
// `

// const ADD_SCHOOL_MUTATION = gql`
//   mutation CreateSchool($input: CreateSchoolInput!) {
//     createSchool(input: $input) {
//       id
//       name
//       educationID
//     }
//   }
// `

// const ADD_DEGREE_MUTATION = gql`
//   mutation CreateDegree($input: CreateDegreeInput!) {
//     createDegree(input: $input) {
//       id
//       major
//       startYear
//       endYear
//       schoolID
//     }
//   }
// `

// const ADD_EXPERIENCE_MUTATION = gql`
//   mutation CreateExperience($input: CreateExperienceInput!) {
//     createExperience(input: $input) {
//       id
//       title
//       text
//       gptResponse
//     }
//   }
// `

// const ADD_COMPANY_MUTATION = gql`
//   mutation CreateCompany($input: CreateCompanyInput!) {
//     createCompany(input: $input) {
//       id
//       name
//       role
//       startDate
//       endDate
//       historyID
//       title
//       gptResponse
//     }
//   }
// `

// const ADD_ENGAGEMENT_MUTATION = gql`
//   mutation CreateEngagement($input: CreateEngagementInput!) {
//     createEngagement(input: $input) {
//       id
//       client
//       startDate
//       endDate
//       companyID
//       gptResponse
//     }
//   }
// `

// const ADD_ACCOMPLISHMENT_MUTATION = gql`
//   mutation CreateAccomplishment($input: CreateAccomplishmentInput!) {
//     createAccomplishment(input: $input) {
//       id
//       title
//       description
//       link
//       companyID
//       engagementID
//     }
//   }
// `

// const ADD_SKILL_MUTATION = gql`
//   mutation CreateSkill($input: CreateSkillInput!) {
//     createSkill(input: $input) {
//       id
//       title
//       link
//       resumeID
//       companyID
//       accomplishmentID
//     }
//   }
// `

// const LIST_ALL_ITEMS_QUERY = gql`
//   query ListAllItems($limit: Int) {
//     listReferences(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listContactInformations(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listResumes(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listEducations(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listDegrees(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listCompanies(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listAccomplishments(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listSchools(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listExperiences(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listSkills(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listEngagements(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//     listSummaries(limit: $limit) {
//       items {
//         id
//         _version
//       }
//     }
//   }
// `

// // GraphQL delete mutations
// const DELETE_REFERENCE_MUTATION = gql`
//   mutation DeleteReference($input: DeleteReferenceInput!) {
//     deleteReference(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_CONTACT_INFORMATION_MUTATION = gql`
//   mutation DeleteContactInformation($input: DeleteContactInformationInput!) {
//     deleteContactInformation(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_RESUME_MUTATION = gql`
//   mutation DeleteResume($input: DeleteResumeInput!) {
//     deleteResume(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_EDUCATION_MUTATION = gql`
//   mutation DeleteEducation($input: DeleteEducationInput!) {
//     deleteEducation(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_DEGREE_MUTATION = gql`
//   mutation DeleteDegree($input: DeleteDegreeInput!) {
//     deleteDegree(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_COMPANY_MUTATION = gql`
//   mutation DeleteCompany($input: DeleteCompanyInput!) {
//     deleteCompany(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_ACCOMPLISHMENT_MUTATION = gql`
//   mutation DeleteAccomplishment($input: DeleteAccomplishmentInput!) {
//     deleteAccomplishment(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_SCHOOL_MUTATION = gql`
//   mutation DeleteSchool($input: DeleteSchoolInput!) {
//     deleteSchool(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_EXPERIENCE_MUTATION = gql`
//   mutation DeleteExperience($input: DeleteExperienceInput!) {
//     deleteExperience(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_SKILL_MUTATION = gql`
//   mutation DeleteSkill($input: DeleteSkillInput!) {
//     deleteSkill(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_ENGAGEMENT_MUTATION = gql`
//   mutation DeleteEngagement($input: DeleteEngagementInput!) {
//     deleteEngagement(input: $input) {
//       id
//     }
//   }
// `

// const DELETE_SUMMARY_MUTATION = gql`
//   mutation DeleteSummary($input: DeleteSummaryInput!) {
//     deleteSummary(input: $input) {
//       id
//     }
//   }
// `

// // Function to delete all data
// async function deleteAllData() {
//   // Query to get the list of all items for each type
//   const result = await client.query({
//     query: LIST_ALL_ITEMS_QUERY,
//     variables: { limit: 1000 }, // Adjust limit as needed
//     fetchPolicy: "network-only",
//   })

//   const deleteOperations = []

//   // Helper function to add delete mutations
//   const addDeleteOperations = (items, deleteMutation) => {
//     items.forEach(({ id, _version }) => {
//       deleteOperations.push(
//         client.mutate({
//           mutation: deleteMutation,
//           variables: { input: { id, _version } }, // Include _version for conflict resolution
//         }),
//       )
//     })
//   }

//   addDeleteOperations(result.data.listReferences.items, DELETE_REFERENCE_MUTATION)
//   addDeleteOperations(
//     result.data.listContactInformations.items,
//     DELETE_CONTACT_INFORMATION_MUTATION,
//   )
//   addDeleteOperations(result.data.listResumes.items, DELETE_RESUME_MUTATION)
//   addDeleteOperations(result.data.listEducations.items, DELETE_EDUCATION_MUTATION)
//   addDeleteOperations(result.data.listDegrees.items, DELETE_DEGREE_MUTATION)
//   addDeleteOperations(result.data.listCompanies.items, DELETE_COMPANY_MUTATION)
//   addDeleteOperations(result.data.listAccomplishments.items, DELETE_ACCOMPLISHMENT_MUTATION)
//   addDeleteOperations(result.data.listSchools.items, DELETE_SCHOOL_MUTATION)
//   addDeleteOperations(result.data.listExperiences.items, DELETE_EXPERIENCE_MUTATION)
//   addDeleteOperations(result.data.listSkills.items, DELETE_SKILL_MUTATION)
//   addDeleteOperations(result.data.listEngagements.items, DELETE_ENGAGEMENT_MUTATION)
//   addDeleteOperations(result.data.listSummaries.items, DELETE_SUMMARY_MUTATION)

//   await Promise.all(deleteOperations)
// }

// // Lambda handler
// exports.handler = async (event) => {
//   try {
//     // Clear the existing data in the database
//     await deleteAllData()

//     // Create Contact Information
//     const contactInfoResult = await client.mutate({
//       mutation: ADD_CONTACT_INFORMATION_MUTATION,
//       variables: {
//         input: {
//           name: "John Doe",
//           email: "john.doe@example.com",
//           phone: "123-456-7890",
//         },
//       },
//     })

//     const contactInfoID = contactInfoResult.data.createContactInformation.id

//     // Create References for Contact Information
//     for (let i = 0; i < 3; i++) {
//       await client.mutate({
//         mutation: ADD_REFERENCE_MUTATION,
//         variables: {
//           input: {
//             name: `Reference ${i + 1}`,
//             phone: `123-456-789${i}`,
//             email: `reference${i + 1}@example.com`,
//             contactinformationID: contactInfoID,
//           },
//         },
//       })
//     }

//     // Create Resume
//     const resumeResult = await client.mutate({
//       mutation: ADD_RESUME_MUTATION,
//       variables: {
//         input: {
//           title: "Sample Resume",
//         },
//       },
//     })

//     const resumeID = resumeResult.data.createResume.id

//     // Create Summary for Resume
//     await client.mutate({
//       mutation: ADD_SUMMARY_MUTATION,
//       variables: {
//         input: {
//           goals: "Become a software developer",
//           persona: "Hardworking and dedicated",
//           url: "http://example.com",
//           headshot: "http://example.com/headshot.jpg",
//           gptResponse: "Generated by GPT",
//         },
//       },
//     })

//     // Create Education for Resume
//     const educationResult = await client.mutate({
//       mutation: ADD_EDUCATION_MUTATION,
//       variables: {
//         input: {
//           summary: "Education Summary",
//         },
//       },
//     })

//     const educationID = educationResult.data.createEducation.id

//     // Create Schools for Education
//     for (let i = 0; i < 3; i++) {
//       const schoolResult = await client.mutate({
//         mutation: ADD_SCHOOL_MUTATION,
//         variables: {
//           input: {
//             name: `School ${i + 1}`,
//             educationID: educationID,
//           },
//         },
//       })

//       const schoolID = schoolResult.data.createSchool.id

//       // Create Degrees for School
//       for (let j = 0; j < 3; j++) {
//         await client.mutate({
//           mutation: ADD_DEGREE_MUTATION,
//           variables: {
//             input: {
//               major: `Major ${j + 1}`,
//               startYear: AWSDateConverter(`${new Date().getFullYear() - j}-01-01`),
//               endYear: AWSDateConverter(`${new Date().getFullYear() - j + 4}-01-01`),
//               schoolID: schoolID,
//             },
//           },
//         })
//       }

//       // Create Accomplishments for School
//       for (let k = 0; k < 3; k++) {
//         await client.mutate({
//           mutation: ADD_ACCOMPLISHMENT_MUTATION,
//           variables: {
//             input: {
//               title: `School Accomplishment ${k + 1}`,
//               description: "Accomplishment Description",
//               link: "http://example.com",
//               companyID: null,
//               engagementID: null,
//             },
//           },
//         })
//       }
//     }

//     // Create Experience for Resume
//     const experienceResult = await client.mutate({
//       mutation: ADD_EXPERIENCE_MUTATION,
//       variables: {
//         input: {
//           title: "Experience Title",
//           text: "Experience Description",
//           gptResponse: "Generated by GPT",
//         },
//       },
//     })

//     const experienceID = experienceResult.data.createExperience.id

//     // Create Companies for Experience
//     for (let i = 0; i < 3; i++) {
//       const companyResult = await client.mutate({
//         mutation: ADD_COMPANY_MUTATION,
//         variables: {
//           input: {
//             name: `Company ${i + 1}`,
//             role: `Role ${i + 1}`,
//             startDate: AWSDateConverter(new Date().toISOString()),
//             endDate: AWSDateConverter(new Date().toISOString()),
//             historyID: experienceID,
//             title: `Title ${i + 1}`,
//             gptResponse: "Generated by GPT",
//           },
//         },
//       })

//       const companyID = companyResult.data.createCompany.id

//       // Create Engagements for Company
//       for (let j = 0; j < 3; j++) {
//         const engagementResult = await client.mutate({
//           mutation: ADD_ENGAGEMENT_MUTATION,
//           variables: {
//             input: {
//               client: `Client ${j + 1}`,
//               startDate: AWSDateConverter(new Date().toISOString()),
//               endDate: AWSDateConverter(new Date().toISOString()),
//               companyID: companyID,
//               gptResponse: "Generated by GPT",
//             },
//           },
//         })

//         const engagementID = engagementResult.data.createEngagement.id

//         // Create Accomplishments for Engagement
//         for (let k = 0; k < 3; k++) {
//           await client.mutate({
//             mutation: ADD_ACCOMPLISHMENT_MUTATION,
//             variables: {
//               input: {
//                 title: `Engagement Accomplishment ${k + 1}`,
//                 description: "Accomplishment Description",
//                 link: "http://example.com",
//                 companyID: companyID,
//                 engagementID: engagementID,
//               },
//             },
//           })
//         }
//       }

//       // Create Accomplishments for Company
//       for (let j = 0; j < 3; j++) {
//         await client.mutate({
//           mutation: ADD_ACCOMPLISHMENT_MUTATION,
//           variables: {
//             input: {
//               title: `Company Accomplishment ${j + 1}`,
//               description: "Accomplishment Description",
//               link: "http://example.com",
//               companyID: companyID,
//               engagementID: null,
//             },
//           },
//         })
//       }

//       // Create Skills for Company
//       for (let j = 0; j < 3; j++) {
//         await client.mutate({
//           mutation: ADD_SKILL_MUTATION,
//           variables: {
//             input: {
//               title: `Skill ${j + 1}`,
//               link: "http://example.com",
//               companyID: companyID,
//               resumeID: resumeID,
//               accomplishmentID: null,
//             },
//           },
//         })
//       }
//     }

//     // Create Skills for Resume
//     for (let i = 0; i < 3; i++) {
//       await client.mutate({
//         mutation: ADD_SKILL_MUTATION,
//         variables: {
//           input: {
//             title: `Resume Skill ${i + 1}`,
//             link: "http://example.com",
//             resumeID: resumeID,
//           },
//         },
//       })
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "Data reset and populated successfully",
//         resume: resumeResult.data.createResume,
//       }),
//     }
//   } catch (error) {
//     console.error("Error resetting and populating data:", error)
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: "Error resetting and populating data",
//         error: error.message,
//       }),
//     }
//   }
// }
