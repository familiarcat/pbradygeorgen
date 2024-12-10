// ResumeView.tsx
import React from "react"
import { ScrollView, View, Text, StyleSheet } from "react-native"
import { DataProvider, useDataContext } from "../DataContext" // Import the context and provider
import ResponsiveGrid from "../ResponsiveGrid"
import ReferenceItemCard from "./resume/reference/ReferenceItemCard"
import { SkillType } from "../types"
import EducationItemCard from "./resume/education/EducationItemCard"
import ContactInformationCard from "./resume/contact/ContactInformationCard"
import ExperienceItemCard from "./resume/experience/ExperienceItemCard"
import Actioncard from "../ActionCard"
import Productcard from "../ProductCard"
import Standardcard from "../StandardCard"
import { Surface } from "react-native-paper"


const ResumeViewContent = () => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  return (
    <ScrollView style={styles.container}>
      <Surface>
      <View>
      {resumes.map((resume, index) => {
        const baseHue = getBaseHueForResume(index)
        // console.log("contactInformation", resume.ContactInformation?.name)
        return (
          // using the Summary view to contain the Resume data
          <View key={resume.id} style={[styles.resume, renderTextColor(0, baseHue)]}>
            {resume.ContactInformation && (
              <ContactInformationCard resume={resume} name="Contact Information" />
            )}

            {resume.Skills && resume.Skills.length > 0 && (
              <View style={renderIndentation(1)}>
                <Text style={[styles.sectionTitle, renderTextColor(1, baseHue + 60)]}>Skills!</Text>
                <View style={styles.tags}>
                  {resume.Skills.map((skill: SkillType) => (
                    <View style={styles.badge} key={skill.id}>
                      <Text style={[renderTextColor(2, getBaseHueForResume(3))]}>
                        {skill.title}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* {resume.Skills.map((skill) => (
                  <Text
                    key={skill.id}
                    style={[styles.text, renderTextColor(3, baseHue + 60), renderIndentation(1)]}
                  >
                    {skill.title}
                  </Text>
                ))} */}
              </View>
            )}
            
            {resume.Education && (
              <View style={renderIndentation(1)}>
                
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 180)]}>
                  Education!
                </Text>
                <EducationItemCard resume={resume} />
                
              

                {/* <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Title: {resume.Experience ? resume.Experience.title : ""}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Text: {resume.Experience?.text}
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
                )} */}
              </View>
            )}

            {resume.Experience && (
              <View style={renderIndentation(1)}>
                {/* <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 180)]}>
                  Experience!
                </Text> */}
                <Text style={[styles.sectionTitle, renderTextColor(2, baseHue + 180)]}>
                  Experience!
                </Text>
                <ExperienceItemCard resume={resume} />

                {/* <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Title: {resume.Experience.title}
                </Text> */}
                {/* <Text style={[styles.text, renderTextColor(3, baseHue + 180)]}>
                  Text: {resume.Experience.text}
                </Text> */}
                {/* {resume.Companies && resume.Companies.length > 0 && (
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
                )} */}
              </View>
            )}
            {resume.Summary && (
              <View style={renderIndentation(0)}>
                {/* <Text style={[styles.sectionTitle, renderTextColor(2, baseHue)]}>Summary</Text>
                <Text style={[styles.text, renderTextColor(3, baseHue)]}>
                  Goals: {resume.Summary.goals}
                </Text>
                <Text style={[styles.text, renderTextColor(3, baseHue)]}>
                  Persona: {resume.Summary.persona}
                </Text> */}
                {/* <SummaryView resume={resume} /> */}

                {resume?.References?.map((reference) => (
                  <ReferenceItemCard reference={reference} key={reference.name} />
                ))}
              </View>
            )}
          </View>
        )
      })}
      </View>
      
      </Surface>
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
    elevation: 8,
  },

  tags: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(239,240,240,1)",
  },
  badgeLabel: {
    fontWeight: "500",
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

// export default ResumeView

export default ResumeView
