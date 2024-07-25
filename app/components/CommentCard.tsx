import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Commentcard() {
  return (
    <View style={styles.commentCard}>
      <Text>Commentcard</Text>
      <View style={styles.liked}>
        <View style={styles.userLiked}>
          <Image
            style={styles.myIcon}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6875?alt=media&token=00f637d1-8391-4ebe-b736-46052365714d",
            }}
          />
          <Text style={styles.dannyLikedThis}>Danny liked this</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Image
          style={styles.image}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6878?alt=media&token=4741abc9-363e-4469-a86f-993880fb27c5",
          }}
        />
        <View style={styles.frame3}>
          <View style={styles.frame2}>
            <View style={styles.frame}>
              <Text style={styles.scott}>Scott</Text>
            </View>
            <Image
              style={styles.frame1}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6885?alt=media&token=f0b14384-5308-45cc-8c30-8a636a24bcf4",
              }}
            />
          </View>
          <Text style={styles.loremIpsumDolorSitAm}>
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit.”
          </Text>
        </View>
      </View>
      <View style={styles.share1}>
        <View style={styles.share}>
          <Image
            style={styles.myIcon1}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6890?alt=media&token=24559302-bb49-4f5a-99ef-416fa63b471d",
            }}
          />
          <Text style={styles._99}>99</Text>
        </View>
        <View style={styles.repost}>
          <Image
            style={styles.myIcon2}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6893?alt=media&token=ae8aeacf-90a9-4787-81fa-b1b40f15e5ba",
            }}
          />
          <Text style={styles._991}>99</Text>
        </View>
        <View style={styles.like}>
          <Image
            style={styles.myIcon3}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6896?alt=media&token=5e4e66ff-73dc-4a9d-a6d9-6ee6ec50ee21",
            }}
          />
          <Text style={styles._992}>99</Text>
        </View>
        <Image
          style={styles.myIcon4}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/8mmnu7wxtvp-2976%3A6898?alt=media&token=02f3ddd5-4467-430a-8d9f-aa8d458b1730",
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  commentCard: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 479,
    height: 192,
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  liked: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 8,
  },
  userLiked: {
    flexDirection: "row",
    alignItems: "center",
  },
  myIcon: {
    width: 24,
    height: 24,
    marginRight: 9,
  },
  dannyLikedThis: {
    color: "rgba(92,102,112,1)",
    fontSize: 14,
    lineHeight: 24, // 171% of 14px
    fontFamily: "Inter",
    fontWeight: "400",
  },
  body: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  frame3: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  frame2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  frame: {
    flexDirection: "row",
    alignItems: "center",
  },
  scott: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
    letterSpacing: 0.16,
  },
  frame1: {
    width: 24,
    height: 24,
  },
  loremIpsumDolorSitAm: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  share1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  share: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
  },
  myIcon1: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  _99: {
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  repost: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
  },
  myIcon2: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  _991: {
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  like: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
  },
  myIcon3: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  _992: {
    color: "rgba(92,102,112,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    letterSpacing: 0.16,
  },
  myIcon4: {
    width: 24,
    height: 24,
  },
})
