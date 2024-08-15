// SummaryView.tsx

import React from "react"
import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native"
import { ExpandedResume, SkillType } from "../../types" // Import the type for Resume
import ItemCard from "./ItemCard"

interface SummaryViewProps {
  resume: ExpandedResume // Define the prop type
  baseHue?: number // Optional base hue for styling
}

const SummaryView: React.FC<SummaryViewProps> = ({ resume, baseHue = 0 }) => {
  const { width: screenWidth } = useWindowDimensions()
  const isVertical = screenWidth <= 640 // Use 640px as the mobile breakpoint

  const level = 2 // Define the hierarchy level for this component

  const hasOneRelationships = extractHasOneRelationships(resume)

  return (
    <View style={[styles.productCard, isVertical ? styles.vertical : styles.horizontal]}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
          }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, renderTextColor(level, baseHue)]}>{resume?.title}</Text>
        <View style={styles.ratings}>
          <Text style={[styles.ratingText, renderTextColor(level, baseHue)]}>
            Goals: {resume.Summary?.goals}
          </Text>
        </View>
        <View style={styles.ratings}>
          <Text style={[styles.ratingText, renderTextColor(level, baseHue)]}>
            Persona: {resume.Summary?.persona}
          </Text>
        </View>
        <Text style={[styles.infoText, renderTextColor(level, baseHue)]}>Skills</Text>
        <View style={styles.tags}>
          {resume.Skills.map((skill: SkillType, index: number) => (
            <View style={styles.badge} key={skill.id}>
              <Text style={[styles.badgeLabel, renderTextColor(level, baseHue)]}>
                {skill.title}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.quote}>
          <Text style={[styles.quoteText, renderTextColor(level, baseHue)]}>
            “This is a quote.“
          </Text>
        </View>
        <View style={styles.features}>
          {/* Render ItemCards for each hasOne relationship */}
          {hasOneRelationships.map((relationship) => (
            <ItemCard key={relationship.id} resume={resume} name={relationship.name} />
          ))}
        </View>
      </View>
    </View>
  )
}

const extractHasOneRelationships = (resume: ExpandedResume) => {
  const relationships = []

  if (resume.Education) {
    relationships.push({
      id: resume.Education.id,
      name: "Education",
      model: resume.Education,
    })
  }

  if (resume.Experience) {
    relationships.push({
      id: resume.Experience.id,
      name: "Experience",
      model: resume.Experience,
    })
  }

  if (resume.ContactInformation) {
    relationships.push({
      id: resume.ContactInformation.id,
      name: "Contact Information",
      model: resume.ContactInformation,
    })
  }

  return relationships
}

const renderTextColor = (level: number, baseHue: number): object => {
  const hue = (baseHue + level * 30) % 360
  const saturation = 100
  const lightness = 30 // Ensuring text color is always dark enough

  return {
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  }
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
  },
  horizontal: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  imageContainer: {
    width: "33.33%", // Image container width is 1/3 of the overall width
    maxWidth: "33.33%", // Ensures that the image container never exceeds 1/3 of the total width
    alignItems: "flex-start",
  },
  image: {
    width: "100%", // The image takes up the full width of the container
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1, // The text container takes up the remaining space
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
    lineHeight: 25,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  ratings: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Inter",
    fontWeight: "400",
  },
  tags: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
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
    fontSize: 12,
    lineHeight: 12,
    fontFamily: "Inter",
    fontWeight: "600",
  },
  infoText: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  quote: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
})

export default SummaryView
