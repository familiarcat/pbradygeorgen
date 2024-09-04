import React from "react"
import { StyleSheet, Text, View } from "react-native"
import {
  EducationType,
  ExpandedResume,
  ReferenceType,
  SummaryType,
  ExperienceType,
} from "../../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

// ItemCard adapted to fit within a responsive grid
const ExperienceItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  console.log("Experience Item Card", resume)
  return (
    <View style={[styles.itemCard]}>
      {resume.Experience && (
        <View style={[renderTextColor(4, getBaseHueForResume(4))]}>
          <Text
            style={[
              renderIndentation(1),
              styles.header,
              renderTextColor(3, getBaseHueForResume(3)),
            ]}
          >
            {resume.Experience?.title}
          </Text>
          {resume.Companies && resume.Companies.length > 0 && (
            <View>
              <ResponsiveGrid>
                {resume.Companies.map((company, index) => (
                  <View
                    key={company.id}
                    style={[renderIndentation(2), renderTextColor(1, getBaseHueForResume(index))]}
                  >
                    <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                      {company.name}
                    </Text>

                    {resume.Engagements.filter((d) => d.companyID === company.id).map(
                      (engagement, index) => (
                        <>
                          {console.log("engagement", engagement)},
                          <Text
                            key={engagement.id}
                            style={[
                              renderTextColor(3, getBaseHueForResume(index)),
                              renderIndentation(1),
                            ]}
                          >
                            <Text>{engagement.client}</Text>
                            <Text>{engagement.startDate}</Text>
                          </Text>
                        </>
                      ),
                    )}
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
    backgroundColor: "rgba(0,0,255,0)",
    fontColor: "rgba(255,0,255,1)",
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
