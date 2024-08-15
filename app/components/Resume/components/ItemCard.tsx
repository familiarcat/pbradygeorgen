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
    width: "48%", // Adjust the width to fit within a responsive grid
    height: 200,
    padding: 16,
    margin: 5, // Space between cards
    backgroundColor: "rgba(255,255,0,1)",
    borderRadius: 8,
  },
  itemCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 32,
    backgroundColor: "rgba(214,245,219,1)",
  },
  label: {
    color: "rgba(54,94,61,1)",
    fontSize: 12,
    lineHeight: 12, // 100% of 12px
    fontFamily: "Inter",
    fontWeight: "600",
  },
  frame417: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  productTitle: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "70%", // Adjusted to fit within grid item
  },
  tShirt: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  classicLongSleeve: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  price: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "800",
    textAlign: "right",
  },
})

export default ItemCard
