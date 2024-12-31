import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import { Card } from "react-native-paper"
import { BentoContainer, BentoItem } from "app/components/utility_components/Bento"

interface EducationItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const EducationItemCard: React.FC<EducationItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  // console.log("EducationItemCard", resume)
  return (
    
      <View style={[styles.itemCard]}>
        {resume.Education && (
          <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
            {resume.Schools && resume.Schools.length > 0 && (
              <View style={{ width: "100%" }}>
                <ResponsiveGrid width={"100%"} align="left">
                  <BentoContainer>
                      
                  {resume.Schools.map((school, index) => (
                    <View>
                    
                      <View
                        key={school.id}
                        style={[
                          renderIndentation(0),
                          renderTextColor(1, getBaseHueForResume(index)),
                        ]}
                      >
                        <Text
                          style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}
                        >
                          {school.name}
                        </Text>

                        {resume.Degrees.filter((d) => d.schoolID === school.id).map(
                          (degree, index) => (
                            <View>
                            <Text
                              key={degree.id}
                              style={[
                                renderIndentation(1),
                                renderTextColor(3, getBaseHueForResume(index)),
                              ]}
                            >
                              {degree.major}(
                              {degree.startYear ? new Date(degree.startYear).getFullYear() : "N/A"}{" "}
                              - {degree.endYear ? new Date(degree.endYear).getFullYear() : "N/A"})
                            </Text>
                            </View>
                          ),
                        )}
                      </View>
                  </View>
                  ))}
                  </BentoContainer>
                </ResponsiveGrid>
               </View>
            )}
          </View>
        )}
      </View>
  )
}

// Styles for ReferenceItemCard
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  header: {
    // Correct style for the header
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  
})
export default EducationItemCard
