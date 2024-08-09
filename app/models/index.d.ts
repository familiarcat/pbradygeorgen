import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerReference = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Reference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phone?: string | null;
  readonly email?: string | null;
  readonly contactinformationID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyReference = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Reference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly phone?: string | null;
  readonly email?: string | null;
  readonly contactinformationID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Reference = LazyLoading extends LazyLoadingDisabled ? EagerReference : LazyReference

export declare const Reference: (new (init: ModelInit<Reference>) => Reference) & {
  copyOf(source: Reference, mutator: (draft: MutableModel<Reference>) => MutableModel<Reference> | void): Reference;
}

type EagerContactInformation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContactInformation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly References?: (Reference | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyContactInformation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ContactInformation, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly References: AsyncCollection<Reference>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ContactInformation = LazyLoading extends LazyLoadingDisabled ? EagerContactInformation : LazyContactInformation

export declare const ContactInformation: (new (init: ModelInit<ContactInformation>) => ContactInformation) & {
  copyOf(source: ContactInformation, mutator: (draft: MutableModel<ContactInformation>) => MutableModel<ContactInformation> | void): ContactInformation;
}

type EagerResume = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Resume, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Summary?: Summary | null;
  readonly Skills?: (Skill | null)[] | null;
  readonly Education?: Education | null;
  readonly Experience?: Experience | null;
  readonly ContactInformation?: ContactInformation | null;
  readonly title?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly resumeSummaryId?: string | null;
  readonly resumeEducationId?: string | null;
  readonly resumeExperienceId?: string | null;
  readonly resumeContactInformationId?: string | null;
}

type LazyResume = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Resume, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Summary: AsyncItem<Summary | undefined>;
  readonly Skills: AsyncCollection<Skill>;
  readonly Education: AsyncItem<Education | undefined>;
  readonly Experience: AsyncItem<Experience | undefined>;
  readonly ContactInformation: AsyncItem<ContactInformation | undefined>;
  readonly title?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly resumeSummaryId?: string | null;
  readonly resumeEducationId?: string | null;
  readonly resumeExperienceId?: string | null;
  readonly resumeContactInformationId?: string | null;
}

export declare type Resume = LazyLoading extends LazyLoadingDisabled ? EagerResume : LazyResume

export declare const Resume: (new (init: ModelInit<Resume>) => Resume) & {
  copyOf(source: Resume, mutator: (draft: MutableModel<Resume>) => MutableModel<Resume> | void): Resume;
}

type EagerEducation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Education, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly summary?: string | null;
  readonly Schools?: (School | null)[] | null;
  readonly Resume?: Resume | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly educationResumeId?: string | null;
}

type LazyEducation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Education, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly summary?: string | null;
  readonly Schools: AsyncCollection<School>;
  readonly Resume: AsyncItem<Resume | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly educationResumeId?: string | null;
}

export declare type Education = LazyLoading extends LazyLoadingDisabled ? EagerEducation : LazyEducation

export declare const Education: (new (init: ModelInit<Education>) => Education) & {
  copyOf(source: Education, mutator: (draft: MutableModel<Education>) => MutableModel<Education> | void): Education;
}

type EagerDegree = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Degree, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly major?: string | null;
  readonly startYear?: string | null;
  readonly endYear?: string | null;
  readonly schoolID?: string | null;
  readonly School?: School | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDegree = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Degree, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly major?: string | null;
  readonly startYear?: string | null;
  readonly endYear?: string | null;
  readonly schoolID?: string | null;
  readonly School: AsyncItem<School | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Degree = LazyLoading extends LazyLoadingDisabled ? EagerDegree : LazyDegree

export declare const Degree: (new (init: ModelInit<Degree>) => Degree) & {
  copyOf(source: Degree, mutator: (draft: MutableModel<Degree>) => MutableModel<Degree> | void): Degree;
}

type EagerCompany = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Company, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly role?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly historyID?: string | null;
  readonly Engagements?: (Engagement | null)[] | null;
  readonly Accomplishments?: (Accomplishment | null)[] | null;
  readonly Skills?: (Skill | null)[] | null;
  readonly title?: string | null;
  readonly gptResponse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCompany = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Company, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly role?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly historyID?: string | null;
  readonly Engagements: AsyncCollection<Engagement>;
  readonly Accomplishments: AsyncCollection<Accomplishment>;
  readonly Skills: AsyncCollection<Skill>;
  readonly title?: string | null;
  readonly gptResponse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Company = LazyLoading extends LazyLoadingDisabled ? EagerCompany : LazyCompany

