// ItemCard.tsx

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ExpandedResume } from "../../types" // Adjust path as necessary

interface ItemCardProps {
  resume: ExpandedResume
  name: string // Accept a name for human-readable display
}

const ItemCard: React.FC<ItemCardProps> = ({ resume, name }) => {
  const displayData = () => {
    switch (name) {
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
    flexBasis: "100%", // Default to full width on mobile
    padding: 16,
    margin: 5, // Space between cards
    borderRadius: 8,
    backgroundColor: "rgba(255,255,0,1)", // Example background color

    // Tablet
    "@media (min-width: 768px)": {
      flexBasis: "48%", // 2-column layout on tablets
    },

    // Desktop
    "@media (min-width: 1024px)": {
      flexBasis: "31%", // 3-column layout on desktops
    },
  },
  itemCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
})

export default ItemCard
