import React from "react"
import { StyleSheet, Text, View } from "react-native"

export default function Itemcard() {
  return (
    <View style={styles.itemCard}>
      <View style={styles.badge}>
        <Text style={styles.label}>New!</Text>
      </View>
      <View style={styles.frame417}>
        <View style={styles.productTitle}>
          <Text style={styles.tShirt}>T-Shirt</Text>
          <Text style={styles.classicLongSleeve}>Classic Long Sleeve</Text>
        </View>
        <Text style={styles.price}>$99</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "48%", // Adjust the width to fit within a responsive grid
    padding: 16,
    margin: 5, // Minimum gutter
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8, // Adjusted margin to fit grid spacing
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
