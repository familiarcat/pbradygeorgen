// ItemCard.tsx

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { EducationType, ExpandedResume, ExperienceType } from "../../types" // Adjust path as necessary

interface ItemCardProps {
  resume: ExpandedResume
  name: string // Accept a name for human-readable display
}

const ItemCard: React.FC<ItemCardProps> = ({ resume, name }) => {
  const displayData = () => {
    switch (name) {
      case "Contact Information":
        return (
          <>
            {console.log("resume.ContactInformation", resume.ContactInformation)}
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
      case "Company":
        return (
          <>
            {resume.Companies?.map((company) => (
              <Text key={company.id}>{company.name}</Text>
            ))}
          </>
        )
      case "School":
        return (
          <>
            {resume.Schools?.map((school) => (
              <Text key={school.id}>{school.name}</Text>
            ))}
          </>
        )
      // Add more cases for other models like Company, etc.
      default:
        return <Text>No Data Available</Text>
    }
  }

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
    margin: 8, // Space between cards
    backgroundColor: "rgba(255,255,0,1)",
    borderRadius: 8,
    flexGrow: 1,

    // Responsive width and height based on screen size
    // Mobile: Single column
    "@media (max-width: 640px)": {
      flexBasis: "100%", // Full width on mobile
    },
    // Tablet: Two columns
    "@media (min-width: 641px) and (max-width: 1023px)": {
      flexBasis: "48%", // Two columns on tablet
    },
    // Desktop: Three columns
    "@media (min-width: 1024px)": {
      flexBasis: "30%", // Three columns on desktop
    },
  },
  itemCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
})

export default ItemCard
