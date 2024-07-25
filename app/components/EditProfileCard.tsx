import React from "react"
import { StyleSheet, Image, Text, View } from "react-native"

export default function Editprofile() {
  return (
    <View style={styles.editProfile}>
      <Text>Editprofile</Text>

      <View style={styles.content}>
        <View style={styles.editProfileHeader}>
          <Image
            style={styles.icon}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/jgl4la4j3ih-3866%3A1225?alt=media&token=42f90864-cc29-4f60-9c66-537714d56d3c",
            }}
          />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </View>
        <View style={styles.profile}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/jgl4la4j3ih-2976%3A6919?alt=media&token=1ea8b1db-0325-42df-8829-278c4eb73dbc",
            }}
          />
          <Text style={styles.uploadNewImage}>Upload New Image</Text>
        </View>
        <View style={styles.forms}>
          <View style={styles.textField}>
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputGroup}>
              <View style={styles.input}>
                <Text style={styles.placeholder}>John Doe</Text>
              </View>
            </View>
          </View>
          <View style={styles.textField}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputGroup}>
              <View style={styles.input}>
                <Text style={styles.placeholder}>Seattle, WA</Text>
              </View>
            </View>
          </View>
          <View style={styles.textField}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputGroup}>
              <View style={styles.input}>
                <Text style={styles.placeholder}>john.doe@awsamplify.com</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonLabel}>Save</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  editProfile: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 640,
    height: 528,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
  },
  content: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: 24,
  },
  editProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  editProfileText: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 20, // 125% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48, // to make the image circular
    marginRight: 16,
  },
  uploadNewImage: {
    color: "rgba(13,26,38,1)",
    fontSize: 16,
    lineHeight: 22, // 138% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  forms: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 16,
  },
  textField: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "rgba(48,64,80,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: "column",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 7,
    borderWidth: 1,
    borderColor: "rgba(174,179,183,1)",
    borderRadius: 4,
  },
  placeholder: {
    color: "rgba(128,128,128,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "400",
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
  buttonLabel: {
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    lineHeight: 24, // 150% of 16px
    fontFamily: "Inter",
    fontWeight: "700",
  },
})
