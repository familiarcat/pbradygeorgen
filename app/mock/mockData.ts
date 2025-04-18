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
export const clearData = async (log: boolean = true) => {
  console.log("clearData")
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
    console.log("data should be cleared and rebuilt")
    // Create Summaries
    const summary1 = await DataStore.save(
      new Summary({
        goals: "To build scalable software solutions.",
        persona: "Innovative and problem-solving oriented.",
      }),
    )

    const summary2 = await DataStore.save(
      new Summary({
        goals: "To lead innovative tech projects.",
        persona: "Dynamic and results-driven.",
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

    // Create Skills linked to Resumes
    const skills1 = await Promise.all(
      [
        "JavaScript",
        "React",
        "Node.js",
        "Ruby",
        "Agile",
        "Gitflow",
        "TDD",
        "CI/CD",
        "AWS",
        "AWS Amplify",
      ].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            resumeID: resume1.id, // Link skill to resume
          }),
        ),
      ),
    )

    const skills2 = await Promise.all(
      ["Python", "AWS", "TypeScript"].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            resumeID: resume2.id, // Link skill to resume
          }),
        ),
      ),
    )

    console.log("Skills for Resume 1:", JSON.stringify(skills1, null, 2))
    console.log("Skills for Resume 2:", JSON.stringify(skills2, null, 2))

    // Create Education linked to Resumes
    const education1 = await DataStore.save(
      new Education({
        summary: "B.Sc in Computer Science from Webster University",
      }),
    )

    const education2 = await DataStore.save(
      new Education({
        summary: "B.Tech in Information Technology from XYZ Institute",
      }),
    )

    console.log("Education 1 ID:", education1.id)
    console.log("Education 2 ID:", education2.id)

    // Create Schools linked to Education
    const school1 = await DataStore.save(
      new School({
        name: "Webster University",
        educationID: education1.id,
      }),
    )

    const school1a = await DataStore.save(
      new School({
        name: "DEF University",
        educationID: education1.id,
      }),
    )

    const school2 = await DataStore.save(
      new School({
        name: "XYZ Institute",
        educationID: education2.id,
      }),
    )

    const school2a = await DataStore.save(
      new School({
        name: "123 Institute",
        educationID: education1.id,
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
        {
          major: "Masters of Software Architecture (Shared)",
          startYear: toAWSDate(2014),
          endYear: toAWSDate(2018),
          schoolID: school2a.id,
        },
        {
          major: "Masters of Software Architecture (Singular)",
          startYear: toAWSDate(2014),
          endYear: toAWSDate(2018),
          schoolID: school1a.id,
        },
      ].map((degree) =>
        DataStore.save(
          new Degree({
            major: degree.major,
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
            major: degree.major,
            startYear: degree.startYear,
            endYear: degree.endYear,
            schoolID: degree.schoolID,
          }),
        ),
      ),
    )

    console.log("Degrees for School 1:", JSON.stringify(degrees1, null, 2))
    console.log("Degrees for School 2:", JSON.stringify(degrees2, null, 2))

    // Create Experiences linked to Resumes
    const experience1 = await DataStore.save(
      new Experience({
        title: "Lead Developer at XYZ Corp",
        text: "Led a team of developers in creating a new SaaS product.",
      }),
    )

    const experience2 = await DataStore.save(
      new Experience({
        title: "Software Engineer at Tech Innovations Ltd.",
        text: "Developed innovative software solutions for clients.",
      }),
    )

    console.log("Experience 1 ID:", experience1.id)
    console.log("Experience 2 ID:", experience2.id)

    // Create Companies linked to Experiences
    const company1 = await DataStore.save(
      new Company({
        name: "XYZ Corp",
        role: "Lead Developer",
        startDate: toAWSDate("2019-01-01"),
        endDate: toAWSDate("2022-01-01"),
        title: "Project Manager",
        experienceID: experience1.id,
      }),
    )

    const company2 = await DataStore.save(
      new Company({
        name: "Tech Innovations Ltd.",
        role: "Software Engineer",
        startDate: toAWSDate("2018-01-01"),
        endDate: toAWSDate("2020-01-01"),
        title: "Senior Developer",
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
            client: engagement.client,
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
            client: engagement.client,
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
            title: accomplishment.title,
            description: accomplishment.description,
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
            title: accomplishment.title,
            description: accomplishment.description,
            companyID: accomplishment.companyID,
            engagementID: accomplishment.engagementID,
          }),
        ),
      ),
    )

    console.log("Accomplishments for Company 1:", JSON.stringify(accomplishments1, null, 2))
    console.log("Accomplishments for Company 2:", JSON.stringify(accomplishments2, null, 2))

    // Create Skills linked to Companies and Engagements
    const companySkills1 = await Promise.all(
      ["Leadership", "Communication"].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            companyID: company1.id,
          }),
        ),
      ),
    )

    const companySkills2 = await Promise.all(
      ["Project Management", "Team Building"].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            companyID: company2.id,
          }),
        ),
      ),
    )

    console.log("Company Skills for Company 1:", JSON.stringify(companySkills1, null, 2))
    console.log("Company Skills for Company 2:", JSON.stringify(companySkills2, null, 2))

    // Create Skills linked to Accomplishments
    const accomplishmentSkills1 = await Promise.all(
      ["Optimization", "Performance"].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            accomplishmentID: accomplishments1[0].id,
          }),
        ),
      ),
    )

    const accomplishmentSkills2 = await Promise.all(
      ["Security", "Audit"].map((title) =>
        DataStore.save(
          new Skill({
            title: title,
            accomplishmentID: accomplishments2[0].id,
          }),
        ),
      ),
    )

    console.log(
      "Accomplishment Skills for Accomplishment 1:",
      JSON.stringify(accomplishmentSkills1, null, 2),
    )
    console.log(
      "Accomplishment Skills for Accomplishment 2:",
      JSON.stringify(accomplishmentSkills2, null, 2),
    )

    // Create Contact Information
    const contactInfo1 = await DataStore.save(
      new ContactInformation({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
      }),
    )

    const contactInfo2 = await DataStore.save(
      new ContactInformation({
        name: "Jane Doe",
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
        {
          name: "Kathy Smith",
          phone: "+0987654321",
          email: "jane.smith@example.com",
          contactinformationID: contactInfo1.id,
        },
        {
          name: "John Connor",
          phone: "+1346798520",
          email: "sarah.connor@example.com",
          contactinformationID: contactInfo1.id,
        },
      ].map((reference) =>
        DataStore.save(
          new Reference({
            name: reference.name,
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
            name: reference.name,
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
