import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Profilecard() {
  return (
    <View style={styles.profileCard}>
      <Text>Profilecard</Text>

      <Image
        style={styles.image}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/odtnog2b7xg-2976%3A6900?alt=media&token=bfa5d928-c4aa-4a18-9666-759a4ac2aade",
        }}
      />
      <View style={styles.name}>
        <Text style={styles.melindaMarcus}>Melinda Marcus</Text>
        <Text style={styles.designEngineerAtCloth}>Design Engineer at Cloth Studios</Text>
      </View>
      <View style={styles.followers}>
        <Image
          style={styles.myIcon}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/odtnog2b7xg-2976%3A6905?alt=media&token=37812038-4566-492b-a478-d2d0105d0fbe",
          }}
        />
        <Text style={styles.followersCount}>99 Followers</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.label}>View Profile</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 302,
    height: 407,
    padding: 24,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 16,
    borderRadius: 80, // to make the image circular
  },
  name: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  melindaMarcus: {
    color: "rgba(13,26,38,1)",
    fontSize: 20,
    lineHeight: 25, // 125% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
    textAlign: "center",
  },
  designEngineerAtCloth: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.16,
  },
  followers: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  myIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  followersCount: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
    backgroundColor: "rgba(4,125,149,1)",
  },
  label: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    lineHeight: 30, // 150% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
})
