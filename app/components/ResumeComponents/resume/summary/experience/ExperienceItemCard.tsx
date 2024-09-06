import React from "react"
import { StyleSheet, Text, View, Dimensions } from "react-native"
import { ExpandedResume } from "../../../../types" // Assuming this includes necessary types
import { useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ExperienceItemCardType {
  resume: ExpandedResume
}

const ExperienceItemCard: React.FC<ExperienceItemCardType> = ({ resume }) => {
  const { getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()

  return (
    <View style={styles.itemCard}>
      {resume.Experience && (
        <>
          <Text
            style={[
              styles.header,
              renderTextColor(3, getBaseHueForResume(3)),
              renderIndentation(1),
            ]}
          >
            {resume.Experience.title}
          </Text>
          {resume.Companies && resume.Companies.length > 0 && (
            <ResponsiveGrid>
              {resume.Companies.map((company, index) => (
                <View
                  key={company.id}
                  style={[renderIndentation(2), renderTextColor(1, getBaseHueForResume(index))]}
                >
                  <Text style={[styles.header, renderTextColor(2, getBaseHueForResume(index))]}>
                    {company.name}
                  </Text>
                  {resume.Engagements.filter((e) => e.companyID === company.id).map(
                    (engagement, index) => (
                      <Text
                        key={engagement.id}
                        style={[
                          renderIndentation(1),
                          renderTextColor(3, getBaseHueForResume(index)),
                        ]}
                      >
                        Engagement: {engagement.client} (
                        {new Date(engagement.startDate ?? "").getFullYear()} -{" "}
                        {engagement.endDate
                          ? new Date(engagement.endDate).getFullYear()
                          : "Present"}
                        )
                      </Text>
                    ),
                  )}
                </View>
              ))}
            </ResponsiveGrid>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%", // This ensures it fills the full width of its parent
    padding: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
})

export default ExperienceItemCard
