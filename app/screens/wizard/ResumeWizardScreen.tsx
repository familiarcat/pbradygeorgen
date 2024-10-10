// ResumeWizardScreen.tsx
import React, { useState, useEffect } from "react"
import { ScrollView, FlatList, View } from "react-native"
import {
  Appbar,
  Card,
  Button,
  Snackbar,
  Provider as PaperProvider,
  Title,
} from "react-native-paper"
import { DataStore } from "@aws-amplify/datastore"
import { Resume } from "../../models"
import { ResumeWizardNavigatorScreenProps } from "../../navigators/ResumeWizardNavigator"

type ResumeWizardScreenProps = ResumeWizardNavigatorScreenProps<"ResumeWizard">

export const ResumeWizardScreen: React.FC<ResumeWizardScreenProps> = ({ navigation }) => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const newResumes = await DataStore.query(Resume)
        setResumes(newResumes)
      } catch (error) {
        console.error("Error fetching Resumes:", error)
      }
    }

    fetchResumes()
  }, [])

  const createResume = async () => {
    try {
      const newResume = await DataStore.save(new Resume({ title: "My Resume" }))
      setResumes([...resumes, newResume])
      navigation.navigate("ContactInformation")
    } catch (error) {
      console.error("Error creating Resume:", error)
    }
  }

  const handleDeleteResume = async (resume: Resume) => {
    try {
      await DataStore.delete(resume)
      setResumes(resumes.filter((r) => r.id !== resume.id))
    } catch (error) {
      console.error("Error deleting Resume:", error)
    }
  }

  const hideSnackbar = () => setSnackbarVisible(false)

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title="Resume Wizard" />
        </Appbar.Header>
        <ScrollView>
          <FlatList
            data={resumes}
            keyExtractor={(resume) => resume.id}
            renderItem={({ item }) => (
              <Card style={{ margin: 10 }}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate("ContactInformation")}
                  >
                    Edit
                  </Button>
                  <Button mode="contained" onPress={() => handleDeleteResume(item)}>
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            )}
          />
          <Button mode="contained" onPress={createResume}>
            Create New Resume
          </Button>
        </ScrollView>
        <Snackbar visible={snackbarVisible} onDismiss={hideSnackbar}>
          Resume saved successfully!
        </Snackbar>
      </View>
    </PaperProvider>
  )
}
