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
import { Experience, Company } from "../../models"
import { ResumeWizardNavigatorScreenProps } from "app/navigators/ResumeWizardNavigator"
import { Predicates } from "@aws-amplify/datastore"

type ExperienceScreenProps = ResumeWizardNavigatorScreenProps<"Experience">

export const ExperienceScreen: React.FC<ExperienceScreenProps> = ({ navigation }) => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [companies, setCompanies] = useState<Record<string, Company[]>>({}) // Store companies related to each experience
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  // Fetch experiences and associated companies
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const experiences = await DataStore.query(Experience)
        setExperiences(experiences)

        // Fetch associated companies for each experience
        const companiesMap: Record<string, Company[]> = {}
        for (const experience of experiences) {
          const experienceCompanies = await DataStore.query(Company, (c) =>
            c.experienceID.eq(experience.id),
          )
          companiesMap[experience.id] = experienceCompanies
        }
        setCompanies(companiesMap)
      } catch (error) {
        console.error("Error fetching Experiences or Companies:", error)
      }
    }

    fetchExperiences()
  }, [])

  // Create a new experience with default fields
  const createExperience = async () => {
    try {
      const newExperience = await DataStore.save(
        new Experience({
          title: "New Experience",
          text: "Experience details go here",
          gptResponse: "",
        }),
      )
      setExperiences([...experiences, newExperience])
      navigation.navigate("Summary")
    } catch (error) {
      console.error("Error creating Experience:", error)
    }
  }

  // Delete an experience
  const handleDeleteExperience = async (experience: Experience) => {
    try {
      await DataStore.delete(experience)
      setExperiences(experiences.filter((exp) => exp.id !== experience.id))
    } catch (error) {
      console.error("Error deleting Experience:", error)
    }
  }

  // Hide the Snackbar
  const hideSnackbar = () => setSnackbarVisible(false)

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title="Experience" />
        </Appbar.Header>
        <ScrollView>
          <FlatList
            data={experiences}
            keyExtractor={(experience) => experience.id}
            renderItem={({ item }) => (
              <Card style={{ margin: 10 }}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Button mode="contained" onPress={() => navigation.navigate("Summary")}>
                    Edit
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleDeleteExperience(item)}
                    style={{ marginTop: 10 }}
                  >
                    Delete
                  </Button>

                  {/* Render associated companies */}
                  {companies[item.id]?.map((company) => (
                    <Card key={company.id} style={{ marginTop: 10 }}>
                      <Card.Content>
                        <Title>Company: {company.name}</Title>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Content>
              </Card>
            )}
          />
          <Button mode="contained" onPress={createExperience} style={{ marginTop: 20 }}>
            Add New Experience
          </Button>
        </ScrollView>
        <Snackbar visible={snackbarVisible} onDismiss={hideSnackbar}>
          Experience saved successfully!
        </Snackbar>
      </View>
    </PaperProvider>
  )
}
