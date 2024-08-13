// types.ts
export interface SummaryType {
  id: string
  goals?: string | null
  persona?: string | null
}

export interface SkillType {
  id: string
  title?: string | null
  resumeID?: string | null
}

export interface EducationType {
  id: string
  summary?: string | null
}

export interface ExperienceType {
  id: string
  title?: string | null
  text?: string | null
}

export interface ContactInformationType {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
}

export interface ReferenceType {
  id: string
  name?: string | null
  phone?: string | null
  email?: string | null
  contactinformationID?: string | null
}

export interface SchoolType {
  id: string
  name?: string | null
  educationID?: string | null
}

export interface DegreeType {
  id: string
  major?: string | null
  startYear?: string | null
  endYear?: string | null
  schoolID?: string | null
}

export interface CompanyType {
  id: string
  name?: string | null
  role?: string | null
  startDate?: string | null
  endDate?: string | null
  title?: string | null
  experienceID?: string | null
}

export interface EngagementType {
  id: string
  client?: string | null
  startDate?: string | null
  endDate?: string | null
  companyID?: string | null
}

export interface AccomplishmentType {
  id: string
  title?: string | null
  description?: string | null
  engagementID?: string | null
  companyID?: string | null
}

export interface ExpandedResume {
  id: string
  title?: string | null
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
