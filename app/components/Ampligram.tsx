import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Ampligram() {
  return (
    <View style={styles.ampligram}>
      <Text>Ampligram</Text>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Image
            style={styles.image}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dmi8blwjzb-2976%3A6764?alt=media&token=2af00403-b3fb-4e61-8162-7ef4c17a37a6",
            }}
          />
          <Text style={styles.reneBrandel}>Rene Brandel</Text>
        </View>
        <Image
          style={styles.overflow}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dmi8blwjzb-2976%3A6766?alt=media&token=00afd2ee-dbac-4fab-9344-61f5b209b6e5",
          }}
        />
      </View>
      <Image
        style={styles.image1}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dmi8blwjzb-2976%3A6769?alt=media&token=b24f30ac-48ee-4545-aa04-4c538ebbb506",
        }}
      />
      <Image
        style={styles.options}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dmi8blwjzb-2976%3A6770?alt=media&token=583fc575-fa17-42bc-81b6-d87e9932f33a",
        }}
      />
      <View style={styles.body}>
        <View style={styles.area}>
          <Text style={styles.firstnameLastname}>Firstname Lastname</Text>
          <Text style={styles.loremIpsumDolorSitAm}>
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore.”
          </Text>
          <Text style={styles.timestamp}>Timestamp</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ampligram: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: 640,
    height: 725,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 16,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 568,
    marginRight: 16,
  },
  image: {
    width: 65,
    height: 65,
    marginRight: 16,
    borderRadius: 32.5, // To make the image circular
  },
  reneBrandel: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  overflow: {
    width: 24,
    height: 24,
  },
  image1: {
    width: "100%",
    height: 408,
  },
  options: {
    width: "100%",
    height: 56,
  },
  body: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  area: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 16,
  },
  firstnameLastname: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  loremIpsumDolorSitAm: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  timestamp: {
    color: "rgba(92,102,112,1)",
    fontSize: 14,
    lineHeight: 24, // 171% of 14px
    fontFamily: "Inter",
    fontWeight: "400",
  },
})
