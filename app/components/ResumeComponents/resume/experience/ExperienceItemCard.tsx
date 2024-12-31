import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import { Card } from "react-native-paper"
import { BentoContainer, BentoItem } from "app/components/utility_components/Bento"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const ExperienceItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  console.log("ExperienceItemCard", resume)
  return (
    <>
      <Card>
        <View style={[styles.itemCard]}>
                
                {resume.Experience && (
                  <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
                    {resume.Companies && resume.Companies.length > 0 && (
                      
                      <View style={{ width: "100%" }}>
                        <ResponsiveGrid width={"100%"} align="left">
                          <BentoContainer>
                              
                          {resume.Companies.map((company, index) => (
                            
                            <View key={company.id} style={renderIndentation(0)}>
                          <Text
                            style={[styles.text, renderTextColor(4, getBaseHueForResume(4) + 180)]}
                          >
                            {company.name} - {company.role} ({company.startDate} - {company.endDate}
                            )
                          </Text>
                          <Card>
                          <Text
                            style={[styles.text,renderIndentation(1), renderTextColor(4, getBaseHueForResume(4) + 180)]}
                          >
                            Role: {company.title}
                          </Text>
                          </Card>

                          {resume.Engagements.filter((e) => e.companyID === company.id).map(
                            (engagement) => (
                             
                              <View key={engagement.id} style={renderIndentation(1.5)}>
                                <Text
                                  style={[
                                    styles.text,
                                    renderTextColor(5, getBaseHueForResume(4) + 180),
                                  ]}
                                >
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
                                      renderTextColor(6, getBaseHueForResume(4) + 180),
                                      renderIndentation(.5),
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
                          </BentoContainer>
                        </ResponsiveGrid>
                       </View>
                    )}
                  </View>
                )}
              </View>
        {/* <View style={[styles.itemCard]}>
          {resume.Companies && resume.Companies.length > 0 && (
            <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
              {resume.Companies && resume.Companies.length > 0 && (
                <View style={{ width: "100%" }}>
                  <ResponsiveGrid width={"100%"} align="left">
                    {resume.Companies.map((company, index) => (
                      <Card>
                        <View key={company.id} style={renderIndentation(1)}>
                          <Text
                            style={[styles.text, renderTextColor(4, getBaseHueForResume(4) + 180)]}
                          >
                            {company.name} - {company.role} ({company.startDate} - {company.endDate}
                            )
                          </Text>
                          <Card>
                          <Text
                            style={[styles.text,renderIndentation(2), renderTextColor(4, getBaseHueForResume(4) + 180)]}
                          >
                            Title: {company.title}
                          </Text>
                          </Card>

                          {resume.Engagements.filter((e) => e.companyID === company.id).map(
                            (engagement) => (
                              <Card>
                              <View key={engagement.id} style={renderIndentation(3)}>
                                <Text
                                  style={[
                                    styles.text,
                                    renderTextColor(5, getBaseHueForResume(4) + 180),
                                  ]}
                                >
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
                                      renderTextColor(6, getBaseHueForResume(4) + 180),
                                      renderIndentation(1),
                                    ]}
                                  >
                                    Accomplishment: {accomplishment.title} -{" "}
                                    {accomplishment.description}
                                  </Text>
                                ))}
                              </View>
                              </Card>
                            ),
                          )}
                        </View>
                      </Card>
                    ))}
                  </ResponsiveGrid>
                </View>
              )}
            </View>
          )}
        </View> */}
        {/* <View style={[styles.itemCard]}>
        {resume.Experience && (
          <>
            {resume.Companies && resume.Companies.length > 0 && (
              <View style={renderIndentation(2)}>
                <Text
                  style={[styles.sectionTitle, renderTextColor(3, getBaseHueForResume(4) + 180)]}
                >
                  Companies
                </Text>
                {resume.Companies.map((company) => (
                  <View key={company.id} style={renderIndentation(1)}>
                    <Text style={[styles.text, renderTextColor(4, getBaseHueForResume(4) + 180)]}>
                      {company.name} - {company.role} ({company.startDate} - {company.endDate})
                    </Text>
                    <Text style={[styles.text, renderTextColor(4, getBaseHueForResume(4) + 180)]}>
                      Title: {company.title}
                    </Text>

                    {resume.Engagements.filter((e) => e.companyID === company.id).map(
                      (engagement) => (
                        <View key={engagement.id} style={renderIndentation(1)}>
                          <Text
                            style={[styles.text, renderTextColor(5, getBaseHueForResume(4) + 180)]}
                          >
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
                                renderTextColor(6, getBaseHueForResume(4) + 180),
                                renderIndentation(1),
                              ]}
                            >
                              Accomplishment: {accomplishment.title} - {accomplishment.description}
                            </Text>
                          ))}
                        </View>
                      ),
                    )}
                  </View>
                ))}
              </View>
            )}
            <View style={[renderTextColor(4, getBaseHueForResume(4)), { width: "100%" }]}>
              {resume.Companies && resume.Companies.length > 0 && (
                <ResponsiveGrid width={"100%"} align="left">
                  <Text
                    style={[
                      renderIndentation(0),
                      styles.header,
                      renderTextColor(3, getBaseHueForResume(3)),
                    ]}
                  >
                    {resume.Experience.title}
                  </Text>
                  {resume.Companies.map((company, index) => (
                    <View
                      key={company.id}
                      style={[renderIndentation(2), renderTextColor(1, getBaseHueForResume(index))]}
                    >
                      <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                        {company.name}
                      </Text>

                      {resume.Companies.filter((d) => d.id === company.id).map((company, index) => (
                        <Text
                          key={company.id}
                          style={[
                            renderIndentation(1),
                            renderTextColor(3, getBaseHueForResume(index)),
                          ]}
                        >
                          {company.role}(
                          {company.startDate ? new Date(company.startDate).getFullYear() : "N/A"} -{" "}
                        </Text>
                      ))}
                    </View>
                  ))}
                </ResponsiveGrid>
              )}
            </View>
          </>
        )}
      </View> */}
      </Card>
    </>
  )
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // minWidth: "100%", // Minimum width from responsive grid

    // padding: 15,
    // fontColor: "rgba(255,0,255,1)",
    borderRadius: 8,
  },

  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    // Correct style for the header
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
export default ExperienceItemCard
