import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const ExperienceItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  console.log("ExperienceItemCard", resume)
  return (
    <View style={[styles.itemCard]}>
      {resume.Experience && (
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
                      style={[renderIndentation(1), renderTextColor(3, getBaseHueForResume(index))]}
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
      )}
    </View>
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
export default ExperienceItemCard
