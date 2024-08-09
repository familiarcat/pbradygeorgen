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

const ResumeView = () => {
  const [resumes, setResumes] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all resumes
        const resumeData = await DataStore.query(Resume)

        // Fetch related data for each resume
        const expandedResumes = await Promise.all(
          resumeData.map(async (resume) => {
            // Check for summary ID and fetch related summary
            const summary =
              resume.resumeSummaryId && typeof resume.resumeSummaryId === "string"
                ? await DataStore.query(Summary, (s) => s.id.eq(resume.resumeSummaryId!))
                : []

            // Fetch related skills
            const skills = await DataStore.query(Skill, (s) => s.resumeID.eq(resume.id))

            // Check for education ID and fetch related education
            const education =
              resume.resumeEducationId && typeof resume.resumeEducationId === "string"
                ? await DataStore.query(Education, (e) => e.id.eq(resume.resumeEducationId!))
                : []

            const schools = education.length
              ? await DataStore.query(School, (school) => school.educationID.eq(education[0].id))
              : []

            const degrees = await Promise.all(
              schools.map((school) =>
                DataStore.query(Degree, (degree) => degree.schoolID.eq(school.id)),
              ),
            )

            // Check for experience ID and fetch related experience
            const experience =
              resume.resumeExperienceId && typeof resume.resumeExperienceId === "string"
                ? await DataStore.query(Experience, (e) => e.id.eq(resume.resumeExperienceId!))
                : []

            const companies = experience.length
              ? await DataStore.query(Company, (company) => company.historyID.eq(experience[0].id))
              : []

            const engagements = await Promise.all(
              companies.map((company) =>
                DataStore.query(Engagement, (engagement) => engagement.companyID.eq(company.id)),
              ),
            )

            const accomplishments = await Promise.all(
              companies.map((company) =>
                DataStore.query(Accomplishment, (accomplishment) =>
                  accomplishment.companyID.eq(company.id),
                ),
              ),
            )

            // Check for contact information ID and fetch related contact information
            const contactInfo =
              resume.resumeContactInformationId &&
              typeof resume.resumeContactInformationId === "string"
                ? await DataStore.query(ContactInformation, (ci) =>
                    ci.id.eq(resume.resumeContactInformationId!),
                  )
                : []

            const references = contactInfo.length
              ? await DataStore.query(Reference, (ref) =>
                  ref.contactinformationID.eq(contactInfo[0].id),
                )
              : []

            return {
              ...resume,
              Summary: summary.length > 0 ? summary[0] : null,
              Skills: skills,
              Education: education.length > 0 ? education[0] : null,
              Schools: schools,
              Degrees: degrees.flat(),
              Experience: experience.length > 0 ? experience[0] : null,
              Companies: companies,
              Engagements: engagements.flat(),
              Accomplishments: accomplishments.flat(),
              ContactInformation:
                contactInfo.length > 0 ? { ...contactInfo[0], References: references } : null,
            }
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
              {resume.Skills.map((skill: Skill) => (
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
                  {resume.Schools.map((school: School) => (
                    <View key={school.id} style={renderIndentation(3)}>
                      <Text style={styles.text}>{school.name}</Text>
                      {resume.Degrees.filter((d: Degree) => d.schoolID === school.id).map(
                        (degree: Degree) => (
                          <Text key={degree.id} style={styles.text}>
                            {degree.major} ({degree.startYear} - {degree.endYear})
                          </Text>
                        ),
                      )}
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
                  {resume.Companies.map((company: Company) => (
                    <View key={company.id} style={renderIndentation(3)}>
                      <Text style={styles.text}>
                        {company.name} - {company.role} ({company.startDate} - {company.endDate})
                      </Text>
                      <Text style={styles.text}>Title: {company.title}</Text>

                      {resume.Engagements.filter((e: Engagement) => e.companyID === company.id).map(
                        (engagement: Engagement) => (
                          <View key={engagement.id} style={renderIndentation(4)}>
                            <Text style={styles.text}>
                              Engagement with {engagement.client} ({engagement.startDate} -{" "}
                              {engagement.endDate})
                            </Text>
                            {resume.Accomplishments.filter(
                              (a: Accomplishment) => a.engagementID === engagement.id,
                            ).map((accomplishment: Accomplishment) => (
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
              {resume.ContactInformation.References &&
                resume.ContactInformation.References.length > 0 && (
                  <View style={renderIndentation(2)}>
                    <Text style={styles.sectionTitle}>References</Text>
                    {resume.ContactInformation.References.map((reference: Reference) => (
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
