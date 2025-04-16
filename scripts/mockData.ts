import { DataStore, Predicates } from "@aws-amplify/datastore";
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
} from "../app/models";
import { toAWSDate } from "../app/utils/awsDateConverter";

export const clearData = async (log: boolean = true) => {
  try {
    if (log) console.log("Clearing DataStore...");
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
    ]);
    if (log) console.log("DataStore cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

export const createExtendedMockData = async () => {
  try {
    await clearData();
    
    const careerPaths = [
      {
        role: "Senior Tech Lead",
        summaryData: {
          goals: "Drive technical excellence and lead high-impact projects",
          persona: "Experienced technical leader with strong architecture skills",
          url: "https://example.com/tech-lead",
          headshot: "tech-lead-profile.jpg",
        },
        skills: ["System Design", "Team Leadership", "Architecture", "AWS", "Agile", "DevOps"],
      },
      {
        role: "Full Stack Developer",
        summaryData: {
          goals: "Build scalable web applications and mentor junior developers",
          persona: "Creative problem-solver with full-stack expertise",
          url: "https://example.com/fullstack",
          headshot: "fullstack-profile.jpg",
        },
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "GraphQL", "Docker"],
      }
    ];

    const resumes = await Promise.all(
      careerPaths.map(async (career) => {
        const summary = await DataStore.save(
          new Summary({
            ...career.summaryData,
            gptResponse: `Generated summary for ${career.role}`,
          })
        );

        const education = await DataStore.save(
          new Education({
            summary: `Education history for ${career.role}`,
          })
        );

        const schools = await Promise.all(
          ["Main University", "Technical Institute", "Online Academy"].map(async (schoolName) => {
            const school = await DataStore.save(
              new School({
                name: schoolName,
                educationID: education.id,
              })
            );

            await Promise.all(
              [
                {
                  major: "Computer Science",
                  startYear: toAWSDate("2015"),
                  endYear: toAWSDate("2019"),
                },
                {
                  major: "Software Engineering",
                  startYear: toAWSDate("2019"),
                  endYear: toAWSDate("2021"),
                },
              ].map((degree) =>
                DataStore.save(
                  new Degree({
                    ...degree,
                    schoolID: school.id,
                  })
                )
              )
            );

            return school;
          })
        );

        const experience = await DataStore.save(
          new Experience({
            title: `${career.role} Experience`,
            text: `Career progression as ${career.role}`,
            gptResponse: `Generated experience narrative for ${career.role}`,
          })
        );

        const companies = await Promise.all(
          ["TechCorp", "InnovateHub", "FutureSoft"].map(async (companyName) => {
            const company = await DataStore.save(
              new Company({
                name: companyName,
                role: career.role,
                startDate: toAWSDate("2019"),
                endDate: toAWSDate("2023"),
                title: `Senior ${career.role}`,
                gptResponse: `Generated company narrative for ${companyName}`,
                experienceID: experience.id,
              })
            );

            const engagements = await Promise.all(
              ["Project Alpha", "Project Beta", "Project Gamma"].map(async (projectName) => {
                const engagement = await DataStore.save(
                  new Engagement({
                    client: projectName,
                    startDate: toAWSDate("2020"),
                    endDate: toAWSDate("2022"),
                    companyID: company.id,
                    gptResponse: `Generated engagement details for ${projectName}`,
                  })
                );

                await Promise.all(
                  [
                    {
                      title: `${projectName} Success 1`,
                      description: "Led architectural transformation",
                    },
                    {
                      title: `${projectName} Success 2`,
                      description: "Improved system performance",
                    },
                  ].map(async (accomplishment) => {
                    const acc = await DataStore.save(
                      new Accomplishment({
                        ...accomplishment,
                        link: `https://example.com/${projectName}`,
                        engagementID: engagement.id,
                        companyID: company.id,
                      })
                    );

                    await Promise.all(
                      ["Technical Leadership", "System Design", "Performance Optimization"].map(
                        (skillTitle) =>
                          DataStore.save(
                            new Skill({
                              title: skillTitle,
                              link: `https://example.com/skills/${skillTitle}`,
                              accomplishmentID: acc.id,
                            })
                          )
                      )
                    );
                  })
                );

                return engagement;
              })
            );

            await Promise.all(
              career.skills.map((skillTitle) =>
                DataStore.save(
                  new Skill({
                    title: skillTitle,
                    link: `https://example.com/skills/${skillTitle}`,
                    companyID: company.id,
                  })
                )
              )
            );

            return company;
          })
        );

        const contactInfo = await DataStore.save(
          new ContactInformation({
            name: `${career.role.replace(" ", "")} User`,
            email: `${career.role.toLowerCase().replace(" ", ".")}@example.com`,
            phone: "+1234567890",
          })
        );

        await Promise.all(
          ["Reference 1", "Reference 2", "Reference 3"].map((refName) =>
            DataStore.save(
              new Reference({
                name: refName,
                phone: "+1987654321",
                email: `${refName.toLowerCase().replace(" ", ".")}@example.com`,
                contactinformationID: contactInfo.id,
              })
            )
          )
        );

        const resume = await DataStore.save(
          new Resume({
            title: career.role,
            Summary: summary,
            Education: education,
            Experience: experience,
            ContactInformation: contactInfo,
          })
        );

        await Promise.all(
          career.skills.map((skillTitle) =>
            DataStore.save(
              new Skill({
                title: skillTitle,
                link: `https://example.com/skills/${skillTitle}`,
                resumeID: resume.id,
              })
            )
          )
        );

        return resume;
      })
    );

    console.log("Extended mock data created successfully");
    return resumes;
  } catch (error) {
    console.error("Error creating extended mock data:", error);
    throw error;
  }
};

// Self-executing script support
if (require.main === module) {
  createExtendedMockData()
    .then(() => {
      console.log("Mock data creation completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error in mock data creation:", error);
      process.exit(1);
    });
}

export default createExtendedMockData;