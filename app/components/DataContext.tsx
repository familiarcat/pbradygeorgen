// DataContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DataStore } from "@aws-amplify/datastore"
import { Hub } from "@aws-amplify/core"
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
import { clearData, createMockData } from "app/mock/mockData"
import { StyleSheet, Text, View, Image, useWindowDimensions, Platform } from "react-native"
import { configureAmplifyDataStore } from "../config/amplify-datastore-config"

// Define TypeScript interfaces for your models
interface ResumeType {
  id: string
  title?: string | null
}

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
  const [isLoading, setIsLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('initializing')
  const { width: screenWidth } = useWindowDimensions()

  // Initialize DataStore when component mounts
  useEffect(() => {
    try {
      // Configure Amplify DataStore
      configureAmplifyDataStore()

      // Set up Hub listener for DataStore events
      let hubListener: () => void;
      try {
        if (Hub && typeof Hub.listen === 'function') {
          hubListener = Hub.listen('datastore', async (hubData) => {
            try {
              const { event, data } = hubData.payload;

              switch (event) {
                case 'ready':
                  setSyncStatus('ready')
                  break;
                case 'syncQueriesReady':
                  setSyncStatus('synced')
                  // Refresh data after sync
                  fetchData()
                  break;
                case 'networkStatus':
                  if (data && typeof data === 'object' && 'active' in data) {
                    setSyncStatus(data.active ? 'online' : 'offline')
                  }
                  break;
              }
            } catch (error) {
              console.error('Error in Hub listener callback:', error);
            }
          });

          // Clean up Hub listener
          return () => {
            if (hubListener) {
              hubListener();
            }
          }
        } else {
          console.warn('Hub is not available or Hub.listen is not a function');
          // Proceed without Hub listener
          // Ensure we still fetch data
          fetchData();
          return undefined;
        }
      } catch (hubError) {
        console.error('Error setting up Hub listener:', hubError);
        // Proceed without Hub listener
        // Ensure we still fetch data
        fetchData();
        return undefined;
      }
    } catch (error) {
      console.error('Error in DataStore initialization:', error);
      // Ensure we still fetch data even if initialization fails
      fetchData();
      return undefined;
    }
  }, [])

  // Fetch data from DataStore
  useEffect(() => {
    fetchData()

    // Subscribe to changes in Resume model
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      if (DataStore && typeof DataStore.observe === 'function') {
        subscription = DataStore.observe(Resume).subscribe(() => {
          console.log('Resume model changed, refreshing data')
          fetchData()
        })
      } else {
        console.warn('DataStore or DataStore.observe is not available');
      }
    } catch (error) {
      console.error('Error setting up DataStore subscription:', error);
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Check if DataStore is available
      if (!DataStore || typeof DataStore.query !== 'function') {
        console.warn('DataStore or DataStore.query is not available');
        setIsLoading(false);
        return;
      }

      // Fetch all resumes
      console.log('Fetching resumes from DataStore')
      let resumeData: Resume[] = [];
      try {
        resumeData = await DataStore.query(Resume);
        console.log(`Found ${resumeData.length} resumes in DataStore`);
      } catch (queryError) {
        console.error('Error querying resumes:', queryError);
        // Continue with empty array
      }

      // If no resumes found, create mock data
      if (!resumeData || resumeData.length === 0) {
        console.warn('No resumes found in DataStore, creating mock data')
        try {
          await createMockData()
            .then(() => console.log('Mock data creation completed'))
            .catch(error => console.error('Error creating mock data:', error))

          // Try to query again after creating mock data
          try {
            resumeData = await DataStore.query(Resume);
            console.log(`After creating mock data, found ${resumeData.length} resumes`);

            if (!resumeData || resumeData.length === 0) {
              console.error('Still no resumes found after creating mock data');
              setIsLoading(false);
              return;
            }
          } catch (queryError) {
            console.error('Error querying resumes after creating mock data:', queryError);
            setIsLoading(false);
            return;
          }
        } catch (mockDataError) {
          console.error('Error in mock data creation process:', mockDataError);
          setIsLoading(false);
          return;
        }
      }

      // Fetch related data for each resume
      try {
        const expandedResumes: ExpandedResume[] = await Promise.all(
          resumeData.map(async (resume) => {
            try {
              let summary = null;
              try {
                summary = resume.resumeSummaryId
                  ? await DataStore.query(Summary, resume.resumeSummaryId).then((res) => res || null)
                  : null;
              } catch (error) {
                console.warn(`Error fetching summary for resume ${resume.id}:`, error);
              }

              let skills: SkillType[] = [];
              try {
                skills = resume.id
                  ? await DataStore.query(Skill, (s) => s.resumeID.eq(resume.id)).catch(() => [])
                  : [];
              } catch (error) {
                console.warn(`Error fetching skills for resume ${resume.id}:`, error);
              }

              let education = null;
              try {
                education = resume.resumeEducationId
                  ? await DataStore.query(Education, resume.resumeEducationId).then(
                      (res) => res || null,
                    )
                  : null;
              } catch (error) {
                console.warn(`Error fetching education for resume ${resume.id}:`, error);
              }

              let schools: SchoolType[] = [];
              try {
                schools = education
                  ? await DataStore.query(School, (s) => s.educationID.eq(education.id)).catch(() => [])
                  : [];
              } catch (error) {
                console.warn(`Error fetching schools for resume ${resume.id}:`, error);
              }

              let degrees: DegreeType[] = [];
              try {
                degrees = await Promise.all(
                  schools.map((school) =>
                    DataStore.query(Degree, (d) => d.schoolID.eq(school.id)).catch(() => []),
                  ),
                ).then((results) => results.flat());
              } catch (error) {
                console.warn(`Error fetching degrees for resume ${resume.id}:`, error);
              }

              let experience = null;
              try {
                experience = resume.resumeExperienceId
                  ? await DataStore.query(Experience, resume.resumeExperienceId).then(
                      (res) => res || null,
                    )
                  : null;
              } catch (error) {
                console.warn(`Error fetching experience for resume ${resume.id}:`, error);
              }

              let companies: CompanyType[] = [];
              try {
                companies = experience
                  ? await DataStore.query(Company, (c) => c.experienceID.eq(experience.id)).catch(
                      () => [],
                    )
                  : [];
              } catch (error) {
                console.warn(`Error fetching companies for resume ${resume.id}:`, error);
              }

              let engagements: EngagementType[] = [];
              try {
                engagements = await Promise.all(
                  companies.map((company) =>
                    DataStore.query(Engagement, (e) => e.companyID.eq(company.id)).catch(() => []),
                  ),
                ).then((results) => results.flat());
              } catch (error) {
                console.warn(`Error fetching engagements for resume ${resume.id}:`, error);
              }

              let accomplishments: AccomplishmentType[] = [];
              try {
                accomplishments = await Promise.all(
                  engagements.map((engagement) =>
                    DataStore.query(Accomplishment, (a) => a.engagementID.eq(engagement.id)).catch(
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
                      (res) => res || null,
                    )
                  : null;
              } catch (error) {
                console.warn(`Error fetching contact info for resume ${resume.id}:`, error);
              }

              let references: ReferenceType[] = [];
              try {
                references = contactInfo
                  ? await DataStore.query(Reference, (r) =>
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
                Skills: [] as SkillType[],
                Education: null,
                Schools: [] as SchoolType[],
                Degrees: [] as DegreeType[],
                Experience: null,
                Companies: [] as CompanyType[],
                Engagements: [] as EngagementType[],
                Accomplishments: [] as AccomplishmentType[],
                ContactInformation: null,
                References: [] as ReferenceType[],
              };
            }
          }),
        );

        setResumes(expandedResumes);
      } catch (expandError) {
        console.error('Error expanding resumes:', expandError);
        // Set at least the basic resume data
        setResumes(resumeData.map(resume => ({
          id: resume.id,
          title: resume.title,
          // Add empty arrays/nulls for related data
          Summary: null,
          Skills: [] as SkillType[],
          Education: null,
          Schools: [] as SchoolType[],
          Degrees: [] as DegreeType[],
          Experience: null,
          Companies: [] as CompanyType[],
          Engagements: [] as EngagementType[],
          Accomplishments: [] as AccomplishmentType[],
          ContactInformation: null,
          References: [] as ReferenceType[]
        })));
      }
    } catch (error) {
      console.error('Error in main fetchData process:', error);
    } finally {
      setIsLoading(false);
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

  return (
    <DataContext.Provider
      value={{
        resumes,
        getBaseHueForResume,
        renderIndentation,
        renderTextColor,
        dynamicStyles,
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
