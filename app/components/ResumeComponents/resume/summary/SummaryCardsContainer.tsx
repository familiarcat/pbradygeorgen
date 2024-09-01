// SummaryCardsContainer.tsx
import React from "react"
import { View, StyleSheet } from "react-native"
import SummaryCard from "./SummaryCard"
import { ExpandedResume } from "../../../types" // Adjust path as necessary

import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ResumeSection {
  name: string
  data: ExpandedResume
}

const SummaryCardsContainer: React.FC<{ resume: ExpandedResume }> = ({ resume }) => {
  const sortOrder = [
    "Contact Information",
    "Education",
    "Experience",
    "Company",
    "School",
    // Add other sections as needed
  ]

  const sectionData: ResumeSection[] = [
    { name: "Contact Information", data: resume },
    { name: "Education", data: resume },
    { name: "Experience", data: resume },
    // { name: "Company", data: resume },
    // { name: "School", data: resume },
    // Populate with actual data as needed
  ]

  // Sort sections based on the predefined sortOrder
  sectionData.sort((a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name))

  return (
    <View>
      {sectionData.map((section) => (
        <SummaryCard key={section.name} resume={section.data} name={section.name} />
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // minWidth: 100, // Minimum width from responsive grid
    // maxWidth: 400, // Maximum width from responsive grid
    // width: "100%", // Take full available width
    // height: "60%",
    padding: 5,
    // backgroundColor: "purple",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    width: "100%",
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
    padding: 8,
    borderRadius: 32,
    backgroundColor: "rgba(214,245,219,1)",
  },
  label: {
    color: "rgba(54,94,61,1)",
    fontSize: 12,
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
  },
  tShirt: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    fontWeight: "700",
  },
  classicLongSleeve: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    letterSpacing: 0.16,
    fontWeight: "400",
  },
  price: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
  },
})
export default SummaryCardsContainer
