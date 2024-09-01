import React, { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ReferenceType, SummaryType, ContactInformationType } from "../../types"

// ItemCard adapted to fit within a responsive grid
const ContactInformationCard: React.FC<ContactInformationType> = ({ name, email, phone }) => {
  return (
    <View style={styles.itemCard}>
      <Text style={styles.header}>{name}</Text>

      <Text style={styles.tShirt}>{email}</Text>
      <Text style={styles.classicLongSleeve}>{phone}</Text>
    </View>
  )
}

// Styles for ReferenceItemCard
const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // minWidth: 100, // Minimum width from responsive grid
    maxWidth: 400, // Maximum width from responsive grid
    // width: "100%", // Take full available width
    height: "60%",
    padding: 5,
    // backgroundColor: "rgba(255,0,255,1)",
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
export default ContactInformationCard
