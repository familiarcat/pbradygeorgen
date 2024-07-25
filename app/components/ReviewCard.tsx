import React from "react"
import { StyleSheet, Image, Text, View, useWindowDimensions } from "react-native"

export default function Reviewcard() {
  const { width: screenWidth } = useWindowDimensions()
  const isVertical = screenWidth <= 800 // Adjust this threshold based on your needs

  return (
    <View style={[styles.reviewCard, isVertical ? styles.vertical : styles.horizontal]}>
      <Image
        style={[styles.image, isVertical ? styles.imageVertical : styles.imageHorizontal]}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/qai2rmpa8ur-2976%3A6826?alt=media&token=d2b25232-1383-48ca-9fdf-cc018c7f1161",
        }}
      />
      <View
        style={[styles.cardArea, isVertical ? styles.cardAreaVertical : styles.cardAreaHorizontal]}
      >
        <Text>Reviewcard</Text>
        <View style={styles.title}>
          <View style={styles.frame}>
            <Text style={styles.infoText}>Information about this product</Text>
            <Image
              style={styles.icon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/qai2rmpa8ur-2976%3A6831?alt=media&token=f1f1a1df-67e4-4149-9723-8000d92102d4",
              }}
            />
          </View>
          <Text style={styles.productTitle}>Classic Long Sleeve T-Shirt</Text>
        </View>
        <Image
          style={styles.divider}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/qai2rmpa8ur-2976%3A6834?alt=media&token=8a84d4cf-9527-4a4a-8646-b80f91d82cc8",
          }}
        />
        <View style={styles.features}>
          <Text style={styles.featureText}>Information about this product.</Text>
          <Text style={styles.featureText}>Information about this product.</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>New!</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingContainer}>
            <Image
              style={styles.ratingImage}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/qai2rmpa8ur-2976%3A6841?alt=media&token=4ab9f422-7589-4aa4-8179-e529f6128212",
              }}
            />
            <Text style={styles.reviews}>Reviews</Text>
          </View>
          <Text style={styles.price}>$99/Night</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  reviewCard: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: 960,
    padding: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    marginBottom: 10,
  },
  horizontal: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  image: {
    borderRadius: 8,
  },
  imageHorizontal: {
    width: "40%",
    height: "100%",
  },
  imageVertical: {
    width: "100%",
    height: 200,
  },
  cardArea: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
  },
  cardAreaHorizontal: {
    width: "60%",
  },
  cardAreaVertical: {
    width: "100%",
  },
  title: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 8,
  },
  frame: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  infoText: {
    marginRight: 8,
    color: "rgba(92,102,112,1)",
    fontSize: 14,
    lineHeight: 24, // 171% of 14px
    fontFamily: "Inter",
    fontWeight: "400",
  },
  icon: {
    width: 24,
    height: 24,
  },
  productTitle: {
    color: "rgba(13,26,38,1)",
    fontSize: 20,
    lineHeight: 25, // 125% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(13,26,38,0.1)",
    marginVertical: 8,
  },
  features: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 8,
  },
  featureText: {
    marginBottom: 4,
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 32,
    backgroundColor: "rgba(239,240,240,1)",
  },
  badgeLabel: {
    color: "rgba(13,26,38,1)",
    fontSize: 12,
    lineHeight: 12, // 100% of 12px
    fontFamily: "Inter",
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  ratingImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  reviews: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 22, // 138% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  price: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
})
