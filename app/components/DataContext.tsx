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
  const {
    dataStoreReady,
    networkStatus: amplifyNetworkStatus,
    syncStatus: amplifySyncStatus,
    clearDataStore: amplifyDataStoreClear,
    forceSync,
    initializeData
  } = useAmplify();

  // Initialize data when DataStore is ready
  useEffect(() => {
    if (dataStoreReady) {
      console.log('DataStore is ready, initializing data...');
      const loadData = async () => {
        try {
          // Initialize data if needed (this will create mock data if none exists)
          await initializeData().catch(error => {
            console.error('Error initializing data (caught):', error);
          });

          // Fetch data regardless of whether it was just created or already existed
          await fetchData().catch(error => {
            console.error('Error fetching data (caught):', error);
          });

          // Force sync to ensure data is up to date with the cloud
          await forceSync().catch(error => {
            console.error('Error forcing sync (caught):', error);
          });
          console.log('Data loading process completed');
        } catch (error) {
          console.error('Error in data loading process:', error);
          // Continue despite errors - the UI should still work
        }
      };

      loadData();
    } else {
      console.log('DataStore not ready yet, waiting...');
      // Set a timeout to force data loading after a certain period
      const timeoutId = setTimeout(() => {
        if (!dataStoreReady) {
          console.warn('DataStore still not ready after timeout, forcing data loading...');
          const forceLoadData = async () => {
            try {
              // Initialize data if needed (this will create mock data if none exists)
              await initializeData().catch(e => console.error('Forced initializeData error:', e));

              // Fetch data regardless of whether it was just created or already existed
              await fetchData().catch(e => console.error('Forced fetchData error:', e));
            } catch (error) {
              console.error('Error in forced data loading:', error);
            }
          };
          forceLoadData();
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [dataStoreReady, forceSync, initializeData])

  // Update status when it changes in AmplifyProvider
  useEffect(() => {
    setNetworkStatus(amplifyNetworkStatus);
    console.log(`Network status updated: ${amplifyNetworkStatus}`);
  }, [amplifyNetworkStatus])

  // Log sync status changes
  useEffect(() => {
    console.log(`Sync status updated: ${amplifySyncStatus}`);

    // If sync completed, refresh data
    if (amplifySyncStatus === 'fullSyncCompleted') {
      console.log('Full sync completed, refreshing data...');
      fetchData().catch(error => console.error('Error refreshing data after sync:', error));
    }
  }, [amplifySyncStatus])
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

  // Function to clear DataStore - delegate to AmplifyProvider
  const clearDataStore = async () => {
    try {
      console.log('Clearing DataStore')
      await amplifyDataStoreClear()
      console.log('DataStore cleared')
    } catch (error) {
      console.error('Error clearing DataStore:', error)
    }
  }

  // These functions are now handled by the DataStoreSync service via AmplifyProvider
  // Removed as they are no longer needed

  // This function is no longer needed as we're using the DataStoreSync service
  // to handle data initialization and synchronization

  // Function to fetch expanded resumes
  const fetchExpandedResumes = async (resumeData: Resume[]) => {
    return Promise.all(
      resumeData.map(async (resume) => {
        try {
          let summary = null;
          try {
            summary = resume.resumeSummaryId
              ? await DataStore.query(Summary, resume.resumeSummaryId).then((res: any) => res || null)
              : null;
          } catch (error) {
            console.warn(`Error fetching summary for resume ${resume.id}:`, error);
          }

          let skills: any[] = [];
          try {
            skills = resume.id
              ? await DataStore.query(Skill, (s: any) => s.resumeID.eq(resume.id)).catch(() => [])
              : [];
          } catch (error) {
            console.warn(`Error fetching skills for resume ${resume.id}:`, error);
          }

          let education = null;
          try {
            education = resume.resumeEducationId
              ? await DataStore.query(Education, resume.resumeEducationId).then(
                  (res: any) => res || null,
                )
              : null;
          } catch (error) {
            console.warn(`Error fetching education for resume ${resume.id}:`, error);
          }

          let schools: any[] = [];
          try {
            schools = education
              ? await DataStore.query(School, (s: any) => s.educationID.eq(education.id)).catch(() => [])
              : [];
          } catch (error) {
            console.warn(`Error fetching schools for resume ${resume.id}:`, error);
          }

          let degrees: any[] = [];
          try {
            degrees = await Promise.all(
              schools.map((school: any) =>
                DataStore.query(Degree, (d: any) => d.schoolID.eq(school.id)).catch(() => []),
              ),
            ).then((results) => results.flat());
          } catch (error) {
            console.warn(`Error fetching degrees for resume ${resume.id}:`, error);
          }

          let experience = null;
          try {
            experience = resume.resumeExperienceId
              ? await DataStore.query(Experience, resume.resumeExperienceId).then(
                  (res: any) => res || null,
                )
              : null;
          } catch (error) {
            console.warn(`Error fetching experience for resume ${resume.id}:`, error);
          }

          let companies: any[] = [];
          try {
            companies = experience
              ? await DataStore.query(Company, (c: any) => c.experienceID.eq(experience.id)).catch(
                  () => [],
                )
              : [];
          } catch (error) {
            console.warn(`Error fetching companies for resume ${resume.id}:`, error);
          }

          let engagements: any[] = [];
          try {
            engagements = await Promise.all(
              companies.map((company: any) =>
                DataStore.query(Engagement, (e: any) => e.companyID.eq(company.id)).catch(() => []),
              ),
            ).then((results) => results.flat());
          } catch (error) {
            console.warn(`Error fetching engagements for resume ${resume.id}:`, error);
          }

          let accomplishments: any[] = [];
          try {
            accomplishments = await Promise.all(
              engagements.map((engagement: any) =>
                DataStore.query(Accomplishment, (a: any) => a.engagementID.eq(engagement.id)).catch(
                  () => [],
                ),
              ),
            ).then((results) => results.flat());
          } catch (error) {
            console.warn(`Error fetching accomplishments for resume ${resume.id}:`, error);
          }

          let contactInfo = null;
          try {
            contactInfo = resume.resumeContactInformationId
              ? await DataStore.query(ContactInformation, resume.resumeContactInformationId).then(
                  (res: any) => res || null,
                )
              : null;
          } catch (error) {
            console.warn(`Error fetching contact info for resume ${resume.id}:`, error);
          }

          let references: any[] = [];
          try {
            references = contactInfo
              ? await DataStore.query(Reference, (r: any) =>
                  r.contactinformationID.eq(contactInfo.id),
                ).catch(() => [])
              : [];
          } catch (error) {
            console.warn(`Error fetching references for resume ${resume.id}:`, error);
          }

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
          };
        } catch (error) {
          console.error(`Error expanding resume ${resume.id}:`, error);
          // Return a minimal object with just the ID and title
          return {
            id: resume.id,
            title: resume.title || 'Unknown',
            Summary: null,
            Skills: [] as any[],
            Education: null,
            Schools: [] as any[],
            Degrees: [] as any[],
            Experience: null,
            Companies: [] as any[],
            Engagements: [] as any[],
            Accomplishments: [] as any[],
            ContactInformation: null,
            References: [] as any[],
          };
        }
      }),
    );
  }

  // Function to fetch data from DataStore
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch all resumes
      console.log("Fetching resumes from DataStore")
      let resumeData: Resume[] = []
      try {
        resumeData = await DataStore.query(Resume)
        console.log(`Found ${resumeData.length} resumes in DataStore`)
      } catch (queryError) {
        console.error("Error querying resumes:", queryError)
        // Continue with empty array
      }

      if (!resumeData || resumeData.length === 0) {
        console.warn("No resumes found, creating mock data...")

        try {
          // Create mock data directly without stopping/starting sync
          await createMockData()
            .then(() => console.log("Mock data creation completed"))
            .catch(error => console.error("Error creating mock data:", error))

          // Query again after creating mock data
          let newResumeData: Resume[] = []
          try {
            newResumeData = await DataStore.query(Resume)
            console.log(`After creating mock data, found ${newResumeData.length} resumes`)
          } catch (queryError) {
            console.error("Error querying resumes after creating mock data:", queryError)
            // Continue with empty array
          }

          if (!newResumeData || newResumeData.length === 0) {
            console.error("Still no resumes found after creating mock data")
            setIsLoading(false)
            return
          }

          // Continue with the new data
          resumeData = newResumeData
        } catch (mockDataError) {
          console.error("Error in mock data creation process:", mockDataError)
          setIsLoading(false)
          return
        }
      }

      // Fetch related data for each resume
      try {
        const expandedResumes = await fetchExpandedResumes(resumeData)
        setResumes(expandedResumes)
        console.log(`Set ${expandedResumes.length} expanded resumes in state`)
      } catch (expandError) {
        console.error("Error expanding resumes:", expandError)
        // Set at least the basic resume data
        setResumes(resumeData.map(resume => ({
          id: resume.id,
          title: resume.title,
          // Add empty arrays/nulls for related data
          Summary: null,
          Skills: [] as any[],
          Education: null,
          Schools: [] as any[],
          Degrees: [] as any[],
          Experience: null,
          Companies: [] as any[],
          Engagements: [] as any[],
          Accomplishments: [] as any[],
          ContactInformation: null,
          References: [] as any[]
        })))
      }
    } catch (error) {
      console.error("Error in main fetchData process:", error)
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
      // Clear DataStore
      await clearDataStore()
      console.log('DataStore cleared')

      // Create new mock data
      await createMockData()
      console.log('Mock data created')

      // Force sync to push local data to the cloud
      await forceSync()
      console.log('Forced sync to push local data to the cloud')

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
