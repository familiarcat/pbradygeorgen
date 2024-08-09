import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
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
} from "../models"
import { createMockData, clearData } from "../services/mock/mockData"

// Define TypeScript interfaces for your models
interface ResumeType {
  id: string
  title?: string | null
  resumeSummaryId?: string | null
  resumeEducationId?: string | null
  resumeExperienceId?: string | null
  resumeContactInformationId?: string | null
  createdAt?: string
  updatedAt?: string
}

interface SummaryType {
  id: string
  goals?: string | null
  persona?: string | null
}

interface SkillType {
  id: string
  title?: string | null
  resumeID?: string | null
}

interface EducationType {
  id: string
  summary?: string | null
}

interface ExperienceType {
  id: string
  title?: string | null
  text?: string | null
}

interface ContactInformationType {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
}

interface ReferenceType {
  id: string
  name?: string | null
  phone?: string | null
  email?: string | null
  contactinformationID?: string | null
}

interface SchoolType {
  id: string
  name?: string | null
  educationID?: string | null
}

interface DegreeType {
  id: string
  major?: string | null
  startYear?: string | null
  endYear?: string | null
  schoolID?: string | null
}

interface CompanyType {
  id: string
  name?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
  title?: string | null
  historyID?: string | null
}

interface EngagementType {
  id: string
  client?: string | null
  startDate?: string | null
  endDate?: string | null
  companyID?: string | null
}

interface AccomplishmentType {
  id: string
  title?: string | null
  description?: string | null
  engagementID?: string | null
  companyID?: string | null
}

// Use correct types for each model
type ExpandedResume = Omit<
  ResumeType,
  "Summary" | "Skills" | "Education" | "Experience" | "ContactInformation"
> & {
  Summary: SummaryType | null
  Skills: SkillType[]
  Education: EducationType | null
  Schools: SchoolType[]
  Degrees: DegreeType[]
  Experience: ExperienceType | null
  Companies: CompanyType[]
  Engagements: EngagementType[]
  Accomplishments: AccomplishmentType[]
  ContactInformation: ContactInformationType | null
  References: ReferenceType[]
}

