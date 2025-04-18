// DataContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DataStore } from "@aws-amplify/datastore"
import {
  Resume,
  Summary,
  Skill,
  Education,
  Experience,
  ContactInformation,
  Reference,
  School,
  Degree,
  Company,
  Engagement,
  Accomplishment,
} from "../models"
import { createMockData } from "app/mock/mockData"
import { StyleSheet, useWindowDimensions } from "react-native"
import { useAmplify } from "./AmplifyProvider"

// Define TypeScript interfaces for your models

interface SummaryType {
  id: string
  goals?: string | null
  persona?: string | null
}

interface SkillType {
  id: string
  title?: string | null
  resumeID?: string | null
}

interface EducationType {
  id: string
  summary?: string | null
}

interface ExperienceType {
  id: string
  title?: string | null
  text?: string | null
}

interface ContactInformationType {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
}

interface ReferenceType {
  id: string
  name?: string | null
  phone?: string | null
  email?: string | null
  contactinformationID?: string | null
}

interface SchoolType {
  id: string
  name?: string | null
  educationID?: string | null
}

interface DegreeType {
  id: string
  major?: string | null
  startYear?: string | null
  endYear?: string | null
  schoolID?: string | null
}

interface CompanyType {
  id: string
  name?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
  title?: string | null
  experienceID?: string | null
}

interface EngagementType {
  id: string
  client?: string | null
  startDate?: string | null
  endDate?: string | null
  companyID?: string | null
}

interface AccomplishmentType {
  id: string
  title?: string | null
  description?: string | null
  engagementID?: string | null
  companyID?: string | null
}

// ExpandedResume type adjusted for potential undefined values
type ExpandedResume = {
  id: string
  title?: string | null // Ensure it's explicitly optional if your data might not include it
  Summary: SummaryType | null
  Skills: SkillType[]
  Education: EducationType | null
  Schools: SchoolType[]
  Degrees: DegreeType[]
  Experience: ExperienceType | null
  Companies: CompanyType[]
  Engagements: EngagementType[]
  Accomplishments: AccomplishmentType[]
  ContactInformation: ContactInformationType | null
  References: ReferenceType[]
}

// Example of using ExpandedResume within the DataContext
interface DataContextType {
  resumes: ExpandedResume[]
  getBaseHueForResume: (index: number) => number
  renderIndentation: (level: number) => { paddingLeft: number }
  renderTextColor: (level: number, baseHue: number) => { color: string; backgroundColor: string }
  dynamicStyles: any
  isLoading: boolean
  syncStatus: string
  networkStatus: string
  resetWithMockData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [resumes, setResumes] = useState<ExpandedResume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // Track loading and sync states for UI feedback
  const [syncStatus] = useState('initializing')
  const [networkStatus, setNetworkStatus] = useState('unknown')
  const { width: screenWidth } = useWindowDimensions()

  // Get Amplify context
  const { dataStoreReady, networkStatus: amplifyNetworkStatus, clearDataStore: amplifyDataStoreClear } = useAmplify();

  // Initialize data when DataStore is ready
  useEffect(() => {
    if (dataStoreReady) {
      console.log('DataStore is ready, checking for existing data...');
      const checkForData = async () => {
        try {
          // Check if we need to create mock data
          const resumeCount = await DataStore.query(Resume, (r: any) => r, { limit: 1 })
          console.log(`Found ${resumeCount.length} resumes during initialization`)

          if (resumeCount.length === 0) {
            console.log('No resumes found during initialization, creating mock data...')
            try {
              // Stop sync before creating mock data
              await stopDataStoreSync()

              // Clear DataStore
              await clearDataStore()

              // Create mock data
              await createMockData()
              console.log('Mock data creation completed during initialization')

              // Restart sync
              await startDataStoreSync()

              // Fetch the new data
              await fetchDataWithoutAutoCreate()
            } catch (error) {
              console.error('Error creating initial mock data:', error)
            }
          } else {
            // Data exists, fetch it
            await fetchData()
          }
        } catch (error) {
          console.error('Error checking for data:', error)
        }
      };

      checkForData();
    }
  }, [dataStoreReady])

