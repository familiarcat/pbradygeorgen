import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ReferenceType } from "../../../types"
import { useDataContext } from "app/components/DataContext"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"

interface ReferenceCardType {
  reference: ReferenceType
}

// ItemCard adapted to fit within a responsive grid
const ReferenceItemCard: React.FC<ReferenceCardType> = ({ reference }) => {
  const { renderIndentation, renderTextColor } = useDataContext()
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
    width: "100%",
    borderRadius: 8,
    backgroundColor: "white",
  },
  header: {
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
