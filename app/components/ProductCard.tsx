import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Productcard() {
  return (
    <View style={styles.productCard}>
      <Image
        style={styles.image}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
        }}
      />
      <View style={styles.cardArea}>
        <Text style={styles.title}>Classic Long Sleeve T-Shirt</Text>
        <View style={styles.ratings}>
          <Image
            style={styles.ratingImage}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
            }}
          />
          <Text style={styles.ratingText}>72</Text>
        </View>
        <View style={styles.tags}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>New</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Classic</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Modern</Text>
          </View>
        </View>
        <Text style={styles.infoText}>Information about this product.</Text>
        <View style={styles.quote}>
          <Image
            style={styles.quoteIcon}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
            }}
          />
          <Text style={styles.quoteText}>“This is a quote.“</Text>
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
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.feature}>
            <Image
              style={styles.featureIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/upx5opbp7ll-1%3A2359?alt=media&token=10ae8444-de47-4a6d-a200-ae1020592b1c",
              }}
            />
            <Text style={styles.featureText}>Fun</Text>
          </View>
          <View style={styles.feature}>
            <Image
              style={styles.featureIcon}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/u8rrnye9gf-2976%3A6822?alt=media&token=f98c3286-3145-4770-b141-95ecdce280b7",
              }}
            />
            <Text style={styles.featureText}>Flirty</Text>
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
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    width: "33%",
    height: "100%",
    borderRadius: 8,
  },
  cardArea: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "66%",
    padding: 16,
    backgroundColor: "rgba(255,255,255,1)",
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
    width: 212,
    height: 24,
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
