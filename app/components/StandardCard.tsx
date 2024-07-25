import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Standardcard() {
  return (
    <View style={styles.standardCard}>
      <Text>Standardcard</Text>

      <Image
        style={styles.image}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/nh7oo36bxzn-2976%3A6785?alt=media&token=8edbbf88-eb2c-425c-9f98-8d7d2d4b9113",
        }}
      />
      <View style={styles.cardArea}>
        <View style={styles.textGroup}>
          <Text style={styles.priceText}>$99 USD</Text>
          <Text style={styles.detailsText}>4bds 3 ba 2,530 sqft - Active</Text>
          <Text style={styles.addressText}>832 34th Ave, Seattle, WA 98122</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  standardCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 276,
    paddingTop: 24,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 160,
  },
  cardArea: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 16,
  },
  textGroup: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
  },
  priceText: {
    marginRight: 8,
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  detailsText: {
    marginRight: 8,
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  addressText: {
    color: "rgba(48,64,80,1)",
    fontSize: 14,
    lineHeight: 24, // 171% of 14px
    fontFamily: "Inter",
    fontWeight: "400",
  },
})
