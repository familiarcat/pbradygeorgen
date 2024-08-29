// ResumeView.tsx
import React from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { DataProvider, useDataContext } from "../DataContext" // Import the context and provider
import SummaryView from "./resume/ResumeView"

const ResumeViewContent = () => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()

  return (
    <ScrollView style={styles.container}>
      {resumes.map((resume, index) => {
        const baseHue = getBaseHueForResume(index)
        console.log("contactInformation", resume.ContactInformation?.name)
        return (
          <View key={resume.id} style={[styles.resume, renderTextColor(0, baseHue)]}>
            <Text style={[styles.resumeTitle, renderTextColor(1, baseHue)]}>
              {resume.ContactInformation?.name}
            </Text>

            {resume.Summary && (
              <View style={renderIndentation(1)}>
                {/* <Text style={[styles.sectionTitle, renderTextColor(2, baseHue)]}>Summary</Text>
                <Text style={[styles.text, renderTextColor(3, baseHue)]}>
                  Goals: {resume.Summary.goals}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue)]}>
                  Persona: {resume.Summary.persona}
                </Text> */}
                <SummaryView resume={resume} />
              </View>
            )}

            {resume.Skills && resume.Skills.length > 0 && (
              <View style={renderIndentation(1)}>
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 60)]}>Skills</Text>
                {resume.Skills.map((skill) => (
                  <Text
                    key={skill.id}
                    style={[styles.text, renderTextColor(3, baseHue + 60), renderIndentation(1)]}
                  >
                    {skill.title}
                  </Text>
                ))}
              </View>
            )}

            {resume.Education && (
              <View style={renderIndentation(1)}>
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 120)]}>
                  Education
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 120)]}>
                  Summary: {resume.Education.summary}
                </Text>
                {resume.Schools && resume.Schools.length > 0 && (
                  <View style={renderIndentation(2)}>
                    <Text style={[styles.sectionTitle, renderTextColor(3, baseHue + 120)]}>
                      Schools
                    </Text>
                    {resume.Schools.map((school) => (
                      <View key={school.id} style={renderIndentation(1)}>
                        <Text style={[styles.text, renderTextColor(4, baseHue + 120)]}>
                          {school.name}
                        </Text>
                        {resume.Degrees.filter((d) => d.schoolID === school.id).map((degree) => (
                          <Text
                            key={degree.id}
                            style={[
                              styles.text,
                              renderTextColor(5, baseHue + 120),
                              renderIndentation(1),
                            ]}
                          >
                            {degree.major} ({degree.startYear} - {degree.endYear})
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
            {resume.ContactInformation && (
              <View style={renderIndentation(1)}>
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 240)]}>
                  Contact Information
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 240)]}>
                  Name: {resume.ContactInformation?.name}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 240)]}>
                  Email: {resume.ContactInformation?.email}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 240)]}>
                  Phone: {resume.ContactInformation?.phone}
                </Text>
                {resume.References && resume.References?.length > 0 && (
                  <View style={renderIndentation(2)}>
                    <Text style={[styles.sectionTitle, renderTextColor(3, baseHue + 240)]}>
                      References
                    </Text>
                    {resume.References?.map((reference) => (
                      <Text
                        key={reference.id}
                        style={[
                          styles.text,
                          renderTextColor(4, baseHue + 240),
                          renderIndentation(1),
                        ]}
                      >
                        {reference?.name} - {reference?.phone} - {reference?.email}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
            {resume.Experience && (
              <View style={renderIndentation(1)}>
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 180)]}>
                  Experience
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Title: {resume.Experience.title}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Text: {resume.Experience.text}
                </Text>
                {resume.Companies && resume.Companies.length > 0 && (
                  <View style={renderIndentation(2)}>
                    <Text style={[styles.sectionTitle, renderTextColor(3, baseHue + 180)]}>
                      Companies
                    </Text>
                    {resume.Companies.map((company) => (
                      <View key={company.id} style={renderIndentation(1)}>
                        <Text style={[styles.text, renderTextColor(4, baseHue + 180)]}>
                          {company.name} - {company.role} ({company.startDate} - {company.endDate})
                        </Text>
                        <Text style={[styles.text, renderTextColor(4, baseHue + 180)]}>
                          Title: {company.title}
                        </Text>

                        {resume.Engagements.filter((e) => e.companyID === company.id).map(
                          (engagement) => (
                            <View key={engagement.id} style={renderIndentation(1)}>
                              <Text style={[styles.text, renderTextColor(5, baseHue + 180)]}>
                                Engagement with {engagement.client} ({engagement.startDate} -{" "}
                                {engagement.endDate})
                              </Text>
                              {resume.Accomplishments.filter(
                                (a) => a.engagementID === engagement.id,
                              ).map((accomplishment) => (
                                <Text
                                  key={accomplishment.id}
                                  style={[
                                    styles.text,
                                    renderTextColor(6, baseHue + 180),
                                    renderIndentation(1),
                                  ]}
                                >
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
          </View>
        )
      })}
    </ScrollView>
  )
}

const ResumeView = () => (
  <DataProvider>
    <ResumeViewContent />
  </DataProvider>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  resume: {
    marginBottom: 20,
    padding: 15, // Added 5px of padding
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
