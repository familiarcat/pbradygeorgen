// SummaryCardsContainer.tsx
import React from "react"
import { View } from "react-native"
import SummaryCard from "./SummaryCard"
import { ExpandedResume } from "../../types" // Adjust path as necessary
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
    { name: "Company", data: resume },
    { name: "School", data: resume },
    // Populate with actual data as needed
  ]

  // Sort sections based on the predefined sortOrder
  sectionData.sort((a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name))

  return (
    <>
      {sectionData.map((section) => (
        <SummaryCard key={section.name} resume={section.data} name={section.name} />
      ))}
    </>
  )
}

export default SummaryCardsContainer
