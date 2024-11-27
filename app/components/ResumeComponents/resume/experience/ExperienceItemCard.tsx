import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import { Card } from "react-native-paper"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const EducationItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  // console.log("EducationItemCard", resume)
  return (
    <Card style={[renderTextColor(6, getBaseHueForResume(8))]}>
    <View style={[styles.itemCard]}>
      {resume.Experience && (
          <View style={[renderTextColor(4, getBaseHueForResume(4)), { width: "100%" }]}>
          

          {resume.Companies && resume.Companies.length > 0 && (
            
              <ResponsiveGrid width={"100%%"} align="left">
                {resume.Companies.map((company, index) => (
                 
                  <Card
                    key={company.id}
                    style={[renderIndentation(0), renderTextColor(1, getBaseHueForResume(index))]}
                  >
                    <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                      {company.name}
                    </Text>

                    {resume.Accomplishments.filter((d) => d.companyID === company.id).map((accomplishment, index) => (
                      <Text
                        key={accomplishment.id}
                        style={[
                          renderIndentation(1),
                          renderTextColor(3, getBaseHueForResume(index)),
                        ]}
                      >
                        {accomplishment.title}
                        {accomplishment.description}
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