export declare const Company: (new (init: ModelInit<Company>) => Company) & {
  copyOf(source: Company, mutator: (draft: MutableModel<Company>) => MutableModel<Company> | void): Company;
}

type EagerAccomplishment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Accomplishment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly link?: string | null;
  readonly engagementID?: string | null;
  readonly companyID?: string | null;
  readonly Skills?: (Skill | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAccomplishment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Accomplishment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly link?: string | null;
  readonly engagementID?: string | null;
  readonly companyID?: string | null;
  readonly Skills: AsyncCollection<Skill>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Accomplishment = LazyLoading extends LazyLoadingDisabled ? EagerAccomplishment : LazyAccomplishment

export declare const Accomplishment: (new (init: ModelInit<Accomplishment>) => Accomplishment) & {
  copyOf(source: Accomplishment, mutator: (draft: MutableModel<Accomplishment>) => MutableModel<Accomplishment> | void): Accomplishment;
}

type EagerSchool = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<School, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly Degrees?: (Degree | null)[] | null;
  readonly educationID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySchool = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<School, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly Degrees: AsyncCollection<Degree>;
  readonly educationID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type School = LazyLoading extends LazyLoadingDisabled ? EagerSchool : LazySchool

export declare const School: (new (init: ModelInit<School>) => School) & {
  copyOf(source: School, mutator: (draft: MutableModel<School>) => MutableModel<School> | void): School;
}

type EagerExperience = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Experience, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly text?: string | null;
  readonly Companies?: (Company | null)[] | null;
  readonly gptResponse?: string | null;
  readonly Resume?: Resume | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly experienceResumeId?: string | null;
}

type LazyExperience = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Experience, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly text?: string | null;
  readonly Companies: AsyncCollection<Company>;
  readonly gptResponse?: string | null;
  readonly Resume: AsyncItem<Resume | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly experienceResumeId?: string | null;
}

export declare type Experience = LazyLoading extends LazyLoadingDisabled ? EagerExperience : LazyExperience

export declare const Experience: (new (init: ModelInit<Experience>) => Experience) & {
  copyOf(source: Experience, mutator: (draft: MutableModel<Experience>) => MutableModel<Experience> | void): Experience;
}

type EagerSkill = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Skill, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly link?: string | null;
  readonly resumeID?: string | null;
  readonly companyID?: string | null;
  readonly accomplishmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySkill = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Skill, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly link?: string | null;
  readonly resumeID?: string | null;
  readonly companyID?: string | null;
  readonly accomplishmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Skill = LazyLoading extends LazyLoadingDisabled ? EagerSkill : LazySkill

export declare const Skill: (new (init: ModelInit<Skill>) => Skill) & {
  copyOf(source: Skill, mutator: (draft: MutableModel<Skill>) => MutableModel<Skill> | void): Skill;
}

type EagerEngagement = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Engagement, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly client?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly companyID?: string | null;
  readonly Accomplishments?: (Accomplishment | null)[] | null;
  readonly gptResponse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyEngagement = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Engagement, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly client?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly companyID?: string | null;
  readonly Accomplishments: AsyncCollection<Accomplishment>;
  readonly gptResponse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Engagement = LazyLoading extends LazyLoadingDisabled ? EagerEngagement : LazyEngagement

export declare const Engagement: (new (init: ModelInit<Engagement>) => Engagement) & {
  copyOf(source: Engagement, mutator: (draft: MutableModel<Engagement>) => MutableModel<Engagement> | void): Engagement;
}

type EagerSummary = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Summary, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly goals?: string | null;
  readonly persona?: string | null;
  readonly url?: string | null;
  readonly headshot?: string | null;
  readonly gptResponse?: string | null;
  readonly Resume?: Resume | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly summaryResumeId?: string | null;
}

type LazySummary = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Summary, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly goals?: string | null;
  readonly persona?: string | null;
  readonly url?: string | null;
  readonly headshot?: string | null;
  readonly gptResponse?: string | null;
  readonly Resume: AsyncItem<Resume | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly summaryResumeId?: string | null;
}

export declare type Summary = LazyLoading extends LazyLoadingDisabled ? EagerSummary : LazySummary

export declare const Summary: (new (init: ModelInit<Summary>) => Summary) & {
  copyOf(source: Summary, mutator: (draft: MutableModel<Summary>) => MutableModel<Summary> | void): Summary;
}