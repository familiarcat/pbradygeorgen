// SummaryView.tsx
import React from "react"
import { StyleSheet, Image, Text, View, useWindowDimensions } from "react-native"
import { useDataContext } from "../../DataContext" // Import the context hook

const SummaryView: React.FC = () => {
  const { renderIndentation, renderTextColor } = useDataContext() // Access context data
  const { width: screenWidth } = useWindowDimensions()
  const isVertical = screenWidth <= 640 // Use 640px as the breakpoint

  const level = 2 // Define the hierarchy level for this component
  const baseHue = 0 // Set base hue, can be passed as a prop if needed

  return (
    <View style={[styles.productCard, isVertical ? styles.vertical : styles.horizontal]}>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, isVertical ? styles.imageVertical : styles.imageHorizontal]}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
          }}
        />
      </View>

      <View
        style={[styles.cardArea, isVertical ? styles.cardAreaVertical : styles.cardAreaHorizontal]}
      >
        <Text style={[styles.title, renderTextColor(level, baseHue)]}>
          Summary Classic Long Sleeve T-Shirt
        </Text>
        <View style={styles.ratings}>
          <Image
            style={styles.ratingImage}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
            }}
          />
          <Text style={[styles.ratingText, renderTextColor(level, baseHue)]}>72</Text>
        </View>
        <View style={styles.tags}>
          <View style={styles.badge}>
            <Text style={[styles.badgeLabel, renderTextColor(level, baseHue)]}>New</Text>
          </View>
          <View style={styles.badge}>
            <Text style={[styles.badgeLabel, renderTextColor(level, baseHue)]}>Classic</Text>
          </View>
          <View style={styles.badge}>
            <Text style={[styles.badgeLabel, renderTextColor(level, baseHue)]}>Modern</Text>
          </View>
        </View>
        <Text style={[styles.infoText, renderTextColor(level, baseHue)]}>
          Information about this product.
        </Text>
        <View style={styles.quote}>
          <Image
            style={styles.quoteIcon}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
            }}
          />
          <Text style={[styles.quoteText, renderTextColor(level, baseHue)]}>
            “This is a quote.“
          </Text>
        </View>
        <Image
          style={styles.divider}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
          }}
        />
        <View style={styles.features}>
          <View style={styles.feature}>
            <Image
              style={styles.featureIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
              }}
            />
            <Text style={[styles.featureText, renderTextColor(level, baseHue)]}>Fast</Text>
          </View>
          <View style={styles.feature}>
            <Image
              style={styles.featureIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
              }}
            />
            <Text style={[styles.featureText, renderTextColor(level, baseHue)]}>Fun</Text>
          </View>
          <View style={styles.feature}>
            <Image
              style={styles.featureIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/u8rrnye9gf-2976%3A6822?alt=media&token=f98c3286-3145-4770-b141-95ecdce280b7",
              }}
            />
            <Text style={[styles.featureText, renderTextColor(level, baseHue)]}>Flirty</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    marginBottom: 10,
    maxHeight: 500, // Maximum height for the component
  },
  horizontal: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1, // Maintain aspect ratio
    maxWidth: "30%",
    alignSelf: "stretch", // Ensures the image stretches with content height
    paddingRight: 10, // Adds some space between image and text
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain", // Resizes image to contain within the bounds
  },
  imageHorizontal: {
    width: "100%",
    height: undefined, // Let height scale with aspect ratio
    aspectRatio: 1, // Maintain aspect ratio
  },
  imageVertical: {
    width: "100%",
    height: undefined, // Let height scale with aspect ratio
    aspectRatio: 1, // Maintain aspect ratio
  },
  cardArea: {
    flex: 2, // Takes up more space than the image
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
  },
  cardAreaHorizontal: {
    width: "70%",
  },
  cardAreaVertical: {
    width: "100%",
  },
  title: {
    marginBottom: 8,
    color: "rgba(13,26,38,1)",
    fontSize: 20,
    lineHeight: 25, // 125% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  ratings: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingImage: {
    width: 100,
    height: 20,
    marginRight: 8,
  },
  ratingText: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 22, // 138% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  tags: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
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
  infoText: {
    marginBottom: 8,
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  quote: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quoteIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  quoteText: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(13,26,38,0.1)",
    marginVertical: 8,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  featureText: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
})

export default SummaryView
