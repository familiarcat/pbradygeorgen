import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import { Card } from "react-native-paper"

interface EducationItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const EducationItemCard: React.FC<EducationItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  // console.log("EducationItemCard", resume)
  return (
    <Card style={[renderTextColor(6, getBaseHueForResume(8))]}>
    <View style={[styles.itemCard]}>
      {resume.Education && (
          <View style={[renderTextColor(4, getBaseHueForResume(4)), { width: "100%" }]}>
          

          {resume.Schools && resume.Schools.length > 0 && (
            
              <ResponsiveGrid width={"100%%"} align="left">
                {resume.Schools.map((school, index) => (
                 
                  <Card
                    key={school.id}
                    style={[renderIndentation(0), renderTextColor(1, getBaseHueForResume(index))]}
                  >
                    <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                      {school.name}
                    </Text>

                    {resume.Degrees.filter((d) => d.schoolID === school.id).map((degree, index) => (
                      <Text
                        key={degree.id}
                        style={[
                          renderIndentation(1),
                          renderTextColor(3, getBaseHueForResume(index)),
                        ]}
                      >
                        {degree.major}(
                        {degree.startYear ? new Date(degree.startYear).getFullYear() : "N/A"} -{" "}
                        {degree.endYear ? new Date(degree.endYear).getFullYear() : "N/A"})
                      </Text>
                    ))}
                  </Card>
                  
                ))}
              </ResponsiveGrid>
            
          )}
        </View>
      )}
    </View>
    </Card>
  )
}

// Styles for ReferenceItemCard
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
    email: {
      color: "blue",
      fontSize: 16,
      fontWeight: "700",
    },
    phone: {
      color: "rgba(48,64,80,1)",
      fontSize: 16,
      letterSpacing: 0.16,
      fontWeight: "400",
    },
  })
export default EducationItemCard
