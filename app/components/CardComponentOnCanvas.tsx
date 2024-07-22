import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Card() {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
        }}
      />
      <View style={styles.body}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>How to write content about your photographs</Text>
          <Text style={styles.bodyText}>
            Aliquam ullamcorper sem vel erat scelerisque placerat. Curabitur maximus libero eget
            metus porttitor, nec venenatis leo aliquam. Praesent ultrices dolor ac maximus pulvinar.
            Mauris bibendum mauris eget ex imperdiet fringilla.
          </Text>
        </View>
        <View style={styles.footerActions}>
          <View style={styles.button}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonLabel}>Read</Text>
            </View>
          </View>
          <View style={styles.button}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonLabel}>Share</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 350,
    height: 530.5,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,1)",
  },
  image: {
    width: "100%",
    height: 262.5,
  },
  body: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 24,
    backgroundColor: "rgba(255,255,255,1)",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginRight: 24,
  },
  headingText: {
    marginRight: 16,
    color: "rgba(0,0,0,1)",
    fontSize: 22,
    lineHeight: 28, // 130% of 22px
    fontFamily: "IBM Plex Serif",
    fontWeight: "600",
  },
  bodyText: {
    color: "rgba(107,114,128,1)",
    fontSize: 12,
    lineHeight: 18, // 150% of 12px
    fontFamily: "IBM Plex Serif",
    fontWeight: "400",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(20,184,166,1)",
    borderRadius: 4,
    backgroundColor: "rgba(20,184,166,1)",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
  },
  buttonLabel: {
    marginRight: 8,
    color: "rgba(255,255,255,1)",
    fontSize: 14,
    lineHeight: 14, // 100% of 14px
    fontFamily: "IBM Plex Sans",
    fontWeight: "600",
  },
})
