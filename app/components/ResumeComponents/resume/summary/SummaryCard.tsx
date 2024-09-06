// SummaryCard.tsx
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ExpandedResume, EducationType } from "../../../types" // Adjust path as necessary
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import ReferenceItemCard from "./reference/ReferenceItemCard"
import { DataProvider, useDataContext } from "app/components/DataContext"
import EducationItemCard from "./education/EducationItemCard"
import ExperienceItemCard from "./experience/ExperienceItemCard"

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
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()

  const displayData = () => {
    switch (name) {
      case "References":
        return (
          <>
            {/* <Text>{resume.ContactInformation?.name || "No Contact Information name"}</Text>
            <Text>{"References"}</Text> */}
            <ResponsiveGrid>
              {resume?.References?.map((reference) => (
                <ReferenceItemCard reference={reference} key={reference.name} />
              ))}
            </ResponsiveGrid>
          </>
        )
      case "Education":
        return (
          <>
            {/* {console.log("Education", resume.Education)} */}
            {/* <ResponsiveGrid>
              {resume?.References?.map((reference) => (
                <ReferenceItemCard reference={reference} key={reference.name} />
              ))}
            </ResponsiveGrid> */}

            {resume.Education && <EducationItemCard resume={resume} />}
          </>
        )
      case "Experience":
        return (
          <>
            <Text>{resume.Experience?.title || "No Experience Title"}</Text>
            <Text>{resume.Experience?.text || "No Experience Text"}</Text>
            {resume.Experience && <ExperienceItemCard resume={resume} />}
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
  if (name == "Contact Information") {
    // console.log("name is Contact Information")
    name = "References"
  }
  return (
    <>
      <Text style={[styles.itemCardTitle, renderTextColor(5, getBaseHueForResume(2))]}>{name}</Text>
      {displayData()}
    </>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
})

export default SummaryCard