  // Update network status when it changes in AmplifyProvider
  useEffect(() => {
    setNetworkStatus(amplifyNetworkStatus);
  }, [amplifyNetworkStatus])
  // Fetch data from DataStore after a short delay to ensure DataStore is initialized
  useEffect(() => {
    const fetchDataAfterDelay = async () => {
      try {
        // Wait a moment to ensure DataStore is fully initialized
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Initial data fetch starting...')
        await fetchData()
        console.log('Initial data fetch completed')
      } catch (error) {
        console.error('Error in initial data fetch:', error)
      }
    }

    fetchDataAfterDelay()

    // Subscribe to changes in Resume model
    const subscription = DataStore.observe(Resume).subscribe(() => {
      console.log('Resume model changed, refreshing data')
      fetchData()
    })

    return () => subscription.unsubscribe()
  }, [])

  // Function to clear DataStore
  const clearDataStore = async () => {
    try {
      console.log('Clearing DataStore')
      await amplifyDataStoreClear()
      console.log('DataStore cleared')
    } catch (error) {
      console.error('Error clearing DataStore:', error)
    }
  }

  // Function to stop DataStore sync
  const stopDataStoreSync = async () => {
    try {
      console.log('Stopping DataStore sync')
      await DataStore.stop()
      console.log('DataStore sync stopped')
    } catch (error) {
      console.error('Error stopping DataStore sync:', error)
    }
  }

  // Function to start DataStore sync
  const startDataStoreSync = async () => {
    try {
      console.log('Starting DataStore sync')
      await DataStore.start()
      console.log('DataStore sync started')
    } catch (error) {
      console.error('Error starting DataStore sync:', error)
    }
  }

