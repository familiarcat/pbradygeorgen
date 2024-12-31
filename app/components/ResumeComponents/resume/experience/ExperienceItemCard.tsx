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
                  <ResponsiveGrid width={"100%"} align="left">
                    <BentoContainer>
                      {resume.Companies.map((company, index) => (
                        <View key={company.id} style={renderIndentation(0)}>
                          <Text
                            style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}
                          >
                            {company.name} - {company.role} ({company.startDate} - {company.endDate}
                            )
                          </Text>
                          
                            <Text
                              style={[
                                styles.header,
                                renderIndentation(1),
                                renderTextColor(4, getBaseHueForResume(4) + 180),
                              ]}
                            >
                              Role: {company.title}
                            </Text>
                         

                          {resume.Engagements.filter((e) => e.companyID === company.id).map(
                            (engagement) => (
                              <View key={engagement.id} style={renderIndentation(1.5)}>
                                <Text
                                  style={[
                                    styles.subHeader,
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
                                      renderIndentation(0.5),
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
              )}
            </View>
          )}
        </View>
      </Card>
    </>
  )
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subHeader: {
    // Correct style for the header
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
})
export default ExperienceItemCard
