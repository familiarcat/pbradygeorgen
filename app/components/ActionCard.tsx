import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Actioncard() {
  return (
    <View style={styles.actionCard}>
      <Image
        style={styles.image}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
        }}
      />
      <View style={styles.cardArea}>
        <View style={styles.mainText}>
          <Text style={styles.productName}>Classic Long Sleeve T-Shirt</Text>
          <Text style={styles.productInfo}>Information about this product</Text>
        </View>
        <Image
          style={styles.rating}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
          }}
        />
        <Text>Hello</Text>
        <Text style={styles.priceText}>$99 USD</Text>
        <View style={styles.button}>
          <Text style={styles.buttonLabel}>Button</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 635,
    backgroundColor: "rgba(255,255,255,1)",
  },
  image: {
    width: "100%",
    height: 408,
  },
  cardArea: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 16,
  },
  mainText: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginRight: 16,
  },
  productName: {
    marginRight: 8,
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  productInfo: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  rating: {
    width: "100%",
    height: 24,
    marginRight: 16,
  },
  priceText: {
    marginRight: 16,
    color: "rgba(13,26,38,1)",
    fontSize: 20,
    lineHeight: 25, // 125% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0)",
    borderRadius: 4,
    backgroundColor: "rgba(4,125,149,1)",
  },
  buttonLabel: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    lineHeight: 30, // 150% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
})
