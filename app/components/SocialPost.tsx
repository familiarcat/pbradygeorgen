import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function SocialPost() {
  return (
    <View style={styles.socialPost}>
      <Text>SocialPost</Text>

      <View style={styles.body}>
        <View style={styles.text}>
          <View style={styles.headline}>
            <Text style={styles.newAmplifyStudioGive}>
              New Amplify Studio gives designers the ability to export UI to React code
            </Text>
            <View style={styles.frame}>
              <Text style={styles.nikhilS}>Nikhil S</Text>
              <Text style={styles._2ndDecember2021}>2nd December 2021</Text>
            </View>
          </View>
          <View style={styles.article}>
            <Image
              style={styles.myIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6860?alt=media&token=485b4e61-45e1-416a-aedd-642ac3381ee2",
              }}
            />
            <Text style={styles.awsAmplifyStudioIsAV}>
              AWS Amplify Studio is a visual development environment for building full-stack web and
              mobile apps that grows with your business. Studio builds on existing backend building
              capabilities in AWS Amplify, allowing you to build your UI faster with a set of
              ready-to-use UI components that are editable in Figma. With Studio, you can quickly
              build an entire web app, front-to-back, with minimal coding, while still maintaining
              full control over your app design and behavior through code. Ship faster, scale
              effortlessly, and delight every user.
            </Text>
          </View>
          <View style={styles.share1}>
            <Text style={styles.share}>Share</Text>
            <Image
              style={styles.myIcon1}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6864?alt=media&token=211ef206-859b-4b08-9560-9aca01ca0c99",
              }}
            />
            <Image
              style={styles.myIcon2}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6865?alt=media&token=45a5d50d-763d-46d9-8647-b078fe3822f0",
              }}
            />
            <Image
              style={styles.myIcon3}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6866?alt=media&token=82aeb670-1d67-4ef2-9427-433f690b0cad",
              }}
            />
          </View>
        </View>
        <Image
          style={styles.image}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6867?alt=media&token=1e473633-f1d2-417c-9c43-f31fab256b72",
          }}
        />
      </View>
      <View style={styles.readMore1}>
        <Image
          style={styles.myIcon4}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/27ebndh2kg6-2976%3A6869?alt=media&token=60485ca6-6257-4847-b299-2ca7b63d1c27",
          }}
        />
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  socialPost: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 960,
    height: 377,
    padding: 24,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  body: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginRight: 16,
  },
  text: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 712,
    marginRight: 40,
  },
  headline: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginRight: 16,
  },
  newAmplifyStudioGive: {
    marginRight: 16,
    color: "rgba(13,26,38,1)",
    fontSize: 20,
    lineHeight: 25, // 125% of 20px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  frame: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  nikhilS: {
    marginRight: 16,
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  _2ndDecember2021: {
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  article: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginRight: 16,
  },
  myIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  awsAmplifyStudioIsAV: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
  },
  share1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  share: {
    marginRight: 16,
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  myIcon1: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  myIcon2: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  myIcon3: {
    width: 24,
    height: 24,
  },
  image: {
    width: 160,
    height: 160,
  },
  readMore1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  myIcon4: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  readMore: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
    textDecorationLine: "underline",
  },
})
