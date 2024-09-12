import React, { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ReferenceType, SummaryType, ExpandedResume } from "../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"
// import { ContactInformation } from "../../../../src/API"

interface ContactInformationType {
  resume: ExpandedResume
  name: string
}

const ContactInformationCard: React.FC<ContactInformationType> = ({ resume, name }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  return (
    <DataProvider>
      <View style={[styles.itemCard, renderTextColor(8, getBaseHueForResume(2))]}>
        <Text style={styles.header}>{name}</Text>

        <Text style={[styles.email, renderIndentation(2)]}>{resume.ContactInformation?.email}</Text>
        <Text style={[styles.phone, renderIndentation(2)]}>{resume.ContactInformation?.phone}</Text>
      </View>
    </DataProvider>
  )
}

// Styles for ReferenceItemCard
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // minWidth: 100, // Minimum width from responsive grid
    // maxWidth: 400, // Maximum width from responsive grid
    // width: "100%", // Take full available width
    // height: "60%",
    padding: 15,
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

  email: {
    color: "rgba(13,26,38,1)",
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
export default ContactInformationCard
