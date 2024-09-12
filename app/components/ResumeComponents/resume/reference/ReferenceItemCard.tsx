import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ReferenceType, SummaryType } from "../../../types"
import { DataProvider, useDataContext } from "app/components/DataContext"

interface ReferenceCardType {
  reference: ReferenceType
}

// ItemCard adapted to fit within a responsive grid
const ReferenceItemCard: React.FC<ReferenceCardType> = ({ reference }) => {
  const { resumes, getBaseHueForResume, renderIndentation, renderTextColor } = useDataContext()
  return (
    <View style={styles.itemCard}>
      <Text style={[styles.header, renderTextColor(3, 0), renderIndentation(0)]}>
        {reference.name}
      </Text>
      <Text style={[styles.email, renderTextColor(5, 0), renderIndentation(0.5)]}>
        {reference.email}
      </Text>
      <Text style={[styles.phone, renderTextColor(4, 1), renderIndentation(0.75)]}>
        {reference.phone}
      </Text>
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
    width: 225,
    height: "100%",
    // padding: 15,
    backgroundColor: "rgba(255,0,255,0)",
    fontColor: "rgba(255,0,255,1)",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
    fontSize: 16,
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
export default ReferenceItemCard