const ResumeView = () => {
  const [resumes, setResumes] = useState<ExpandedResume[]>([])
  useEffect(() => {
    const fetchData = async () => {
      clearData()
      try {
        // Fetch all resumes
        const resumeData = await DataStore.query(Resume)

        if (!resumeData || resumeData.length === 0) {
          console.warn("No resumes found, creating mock data")
          // createMockData()
          //   .catch(console.error)
          //   .then(() => {
          //     console.log("Created mock data in then statement")
          //   })
          return
        }

        // Fetch related data for each resume
        const expandedResumes: ExpandedResume[] = await Promise.all(
          resumeData.map(async (resume) => {
            // Fetch related summary
            const summary = resume.resumeSummaryId
              ? await DataStore.query(Summary, (s) => s.id.eq(resume.resumeSummaryId!)).then(
                  (res) => res[0] || null,
                )
              : null

            // Fetch related skills
            const skills: SkillType[] = (
              await DataStore.query(Skill, (s) => s.resumeID.eq(resume.id))
            ).map((skill) => ({
              id: skill.id,
              title: skill.title ?? undefined,
              resumeID: skill.resumeID ?? undefined,
            }))

            // Fetch related education and its schools and degrees
            const education = resume.resumeEducationId
              ? await DataStore.query(Education, (e) => e.id.eq(resume.resumeEducationId!)).then(
                  (res) => res[0] || null,
                )
              : null
            const schools: SchoolType[] = (
              await DataStore.query(School, (school) => school.educationID.eq(education?.id || ""))
            ).map((school) => ({
              id: school.id,
              name: school.name ?? undefined,
              educationID: school.educationID ?? undefined,
            }))

            const degrees: DegreeType[] = (
              await Promise.all(
                schools.map((school) =>
                  DataStore.query(Degree, (degree) => degree.schoolID.eq(school.id)),
                ),
              )
            )
              .flat()
              .map((degree) => ({
                id: degree.id,
                major: degree.major ?? undefined,
                startYear: degree.startYear ?? undefined,
                endYear: degree.endYear ?? undefined,
                schoolID: degree.schoolID ?? undefined,
              }))

            // Fetch related experience and its companies, engagements, and accomplishments
            const experience = resume.resumeExperienceId
              ? await DataStore.query(Experience, (exp) =>
                  exp.id.eq(resume.resumeExperienceId!),
                ).then((res) => res[0] || null)
              : null
            const companies: CompanyType[] = (
              await DataStore.query(Company, (company) =>
                company.historyID.eq(experience?.id || ""),
              )
            ).map((company) => ({
              id: company.id,
              name: company.name ?? undefined,
              role: company.role ?? undefined,
              startDate: company.startDate ?? undefined,
              endDate: company.endDate ?? undefined,
              title: company.title ?? undefined,
              historyID: company.historyID ?? undefined,
            }))

            const engagements: EngagementType[] = (
              await Promise.all(
                companies.map((company) =>
                  DataStore.query(Engagement, (engagement) => engagement.companyID.eq(company.id)),
                ),
              )
            )
              .flat()
              .map((engagement) => ({
                id: engagement.id,
                client: engagement.client ?? undefined,
                startDate: engagement.startDate ?? undefined,
                endDate: engagement.endDate ?? undefined,
                companyID: engagement.companyID ?? undefined,
              }))

            const accomplishments: AccomplishmentType[] = (
              await Promise.all(
                companies.map((company) =>
                  DataStore.query(Accomplishment, (accomplishment) =>
                    accomplishment.companyID.eq(company.id),
                  ),
                ),
              )
            )
              .flat()
              .map((accomplishment) => ({
                id: accomplishment.id,
                title: accomplishment.title ?? undefined,
                description: accomplishment.description ?? undefined,
                engagementID: accomplishment.engagementID ?? undefined,
                companyID: accomplishment.companyID ?? undefined,
              }))

            // Fetch related contact information and its references
            const contactInfo = resume.resumeContactInformationId
              ? await DataStore.query(ContactInformation, (ci) =>
                  ci.id.eq(resume.resumeContactInformationId!),
                ).then((res) => res[0] || null)
              : null
            const references: ReferenceType[] = (
              await DataStore.query(Reference, (ref) =>
                ref.contactinformationID.eq(contactInfo?.id || ""),
              )
            ).map((reference) => ({
              id: reference.id,
              name: reference.name ?? undefined,
              phone: reference.phone ?? undefined,
              email: reference.email ?? undefined,
              contactinformationID: reference.contactinformationID ?? undefined,
            }))

            return {
              ...resume,
              Summary: summary,
              Skills: skills,
              Education: education,
              Schools: schools,
              Degrees: degrees,
              Experience: experience,
              Companies: companies,
              Engagements: engagements,
              Accomplishments: accomplishments,
              ContactInformation: contactInfo,
              References: references,
            } as ExpandedResume // Ensure it is cast correctly
          }),
        )

        setResumes(expandedResumes)
      } catch (error) {
        console.error("Error fetching resumes:", error)
      }
    }

    fetchData()
    const subscription = DataStore.observe(Resume).subscribe(() => fetchData())

    return () => subscription.unsubscribe()
  }, [])

  const renderIndentation = (level: number) => ({
    marginLeft: level * 10,
  })

  return (
    <ScrollView style={styles.container}>
      {/* <>{console.log("resumes", JSON.stringify(resumes, null, 2))}</> */}
      {resumes.map((resume) => (
        <View key={resume.id} style={styles.resume}>
          <Text style={styles.resumeTitle}>{resume.title}</Text>
          {resume.Summary && (
            <View style={renderIndentation(1)}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.text}>Goals: {resume.Summary.goals}</Text>
              <Text style={styles.text}>Persona: {resume.Summary.persona}</Text>
            </View>
          )}

          {resume.Skills && resume.Skills.length > 0 && (
            <View style={renderIndentation(1)}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {resume.Skills.map((skill) => (
                <Text key={skill.id} style={styles.text}>
                  {skill.title}
                </Text>
              ))}
            </View>
          )}

          {resume.Education && (
            <View style={renderIndentation(1)}>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.text}>Summary: {resume.Education.summary}</Text>
              {resume.Schools && resume.Schools.length > 0 && (
                <View style={renderIndentation(2)}>
                  <Text style={styles.sectionTitle}>Schools</Text>
                  {resume.Schools.map((school) => (
                    <View key={school.id} style={renderIndentation(3)}>
                      <Text style={styles.text}>{school.name}</Text>
                      {resume.Degrees.filter((d) => d.schoolID === school.id).map((degree) => (
                        <Text key={degree.id} style={styles.text}>
                          {degree.major} ({degree.startYear} - {degree.endYear})
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {resume.Experience && (
            <View style={renderIndentation(1)}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <Text style={styles.text}>Title: {resume.Experience.title}</Text>
              <Text style={styles.text}>Text: {resume.Experience.text}</Text>
              {resume.Companies && resume.Companies.length > 0 && (
                <View style={renderIndentation(2)}>
                  <Text style={styles.sectionTitle}>Companies</Text>
                  {resume.Companies.map((company) => (
                    <View key={company.id} style={renderIndentation(3)}>
                      <Text style={styles.text}>
                        {company.name} - {company.role} ({company.startDate} - {company.endDate})
                      </Text>
                      <Text style={styles.text}>Title: {company.title}</Text>

                      {resume.Engagements.filter((e) => e.companyID === company.id).map(
                        (engagement) => (
                          <View key={engagement.id} style={renderIndentation(4)}>
                            <Text style={styles.text}>
                              Engagement with {engagement.client} ({engagement.startDate} -{" "}
                              {engagement.endDate})
                            </Text>
                            {resume.Accomplishments.filter(
                              (a) => a.engagementID === engagement.id,
                            ).map((accomplishment) => (
                              <Text key={accomplishment.id} style={styles.text}>
                                Accomplishment: {accomplishment.title} -{" "}
                                {accomplishment.description}
                              </Text>
                            ))}
                          </View>
                        ),
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {resume.ContactInformation && (
            <View style={renderIndentation(1)}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Text style={styles.text}>Name: {resume.ContactInformation.name}</Text>
              <Text style={styles.text}>Email: {resume.ContactInformation.email}</Text>
              <Text style={styles.text}>Phone: {resume.ContactInformation.phone}</Text>
              {resume.References && resume.References.length > 0 && (
                <View style={renderIndentation(2)}>
                  <Text style={styles.sectionTitle}>References</Text>
                  {resume.References.map((reference) => (
                    <Text key={reference.id} style={styles.text}>
                      {reference.name} - {reference.phone} - {reference.email}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  resume: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  resumeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
})

export default ResumeView
