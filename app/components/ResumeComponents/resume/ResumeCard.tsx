import React from "react"
import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native"
import { ExpandedResume, SkillType } from "../../types" // Import the type for Resume
import SummaryCardsContainer from "./summary/SummaryCardsContainer"
import ReferenceItemCard from "./summary/reference/ReferenceItemCard"
import ContactInformationCard from "./ContactInformationCard"
import { DataProvider, useDataContext } from "../../DataContext" // Import the context and provider

interface SummaryViewProps {
  resume: ExpandedResume
  baseHue?: number // Optional base hue for styling
}

const ResumeCard: React.FC<SummaryViewProps> = ({ resume, baseHue = 0 }) => {
  const { width: screenWidth } = useWindowDimensions()
  const { getBaseHueForResume, renderIndentation, renderTextColor, dynamicStyles } =
    useDataContext()

  return (
    <View style={[styles.productCard, dynamicStyles.container]}>
      <View style={[styles.imageContainer]}>
        {/* {resume.ContactInformation && <ReferenceItemCard reference={resume.ContactInformation} />} */}
        {/* <Text style={[styles.title, renderTextColor(1, baseHue), dynamicStyles.text]}>
          {resume?.ContactInformation?.name}
        </Text> */}
        <ContactInformationCard
          id={resume?.ContactInformation?.id ?? ""}
          name={resume?.ContactInformation?.name}
          email={resume?.ContactInformation?.email}
          phone={resume?.ContactInformation?.phone}
        />
        <Image
          style={styles.image}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
          }}
        />
      </View>
      <View style={[styles.textContainer, { maxWidth: "100%" }]}>
        <Text
          style={[
            styles.title,
            renderTextColor(5, getBaseHueForResume(5)),
            dynamicStyles.headingText,
            { marginLeft: -15 },
          ]}
        >
          {resume?.title}
        </Text>
        <View style={styles.ratings}>
          <Text
            style={[
              styles.ratingText,
              renderTextColor(4, getBaseHueForResume(2)),
              dynamicStyles.text,
            ]}
          >
            Goals: {resume.Summary?.goals}
          </Text>
        </View>
        <View style={styles.ratings}>
          <Text
            style={[
              styles.ratingText,
              renderTextColor(4, getBaseHueForResume(5)),
              dynamicStyles.text,
            ]}
          >
            Persona: {resume.Summary?.persona}
          </Text>
        </View>
        <Text style={[styles.title, renderTextColor(4, getBaseHueForResume(5))]}>Skills</Text>
        {/* Skills list */}
        <View style={styles.tags}>
          {resume.Skills.map((skill: SkillType) => (
            <View style={styles.badge} key={skill.id}>
              <Text style={[renderTextColor(2, getBaseHueForResume(3))]}>{skill.title}</Text>
            </View>
          ))}
        </View>
        <View style={styles.quote}>
          <Text
            style={[
              styles.quoteText,
              renderTextColor(4, getBaseHueForResume(5)),
              dynamicStyles.text,
            ]}
          >
            “This is a quote.“
          </Text>
        </View>
        <SummaryCardsContainer resume={resume} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    marginBottom: 10,
    flexWrap: "nowrap",
  },
  imageContainer: {
    width: "33.33%",
    maxWidth: "33.33%",
    alignItems: "flex-start",
    resizeMode: "cover",
    padding: 0,
  },
  image: {
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 10,
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 5,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
  },
  title: {
    marginBottom: 8,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "800",
  },
  ratings: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 68,
    lineHeight: 22,
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
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(239,240,240,1)",
  },
  badgeLabel: {
    fontWeight: "500",
  },
  infoText: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
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
    letterSpacing: 0.16,
    fontStyle: "italic",
  },
})

export default ResumeCard
