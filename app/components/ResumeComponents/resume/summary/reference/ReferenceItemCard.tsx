import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ReferenceType, SummaryType } from "../../../../types"

interface SummaryCardProps {
  reference: ReferenceType
}

// ItemCard adapted to fit within a responsive grid
const ReferenceItemCard: React.FC<SummaryCardProps> = ({ reference }) => {
  return (
    <View style={styles.itemCard}>
      <Text style={styles.header}>{reference.name}</Text>
      {/* <View style={styles.badge}>
        <Text style={styles.label}>{reference.name}</Text>
      </View> */}
      {/* <View style={styles.frame417}> */}
      {/* <View style={styles.productTitle}> */}
      <Text style={styles.tShirt}>{reference.email}</Text>
      <Text style={styles.classicLongSleeve}>{reference.phone}</Text>
      {/* </View> */}
      {/* <Text style={styles.price}>$99</Text> */}
      {/* </View> */}
    </View>
  )
}

// Styles for ItemCard
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: 100, // Minimum width from responsive grid
    maxWidth: 200, // Maximum width from responsive grid
    width: "100%", // Take full available width
    height: "60%",
    padding: 5,
    // backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  header: {
    // Correct style for the header
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
export default ReferenceItemCard
