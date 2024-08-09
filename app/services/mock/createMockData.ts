// mockData.ts

import { DataStore } from "@aws-amplify/datastore"
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
} from "../../models"
import { toAWSDate } from "../../utils/awsDateConverter" // Import the utility function

// Function to create mock data with relationships
export const createMockData = async () => {
  try {
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

    // Create Skills
    const skill1 = await DataStore.save(
      new Skill({
        title: "JavaScript",
      }),
    )

    const skill2 = await DataStore.save(
      new Skill({
        title: "React",
      }),
    )

    const skill3 = await DataStore.save(
      new Skill({
        title: "Python",
      }),
    )

    const skill4 = await DataStore.save(
      new Skill({
        title: "AWS",
      }),
    )

    // Create Schools
    const school1 = await DataStore.save(
      new School({
        name: "ABC University",
      }),
    )

    const school2 = await DataStore.save(
      new School({
        name: "XYZ Institute",
      }),
    )

    // Create Degrees linked to Schools
    await DataStore.save(
      new Degree({
        major: "Computer Science",
        startYear: toAWSDate(2015), // Convert year to AWSDate
        endYear: toAWSDate(2019), // Convert year to AWSDate
        schoolID: school1.id, // Set schoolID instead of School object
      }),
    )

    await DataStore.save(
      new Degree({
        major: "Information Technology",
        startYear: toAWSDate(2016), // Convert year to AWSDate
        endYear: toAWSDate(2020), // Convert year to AWSDate
        schoolID: school2.id, // Set schoolID instead of School object
      }),
    )

    // Create Education linked to Schools
    const education1 = await DataStore.save(
      new Education({
        summary: "B.Sc in Computer Science from ABC University",
      }),
    )

    const education2 = await DataStore.save(
      new Education({
        summary: "B.Tech in Information Technology from XYZ Institute",
      }),
    )

    // Create Companies
    const company1 = await DataStore.save(
      new Company({
        name: "XYZ Corp",
        role: "Lead Developer",
        startDate: toAWSDate("2019-01-01"), // Ensure AWSDate format
        endDate: toAWSDate("2022-01-01"), // Ensure AWSDate format
        title: "Project Manager",
      }),
    )

    const company2 = await DataStore.save(
      new Company({
        name: "Tech Innovations Ltd.",
        role: "Software Engineer",
        startDate: toAWSDate("2018-01-01"), // Ensure AWSDate format
        endDate: toAWSDate("2020-01-01"), // Ensure AWSDate format
        title: "Senior Developer",
      }),
    )

    // Create Engagements linked to Companies
    await DataStore.save(
      new Engagement({
        client: "Acme Inc.",
        startDate: toAWSDate("2019-01-01"), // Ensure AWSDate format
        endDate: toAWSDate("2019-12-31"), // Ensure AWSDate format
        companyID: company1.id, // Use companyID instead of Company object
      }),
    )

    await DataStore.save(
      new Engagement({
        client: "Globex Corp.",
        startDate: toAWSDate("2020-01-01"), // Ensure AWSDate format
        endDate: toAWSDate("2020-12-31"), // Ensure AWSDate format
        companyID: company2.id, // Use companyID instead of Company object
      }),
    )

    // Create Accomplishments linked to Companies
    await DataStore.save(
      new Accomplishment({
        title: "Increased code efficiency by 30%",
        description: "Implemented caching strategies to improve performance.",
        companyID: company1.id, // Use companyID instead of Company object
      }),
    )

    await DataStore.save(
      new Accomplishment({
        title: "Led a successful migration to cloud infrastructure",
        description: "Managed project to migrate services to AWS.",
        companyID: company2.id, // Use companyID instead of Company object
      }),
    )

    // Create Experiences linked to Companies
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

    // Create References linked to Contact Information
    await DataStore.save(
      new Reference({
        name: "Jane Smith",
        phone: "+0987654321",
        email: "jane.smith@example.com",
        contactinformationID: contactInfo1.id, // Correct ID linking
      }),
    )

    await DataStore.save(
      new Reference({
        name: "Tom Johnson",
        phone: "+1122334455",
        email: "tom.johnson@example.com",
        contactinformationID: contactInfo2.id, // Correct ID linking
      }),
    )

    // Finally, save Resumes with complete relationships
    await DataStore.save(
      new Resume({
        title: "Software Engineer",
        resumeSummaryId: summary1.id, // Use summary ID
        resumeEducationId: education1.id, // Use education ID
        resumeExperienceId: experience1.id, // Use experience ID
        resumeContactInformationId: contactInfo1.id, // Use contact info ID
      }),
    )

    await DataStore.save(
      new Resume({
        title: "Tech Lead",
        resumeSummaryId: summary2.id, // Use summary ID
        resumeEducationId: education2.id, // Use education ID
        resumeExperienceId: experience2.id, // Use experience ID
        resumeContactInformationId: contactInfo2.id, // Use contact info ID
      }),
    )

    console.log("Mock data saved to DataStore")
  } catch (error) {
    console.error("Error creating mock data:", error)
  }
}

// Usage
createMockData().catch(console.error)
