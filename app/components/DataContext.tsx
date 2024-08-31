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
import { clearData, createMockData } from "app/mock/mockData"

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
  renderIndentation: (level: number) => { marginLeft: number }
  renderTextColor: (level: number, baseHue: number) => { color: string; backgroundColor: string }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext)
  console.log("\n\nusing DataContext ")
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
  useEffect(() => {
    console.log("DataProvider useEffect")
    const fetchData = async () => {
      // await clearData()
      try {
        // Fetch all resumes
        console.log("Fetching resumes")
        const resumeData = await DataStore.query(Resume)
        console.log("resumeData", resumeData)
        ;async () => await clearData()
        if (!resumeData || resumeData.length === 0) {
          console.warn("No resumes found")

          await createMockData()
            .then(() => console.log("create mock data completed on then"))
            .catch(console.error)
          return
        }

        // Fetch related data for each resume
        const expandedResumes: ExpandedResume[] = await Promise.all(
          resumeData.map(async (resume) => {
            const summary = resume.resumeSummaryId
              ? await DataStore.query(Summary, resume.resumeSummaryId).then((res) => res || null)
              : null

            const skills = resume.id
              ? await DataStore.query(Skill, (s) => s.resumeID.eq(resume.id)).catch(() => [])
              : []

            const education = resume.resumeEducationId
              ? await DataStore.query(Education, resume.resumeEducationId).then(
                  (res) => res || null,
                )
              : null

            const schools = education
              ? await DataStore.query(School, (s) => s.educationID.eq(education.id)).catch(() => [])
              : []

            const degrees = await Promise.all(
              schools.map((school) =>
                DataStore.query(Degree, (d) => d.schoolID.eq(school.id)).catch(() => []),
              ),
            ).then((results) => results.flat())

            const experience = resume.resumeExperienceId
              ? await DataStore.query(Experience, resume.resumeExperienceId).then(
                  (res) => res || null,
                )
              : null

            const companies = experience
              ? await DataStore.query(Company, (c) => c.experienceID.eq(experience.id)).catch(
                  () => [],
                )
              : []

            const engagements = await Promise.all(
              companies.map((company) =>
                DataStore.query(Engagement, (e) => e.companyID.eq(company.id)).catch(() => []),
              ),
            ).then((results) => results.flat())

            const accomplishments = await Promise.all(
              engagements.map((engagement) =>
                DataStore.query(Accomplishment, (a) => a.engagementID.eq(engagement.id)).catch(
                  () => [],
                ),
              ),
            ).then((results) => results.flat())

            const contactInfo = resume.resumeContactInformationId
              ? await DataStore.query(ContactInformation, resume.resumeContactInformationId).then(
                  (res) => res || null,
                )
              : null

            const references = contactInfo
              ? await DataStore.query(Reference, (r) =>
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

        setResumes(expandedResumes)
      } catch (error) {
        console.error("Error fetching resumes:", error)
      }
    }

    fetchData()
    const subscription = DataStore.observe(Resume).subscribe(() => fetchData())

    return () => subscription.unsubscribe()
  }, [])

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

  const renderIndentation = (level: number) => ({
    marginLeft: level * 15,
  })

  const renderTextColor = (level: number, baseHue: number) => ({
    color: getColorForLevel(level, baseHue),
    backgroundColor: getBackgroundColorForLevel(level, baseHue),
  })

  return (
    <DataContext.Provider
      value={{
        resumes,
        getBaseHueForResume,
        renderIndentation,
        renderTextColor,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
