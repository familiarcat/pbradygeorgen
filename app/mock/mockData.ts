// mockData.ts

import { DataStore, Predicates } from "@aws-amplify/datastore"
import {
  Resume,
  Summary,
  Skill,
  Education,
  Experience,
  ContactInformation,
  Reference,
  School,
  Degree,
  Company,
  Engagement,
  Accomplishment,
} from "../models"
import { toAWSDate } from "../utils/awsDateConverter" // Import the utility function

// Function to clear data from all models
export const clearData = async (log: boolean = false) => {
  try {
    if (log) console.log("Clearing DataStore...")
    await Promise.all([
      DataStore.delete(Resume, Predicates.ALL),
      DataStore.delete(Summary, Predicates.ALL),
      DataStore.delete(Skill, Predicates.ALL),
      DataStore.delete(Education, Predicates.ALL),
      DataStore.delete(Experience, Predicates.ALL),
      DataStore.delete(ContactInformation, Predicates.ALL),
      DataStore.delete(Reference, Predicates.ALL),
      DataStore.delete(School, Predicates.ALL),
      DataStore.delete(Degree, Predicates.ALL),
      DataStore.delete(Company, Predicates.ALL),
      DataStore.delete(Engagement, Predicates.ALL),
      DataStore.delete(Accomplishment, Predicates.ALL),
    ])
    if (log) console.log("DataStore cleared")
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}

// Function to create mock data with relationships
export const createMockData = async () => {
  console.log("Creating Mock Data in mockData.ts")

  try {
    // Clear existing data
    await clearData(true)

    // Extract first letter for breadcrumb
    const prefix1 = "(S)"
    const prefix2 = "(T)"

    // Create Summaries
    const summary1 = await DataStore.save(
      new Summary({
        goals: `${prefix1} To build scalable software solutions.`,
        persona: `${prefix1} Innovative and problem-solving oriented.`,
      }),
    )

    const summary2 = await DataStore.save(
      new Summary({
        goals: `${prefix2} To lead innovative tech projects.`,
        persona: `${prefix2} Dynamic and results-driven.`,
      }),
    )

    console.log("Summary 1 ID:", summary1.id)
    console.log("Summary 2 ID:", summary2.id)

    // Create Resumes
    const resume1 = await DataStore.save(
      new Resume({
        title: "Software Engineer",
        resumeSummaryId: summary1.id, // Link resume to summary
      }),
    )

    const resume2 = await DataStore.save(
      new Resume({
        title: "Tech Lead",
        resumeSummaryId: summary2.id, // Link resume to summary
      }),
    )

    console.log("Resume 1 ID:", resume1.id)
    console.log("Resume 2 ID:", resume2.id)

    // Create Skills
    const skills1 = await Promise.all(
      ["JavaScript", "React", "Node.js"].map((title) =>
        DataStore.save(
          new Skill({
            title: `${prefix1} ${title}`,
            resumeID: resume1.id, // Link skill to resume
          }),
        ),
      ),
    )

    const skills2 = await Promise.all(
      ["Python", "AWS", "TypeScript"].map((title) =>
        DataStore.save(
          new Skill({
            title: `${prefix2} ${title}`,
            resumeID: resume2.id, // Link skill to resume
          }),
        ),
      ),
    )

    console.log("Skills for Resume 1:", JSON.stringify(skills1, null, 2))
    console.log("Skills for Resume 2:", JSON.stringify(skills2, null, 2))

    // Create Education
    const education1 = await DataStore.save(
      new Education({
        summary: `${prefix1} B.Sc in Computer Science from ABC University`,
      }),
    )

    const education2 = await DataStore.save(
      new Education({
        summary: `${prefix2} B.Tech in Information Technology from XYZ Institute`,
      }),
    )

    console.log("Education 1 ID:", education1.id)
    console.log("Education 2 ID:", education2.id)

    // Create Schools
    const school1 = await DataStore.save(
      new School({
        name: `${prefix1} ABC University`,
        educationID: education1.id,
      }),
    )

    const school2 = await DataStore.save(
      new School({
        name: `${prefix2} XYZ Institute`,
        educationID: education2.id,
      }),
    )

    // Create Degrees linked to Schools
    const degrees1 = await Promise.all(
      [
        {
          major: "Computer Science",
          startYear: toAWSDate(2015),
          endYear: toAWSDate(2019),
          schoolID: school1.id,
        },
        {
          major: "Software Engineering",
          startYear: toAWSDate(2014),
          endYear: toAWSDate(2018),
          schoolID: school1.id,
        },
      ].map((degree) =>
        DataStore.save(
          new Degree({
            major: `${prefix1} ${degree.major}`,
            startYear: degree.startYear,
            endYear: degree.endYear,
            schoolID: degree.schoolID,
          }),
        ),
      ),
    )

    const degrees2 = await Promise.all(
      [
        {
          major: "Information Technology",
          startYear: toAWSDate(2016),
          endYear: toAWSDate(2020),
          schoolID: school2.id,
        },
        {
          major: "Network Security",
          startYear: toAWSDate(2017),
          endYear: toAWSDate(2021),
          schoolID: school2.id,
        },
      ].map((degree) =>
        DataStore.save(
          new Degree({
            major: `${prefix2} ${degree.major}`,
            startYear: degree.startYear,
            endYear: degree.endYear,
            schoolID: degree.schoolID,
          }),
        ),
      ),
    )

    console.log("Degrees for School 1:", JSON.stringify(degrees1, null, 2))
    console.log("Degrees for School 2:", JSON.stringify(degrees2, null, 2))

    // Create Experiences
    const experience1 = await DataStore.save(
      new Experience({
        title: `${prefix1} Lead Developer at XYZ Corp`,
        text: `${prefix1} Led a team of developers in creating a new SaaS product.`,
      }),
    )

    const experience2 = await DataStore.save(
      new Experience({
        title: `${prefix2} Software Engineer at Tech Innovations Ltd.`,
        text: `${prefix2} Developed innovative software solutions for clients.`,
      }),
    )

    console.log("Experience 1 ID:", experience1.id)
    console.log("Experience 2 ID:", experience2.id)

    // Create Companies linked to Experiences
    const company1 = await DataStore.save(
      new Company({
        name: `${prefix1} XYZ Corp`,
        role: `${prefix1} Lead Developer`,
        startDate: toAWSDate("2019-01-01"),
        endDate: toAWSDate("2022-01-01"),
        title: `${prefix1} Project Manager`,
        experienceID: experience1.id,
      }),
    )

    const company2 = await DataStore.save(
      new Company({
        name: `${prefix2} Tech Innovations Ltd.`,
        role: `${prefix2} Software Engineer`,
        startDate: toAWSDate("2018-01-01"),
        endDate: toAWSDate("2020-01-01"),
        title: `${prefix2} Senior Developer`,
        experienceID: experience2.id,
      }),
    )

    // Create Engagements linked to Companies
    const engagements1 = await Promise.all(
      [
        {
          client: "Acme Inc.",
          startDate: toAWSDate("2019-01-01"),
          endDate: toAWSDate("2019-12-31"),
          companyID: company1.id,
        },
        {
          client: "Umbrella Co.",
          startDate: toAWSDate("2021-01-01"),
          endDate: toAWSDate("2021-12-31"),
          companyID: company1.id,
        },
      ].map((engagement) =>
        DataStore.save(
          new Engagement({
            client: `${prefix1} ${engagement.client}`,
            startDate: engagement.startDate,
            endDate: engagement.endDate,
            companyID: engagement.companyID,
          }),
        ),
      ),
    )

    const engagements2 = await Promise.all(
      [
        {
          client: "Globex Corp.",
          startDate: toAWSDate("2020-01-01"),
          endDate: toAWSDate("2020-12-31"),
          companyID: company2.id,
        },
        {
          client: "Cyberdyne Systems",
          startDate: toAWSDate("2017-01-01"),
          endDate: toAWSDate("2018-01-01"),
          companyID: company2.id,
        },
      ].map((engagement) =>
        DataStore.save(
          new Engagement({
            client: `${prefix2} ${engagement.client}`,
            startDate: engagement.startDate,
            endDate: engagement.endDate,
            companyID: engagement.companyID,
          }),
        ),
      ),
    )

    console.log("Engagements for Company 1:", JSON.stringify(engagements1, null, 2))
    console.log("Engagements for Company 2:", JSON.stringify(engagements2, null, 2))

    // Create Accomplishments linked to Companies and Engagements
    const accomplishments1 = await Promise.all(
      [
        {
          title: "Increased code efficiency by 30%",
          description: "Implemented caching strategies to improve performance.",
          companyID: company1.id,
          engagementID: engagements1[0].id,
        },
        {
          title: "Optimized data storage",
          description: "Redesigned database schema for better query performance.",
          companyID: company1.id,
          engagementID: engagements1[1].id,
        },
      ].map((accomplishment) =>
        DataStore.save(
          new Accomplishment({
            title: `${prefix1} ${accomplishment.title}`,
            description: `${prefix1} ${accomplishment.description}`,
            companyID: accomplishment.companyID,
            engagementID: accomplishment.engagementID,
          }),
        ),
      ),
    )

    const accomplishments2 = await Promise.all(
      [
        {
          title: "Led a successful migration to cloud infrastructure",
          description: "Managed project to migrate services to AWS.",
          companyID: company2.id,
          engagementID: engagements2[0].id,
        },
        {
          title: "Improved application security",
          description: "Implemented a security audit and remediation plan.",
          companyID: company2.id,
          engagementID: engagements2[1].id,
        },
      ].map((accomplishment) =>
        DataStore.save(
          new Accomplishment({
            title: `${prefix2} ${accomplishment.title}`,
            description: `${prefix2} ${accomplishment.description}`,
            companyID: accomplishment.companyID,
            engagementID: accomplishment.engagementID,
          }),
        ),
      ),
    )

    console.log("Accomplishments for Company 1:", JSON.stringify(accomplishments1, null, 2))
    console.log("Accomplishments for Company 2:", JSON.stringify(accomplishments2, null, 2))

    // Create Contact Information
    const contactInfo1 = await DataStore.save(
      new ContactInformation({
        name: `${prefix1} John Doe`,
        email: "john.doe@example.com",
        phone: "+1234567890",
      }),
    )

    const contactInfo2 = await DataStore.save(
      new ContactInformation({
        name: `${prefix2} Jane Doe`,
        email: "jane.doe@example.com",
        phone: "+0987654321",
      }),
    )

    console.log("Contact Information 1 ID:", contactInfo1.id)
    console.log("Contact Information 2 ID:", contactInfo2.id)

    // Create References linked to Contact Information
    const references1 = await Promise.all(
      [
        {
          name: "Jane Smith",
          phone: "+0987654321",
          email: "jane.smith@example.com",
          contactinformationID: contactInfo1.id,
        },
        {
          name: "Sarah Connor",
          phone: "+1346798520",
          email: "sarah.connor@example.com",
          contactinformationID: contactInfo1.id,
        },
      ].map((reference) =>
        DataStore.save(
          new Reference({
            name: `${prefix1} ${reference.name}`,
            phone: reference.phone,
            email: reference.email,
            contactinformationID: reference.contactinformationID,
          }),
        ),
      ),
    )

    const references2 = await Promise.all(
      [
        {
          name: "Tom Johnson",
          phone: "+1122334455",
          email: "tom.johnson@example.com",
          contactinformationID: contactInfo2.id,
        },
        {
          name: "Kyle Reese",
          phone: "+1230984567",
          email: "kyle.reese@example.com",
          contactinformationID: contactInfo2.id,
        },
      ].map((reference) =>
        DataStore.save(
          new Reference({
            name: `${prefix2} ${reference.name}`,
            phone: reference.phone,
            email: reference.email,
            contactinformationID: reference.contactinformationID,
          }),
        ),
      ),
    )

    console.log("References for Contact Information 1:", JSON.stringify(references1, null, 2))
    console.log("References for Contact Information 2:", JSON.stringify(references2, null, 2))

    // Update resumes with IDs of linked models
    const resume1Updated = await DataStore.save(
      Resume.copyOf(resume1, (updated) => {
        updated.resumeEducationId = education1.id
        updated.resumeExperienceId = experience1.id
        updated.resumeContactInformationId = contactInfo1.id
      }),
    )

    const resume2Updated = await DataStore.save(
      Resume.copyOf(resume2, (updated) => {
        updated.resumeEducationId = education2.id
        updated.resumeExperienceId = experience2.id
        updated.resumeContactInformationId = contactInfo2.id
      }),
    )

    console.log("Resume 1 Structure:", JSON.stringify(resume1Updated, null, 2))
    console.log("Resume 2 Structure:", JSON.stringify(resume2Updated, null, 2))

    console.log("Mock data saved to DataStore")
  } catch (error) {
    console.error("Error creating mock data:", error)
  }
}

// Usage
// createMockData().catch(console.error);
