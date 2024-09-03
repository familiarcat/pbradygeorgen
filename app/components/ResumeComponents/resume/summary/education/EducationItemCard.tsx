import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ReferenceType, SummaryType } from "../../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface EducationItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const EducationItemCard: React.FC<EducationItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  console.log("EducationItemCard", resume)
  return (
    <View style={styles.itemCard}>
      {resume.Education && (
        <View style={renderIndentation(0)}>
          <Text style={[renderTextColor(3, getBaseHueForResume(3) + 120)]}>
            {resume.Education.summary}
          </Text>
          {resume.Schools && resume.Schools.length > 0 && (
            <View style={renderIndentation(1)}>
              <Text style={[renderTextColor(3, getBaseHueForResume(4) + 120)]}>Schools</Text>
              <ResponsiveGrid>
                {resume.Schools.map((school) => (
                  <View key={school.id} style={renderIndentation(1)}>
                    <Text style={[styles.header, renderTextColor(4, getBaseHueForResume(4) + 120)]}>
                      {school.name}
                    </Text>

                    {resume.Degrees.filter((d) => d.schoolID === school.id).map((degree) => (
                      <Text
                        key={degree.id}
                        style={[
                          renderTextColor(5, getBaseHueForResume(4) + 120),
                          renderIndentation(1),
                        ]}
                      >
                        {degree.major} ({degree.startYear} - {degree.endYear})
                      </Text>
                    ))}
                  </View>
                ))}
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: "100%", // Minimum width from responsive grid
    // maxWidth: 200, // Maximum width from responsive grid
    width: 100,
    height: "100%",
    // padding: 15,
    backgroundColor: "rgba(255,0,255,0)",
    fontColor: "rgba(255,0,255,1)",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
    fontSize: 16,
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
