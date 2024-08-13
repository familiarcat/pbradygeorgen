// SummaryView.tsx
import React from "react"
import { StyleSheet, Image, Text, View, useWindowDimensions } from "react-native"
import { ExpandedResume } from "../../types" // Import the type for Resume

interface SummaryViewProps {
  resume: ExpandedResume // Define the prop type
  baseHue?: number // Optional base hue for styling
}

const SummaryView: React.FC<SummaryViewProps> = ({ resume, baseHue = 0 }) => {
  const { renderIndentation, renderTextColor } = useDataContext() // Access context for rendering styles
  const { width: screenWidth } = useWindowDimensions()
  const isVertical = screenWidth <= 640 // Use 640px as the breakpoint

  const level = 2 // Define the hierarchy level for this component

  return (
    <View style={[styles.productCard, isVertical ? styles.vertical : styles.horizontal]}>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, isVertical ? styles.imageVertical : styles.imageHorizontal]}
          source={{
            uri: resume.Summary?.imageUri || "https://example.com/default-image.jpg",
          }}
        />
      </View>

      <View
        style={[styles.cardArea, isVertical ? styles.cardAreaVertical : styles.cardAreaHorizontal]}
      >
        <Text style={[styles.title, renderTextColor(level, baseHue)]}>
          {resume.title || "Default Title"}
        </Text>
        <View style={styles.ratings}>
          <Image
            style={styles.ratingImage}
            source={{
              uri: "https://example.com/rating-image.jpg",
            }}
          />
          <Text style={[styles.ratingText, renderTextColor(level, baseHue)]}>
            {resume.Summary?.rating || "N/A"}
          </Text>
        </View>
        <View style={styles.tags}>
          {resume.Summary?.tags?.map((tag, index) => (
            <View key={index} style={styles.badge}>
              <Text style={[styles.badgeLabel, renderTextColor(level, baseHue)]}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.infoText, renderTextColor(level, baseHue)]}>
          {resume.Summary?.info || "Information about this product."}
        </Text>
        <View style={styles.quote}>
          <Image
            style={styles.quoteIcon}
            source={{
              uri: "https://example.com/quote-icon.jpg",
            }}
          />
          <Text style={[styles.quoteText, renderTextColor(level, baseHue)]}>
            {resume.Summary?.quote || "This is a quote."}
          </Text>
        </View>
        <Image
          style={styles.divider}
          source={{
            uri: "https://example.com/divider.jpg",
          }}
        />
        <View style={styles.features}>
          {resume.Summary?.features?.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Image
                style={styles.featureIcon}
                source={{
                  uri: "https://example.com/feature-icon.jpg",
                }}
              />
              <Text style={[styles.featureText, renderTextColor(level, baseHue)]}>{feature}</Text>
            </View>
          ))}
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
