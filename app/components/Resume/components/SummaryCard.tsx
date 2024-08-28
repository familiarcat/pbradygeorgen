// SummaryCard.tsx
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ExpandedResume } from "../../types" // Adjust path as necessary

interface SummaryCardProps {
  resume: ExpandedResume
  name: string // Accept a name for human-readable display
}

const sortOrder = [
  "Contact Information",
  "Education",
  "Experience",
  // Exclude "Company" and "School" by commenting them out or removing them
]

const SummaryCard: React.FC<SummaryCardProps> = ({ resume, name }) => {
  const displayData = () => {
    switch (name) {
      case "Contact Information":
        return (
          <>
            <Text>{resume.ContactInformation?.name || "No Contact Information name"}</Text>
            {resume?.References?.map((reference) => (
              <Text key={reference.id}>{reference.name}</Text>
            ))}
          </>
        )
      case "Education":
        return (
          <>
            <Text>{resume.Education?.summary || "No Education Summary"}</Text>
            {resume.Schools?.map((school) => (
              <Text key={school.id}>{school.name}</Text>
            ))}
          </>
        )
      case "Experience":
        return (
          <>
            <Text>{resume.Experience?.title || "No Experience Title"}</Text>
            <Text>{resume.Experience?.text || "No Experience Text"}</Text>
          </>
        )
      // Cases for "Company" and "School" are still here if you want to use them later
      case "Company":
      case "School":
      default:
        return null // Return null for cases not included in sortOrder
    }
  }

  if (!sortOrder.includes(name)) return null // Do not render the component if the name is not in sortOrder

  return (
    <View style={styles.itemCard}>
      <Text style={styles.itemCardTitle}>{name}</Text>
      {displayData()}
    </View>
  )
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    margin: 8,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    flexGrow: 1,
    "@media (max-width: 640px)": {
      flexBasis: "100%",
    },
    "@media (min-width: 641px) and (max-width: 1023px)": {
      flexBasis: "48%",
    },
    "@media (min-width: 1024px)": {
      flexBasis: "30%",
    },
  },
  itemCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
})

export default SummaryCard