  // Function to fetch data without auto-creating mock data
  const fetchDataWithoutAutoCreate = async () => {
    setIsLoading(true)
    try {
      // Fetch all resumes
      console.log("Fetching resumes from DataStore without auto-create")
      const resumeData = await DataStore.query(Resume)
      console.log(`Found ${resumeData.length} resumes in DataStore`)

      if (!resumeData || resumeData.length === 0) {
        console.warn("No resumes found during fetch without auto-create")
        setIsLoading(false)
        return
      }

      // Fetch related data for each resume
      const expandedResumes = await fetchExpandedResumes(resumeData)
      setResumes(expandedResumes)
      console.log(`Set ${expandedResumes.length} expanded resumes in state (without auto-create)`)
    } catch (error) {
      console.error("Error fetching resumes without auto-create:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch expanded resumes
  const fetchExpandedResumes = async (resumeData: Resume[]) => {
    return Promise.all(
      resumeData.map(async (resume) => {
        const summary = resume.resumeSummaryId
          ? await DataStore.query(Summary, resume.resumeSummaryId).then((res: any) => res || null)
          : null

        const skills = resume.id
          ? await DataStore.query(Skill, (s: any) => s.resumeID.eq(resume.id)).catch(() => [])
          : []

        const education = resume.resumeEducationId
          ? await DataStore.query(Education, resume.resumeEducationId).then(
              (res: any) => res || null,
            )
          : null

        const schools = education
          ? await DataStore.query(School, (s: any) => s.educationID.eq(education.id)).catch(() => [])
          : []

        const degrees = await Promise.all(
          schools.map((school: any) =>
            DataStore.query(Degree, (d: any) => d.schoolID.eq(school.id)).catch(() => []),
          ),
        ).then((results) => results.flat())

        const experience = resume.resumeExperienceId
          ? await DataStore.query(Experience, resume.resumeExperienceId).then(
              (res: any) => res || null,
            )
          : null

        const companies = experience
          ? await DataStore.query(Company, (c: any) => c.experienceID.eq(experience.id)).catch(
              () => [],
            )
          : []

        const engagements = await Promise.all(
          companies.map((company: any) =>
            DataStore.query(Engagement, (e: any) => e.companyID.eq(company.id)).catch(() => []),
          ),
        ).then((results) => results.flat())

        const accomplishments = await Promise.all(
          engagements.map((engagement: any) =>
            DataStore.query(Accomplishment, (a: any) => a.engagementID.eq(engagement.id)).catch(
              () => [],
            ),
          ),
        ).then((results) => results.flat())

        const contactInfo = resume.resumeContactInformationId
          ? await DataStore.query(ContactInformation, resume.resumeContactInformationId).then(
              (res: any) => res || null,
            )
          : null

        const references = contactInfo
          ? await DataStore.query(Reference, (r: any) =>
              r.contactinformationID.eq(contactInfo.id),
            ).catch(() => [])
          : []

        return {
          id: resume.id,
          title: resume.title,
          Summary: summary,
          Skills: skills,
          Education: education,
          Schools: schools,
          Degrees: degrees,
          Experience: experience,
          Companies: companies,
          Engagements: engagements,
          Accomplishments: accomplishments,
          ContactInformation: contactInfo,
          References: references,
        }
      }),
    )
  }

  // Function to fetch data from DataStore
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch all resumes
      console.log("Fetching resumes from DataStore")
      const resumeData = await DataStore.query(Resume)
      console.log(`Found ${resumeData.length} resumes in DataStore`)

      if (!resumeData || resumeData.length === 0) {
        console.warn("No resumes found, creating mock data...")

        // Stop sync before creating mock data
        await stopDataStoreSync()

        // Clear DataStore
        await clearDataStore()

        // Create mock data
        await createMockData()
          .then(() => console.log("Mock data creation completed"))
          .catch(console.error)

        // Restart sync
        await startDataStoreSync()

        // Query again after creating mock data
        const newResumeData = await DataStore.query(Resume)
        console.log(`After creating mock data, found ${newResumeData.length} resumes`)

        if (!newResumeData || newResumeData.length === 0) {
          console.error("Still no resumes found after creating mock data")
          setIsLoading(false)
          return
        }

        // Continue with the new data
        return fetchData() // Recursively call fetchData with the new data
      }

        // Fetch related data for each resume
        const expandedResumes = await fetchExpandedResumes(resumeData)

        setResumes(expandedResumes)
        console.log(`Set ${expandedResumes.length} expanded resumes in state`)
      } catch (error) {
        console.error("Error fetching resumes:", error)
      } finally {
        setIsLoading(false)
      }
    }

  // Define a base hue for each resume
  const getBaseHueForResume = (index: number) => {
    return (index * 90) % 360 // Cycle through different hues for each resume
  }

  // Generate color based on level and parent hue
  const getColorForLevel = (level: number, baseHue: number, offset: number = 30) => {
    const hue = (baseHue + offset * level) % 360 // Change hue for each level
    const saturation = Math.max(30, 70 - level * 10) // Decrease saturation for each level
    const lightness = Math.max(20, 50 - level * 5) // Decrease lightness for each level
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const getBackgroundColorForLevel = (level: number, baseHue: number, offset: number = 30) => {
    const hue = (baseHue + offset * level) % 360 // Change hue for each level
    const saturation = Math.max(30, 70 - level * 10) // Decrease saturation for each level
    const lightness = Math.max(80, 95 - level * 5) // Lighter background for each level
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const renderIndentation = (level: any) => ({
    paddingLeft : level * 15,
    width: "100%",
  })

  const renderTextColor = (level: number, baseHue: number) => ({
    color: getColorForLevel(level, baseHue),
    backgroundColor: getBackgroundColorForLevel(level, baseHue),
  })

  const dynamicStyles = getDynamicStyles(screenWidth)

  // Function to reset data with mock data
  const resetWithMockData = async () => {
    setIsLoading(true)
    try {
      // Stop sync before resetting data
      await stopDataStoreSync()

      // Clear DataStore
      await clearDataStore()
      console.log('DataStore cleared')

      // Create new mock data
      await createMockData()
      console.log('Mock data created')

      // Restart sync
      await startDataStoreSync()

      // Fetch the new data
      await fetchData()
    } catch (error) {
      console.error('Error resetting data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DataContext.Provider
      value={{
        resumes,
        getBaseHueForResume,
        renderIndentation,
        renderTextColor,
        dynamicStyles,
        isLoading,
        syncStatus,
        networkStatus,
        resetWithMockData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

function getDynamicStyles(screenWidth: number) {
  const baseFontSize = screenWidth < 780 ? 14 : screenWidth < 980 ? 16 : 18
  return StyleSheet.create({
    container: {
      flexDirection: screenWidth < 780 ? "column" : "row",
    },
    text: {
      fontSize: baseFontSize,
      lineHeight: baseFontSize * 1.5,
    },
    headingText: {
      fontSize: baseFontSize * 1.5,
      lineHeight: baseFontSize * 1.5,
    },
  })
}
