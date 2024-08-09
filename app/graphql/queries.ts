/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../src/API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getReference = /* GraphQL */ `query GetReference($id: ID!) {
  getReference(id: $id) {
    id
    name
    phone
    email
    contactinformationID
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetReferenceQueryVariables,
  APITypes.GetReferenceQuery
>;
export const listReferences = /* GraphQL */ `query ListReferences(
  $filter: ModelReferenceFilterInput
  $limit: Int
  $nextToken: String
) {
  listReferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      phone
      email
      contactinformationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReferencesQueryVariables,
  APITypes.ListReferencesQuery
>;
export const syncReferences = /* GraphQL */ `query SyncReferences(
  $filter: ModelReferenceFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncReferences(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      phone
      email
      contactinformationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncReferencesQueryVariables,
  APITypes.SyncReferencesQuery
>;
export const referencesByContactinformationID = /* GraphQL */ `query ReferencesByContactinformationID(
  $contactinformationID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelReferenceFilterInput
  $limit: Int
  $nextToken: String
) {
  referencesByContactinformationID(
    contactinformationID: $contactinformationID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      phone
      email
      contactinformationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ReferencesByContactinformationIDQueryVariables,
  APITypes.ReferencesByContactinformationIDQuery
>;
export const getContactInformation = /* GraphQL */ `query GetContactInformation($id: ID!) {
  getContactInformation(id: $id) {
    id
    name
    email
    phone
    References {
      items {
        id
        name
        phone
        email
        contactinformationID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetContactInformationQueryVariables,
  APITypes.GetContactInformationQuery
>;
export const listContactInformations = /* GraphQL */ `query ListContactInformations(
  $filter: ModelContactInformationFilterInput
  $limit: Int
  $nextToken: String
) {
  listContactInformations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      email
      phone
      References {
        items {
          id
          name
          phone
          email
          contactinformationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListContactInformationsQueryVariables,
  APITypes.ListContactInformationsQuery
>;
export const syncContactInformations = /* GraphQL */ `query SyncContactInformations(
  $filter: ModelContactInformationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncContactInformations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      email
      phone
      References {
        items {
          id
          name
          phone
          email
          contactinformationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncContactInformationsQueryVariables,
  APITypes.SyncContactInformationsQuery
>;
export const getResume = /* GraphQL */ `query GetResume($id: ID!) {
  getResume(id: $id) {
    id
    Summary {
      id
      goals
      persona
      url
      headshot
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      summaryResumeId
      __typename
    }
    Skills {
      items {
        id
        title
        link
        resumeID
        companyID
        accomplishmentID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    Education {
      id
      summary
      Schools {
        items {
          id
          name
          educationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      educationResumeId
      __typename
    }
    Experience {
      id
      title
      text
      Companies {
        items {
          id
          name
          role
          startDate
          endDate
          historyID
          title
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      experienceResumeId
      __typename
    }
    ContactInformation {
      id
      name
      email
      phone
      References {
        items {
          id
          name
          phone
          email
          contactinformationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    title
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    resumeSummaryId
    resumeEducationId
    resumeExperienceId
    resumeContactInformationId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetResumeQueryVariables, APITypes.GetResumeQuery>;
export const listResumes = /* GraphQL */ `query ListResumes(
  $filter: ModelResumeFilterInput
  $limit: Int
  $nextToken: String
) {
  listResumes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      Summary {
        id
        goals
        persona
        url
        headshot
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        summaryResumeId
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Education {
        id
        summary
        Schools {
          nextToken
          startedAt
          __typename
        }
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        educationResumeId
        __typename
      }
      Experience {
        id
        title
        text
        Companies {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        experienceResumeId
        __typename
      }
      ContactInformation {
        id
        name
        email
        phone
        References {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      resumeSummaryId
      resumeEducationId
      resumeExperienceId
      resumeContactInformationId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListResumesQueryVariables,
  APITypes.ListResumesQuery
>;
export const syncResumes = /* GraphQL */ `query SyncResumes(
  $filter: ModelResumeFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncResumes(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      Summary {
        id
        goals
        persona
        url
        headshot
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        summaryResumeId
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Education {
        id
        summary
        Schools {
          nextToken
          startedAt
          __typename
        }
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        educationResumeId
        __typename
      }
      Experience {
        id
        title
        text
        Companies {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        experienceResumeId
        __typename
      }
      ContactInformation {
        id
        name
        email
        phone
        References {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      resumeSummaryId
      resumeEducationId
      resumeExperienceId
      resumeContactInformationId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncResumesQueryVariables,
  APITypes.SyncResumesQuery
>;
export const getEducation = /* GraphQL */ `query GetEducation($id: ID!) {
  getEducation(id: $id) {
    id
    summary
    Schools {
      items {
        id
        name
        Degrees {
          nextToken
          startedAt
          __typename
        }
        educationID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    Resume {
      id
      Summary {
        id
        goals
        persona
        url
        headshot
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        summaryResumeId
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Education {
        id
        summary
        Schools {
          nextToken
          startedAt
          __typename
        }
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        educationResumeId
        __typename
      }
      Experience {
        id
        title
        text
        Companies {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        experienceResumeId
        __typename
      }
      ContactInformation {
        id
        name
        email
        phone
        References {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      resumeSummaryId
      resumeEducationId
      resumeExperienceId
      resumeContactInformationId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    educationResumeId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEducationQueryVariables,
  APITypes.GetEducationQuery
>;
export const listEducations = /* GraphQL */ `query ListEducations(
  $filter: ModelEducationFilterInput
  $limit: Int
  $nextToken: String
) {
  listEducations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      summary
      Schools {
        items {
          id
          name
          educationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      educationResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEducationsQueryVariables,
  APITypes.ListEducationsQuery
>;
export const syncEducations = /* GraphQL */ `query SyncEducations(
  $filter: ModelEducationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncEducations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      summary
      Schools {
        items {
          id
          name
          educationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      educationResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncEducationsQueryVariables,
  APITypes.SyncEducationsQuery
>;
export const getDegree = /* GraphQL */ `query GetDegree($id: ID!) {
  getDegree(id: $id) {
    id
    major
    startYear
    endYear
    schoolID
    School {
      id
      name
      Degrees {
        items {
          id
          major
          startYear
          endYear
          schoolID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      educationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDegreeQueryVariables, APITypes.GetDegreeQuery>;
export const listDegrees = /* GraphQL */ `query ListDegrees(
  $filter: ModelDegreeFilterInput
  $limit: Int
  $nextToken: String
) {
  listDegrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      major
      startYear
      endYear
      schoolID
      School {
        id
        name
        Degrees {
          nextToken
          startedAt
          __typename
        }
        educationID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDegreesQueryVariables,
  APITypes.ListDegreesQuery
>;
export const syncDegrees = /* GraphQL */ `query SyncDegrees(
  $filter: ModelDegreeFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncDegrees(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      major
      startYear
      endYear
      schoolID
      School {
        id
        name
        Degrees {
          nextToken
          startedAt
          __typename
        }
        educationID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncDegreesQueryVariables,
  APITypes.SyncDegreesQuery
>;
export const degreesBySchoolID = /* GraphQL */ `query DegreesBySchoolID(
  $schoolID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelDegreeFilterInput
  $limit: Int
  $nextToken: String
) {
  degreesBySchoolID(
    schoolID: $schoolID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      major
      startYear
      endYear
      schoolID
      School {
        id
        name
        Degrees {
          nextToken
          startedAt
          __typename
        }
        educationID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DegreesBySchoolIDQueryVariables,
  APITypes.DegreesBySchoolIDQuery
>;
export const getCompany = /* GraphQL */ `query GetCompany($id: ID!) {
  getCompany(id: $id) {
    id
    name
    role
    startDate
    endDate
    historyID
    Engagements {
      items {
        id
        client
        startDate
        endDate
        companyID
        Accomplishments {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    Accomplishments {
      items {
        id
        title
        description
        link
        engagementID
        companyID
        Skills {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    Skills {
      items {
        id
        title
        link
        resumeID
        companyID
        accomplishmentID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    title
    gptResponse
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCompanyQueryVariables,
  APITypes.GetCompanyQuery
>;
export const listCompanies = /* GraphQL */ `query ListCompanies(
  $filter: ModelCompanyFilterInput
  $limit: Int
  $nextToken: String
) {
  listCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      role
      startDate
      endDate
      historyID
      Engagements {
        items {
          id
          client
          startDate
          endDate
          companyID
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      title
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCompaniesQueryVariables,
  APITypes.ListCompaniesQuery
>;
export const syncCompanies = /* GraphQL */ `query SyncCompanies(
  $filter: ModelCompanyFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncCompanies(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      role
      startDate
      endDate
      historyID
      Engagements {
        items {
          id
          client
          startDate
          endDate
          companyID
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      title
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncCompaniesQueryVariables,
  APITypes.SyncCompaniesQuery
>;
export const companiesByHistoryID = /* GraphQL */ `query CompaniesByHistoryID(
  $historyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelCompanyFilterInput
  $limit: Int
  $nextToken: String
) {
  companiesByHistoryID(
    historyID: $historyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      role
      startDate
      endDate
      historyID
      Engagements {
        items {
          id
          client
          startDate
          endDate
          companyID
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      title
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CompaniesByHistoryIDQueryVariables,
  APITypes.CompaniesByHistoryIDQuery
>;
export const getAccomplishment = /* GraphQL */ `query GetAccomplishment($id: ID!) {
  getAccomplishment(id: $id) {
    id
    title
    description
    link
    engagementID
    companyID
    Skills {
      items {
        id
        title
        link
        resumeID
        companyID
        accomplishmentID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccomplishmentQueryVariables,
  APITypes.GetAccomplishmentQuery
>;
export const listAccomplishments = /* GraphQL */ `query ListAccomplishments(
  $filter: ModelAccomplishmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccomplishments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      link
      engagementID
      companyID
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccomplishmentsQueryVariables,
  APITypes.ListAccomplishmentsQuery
>;
export const syncAccomplishments = /* GraphQL */ `query SyncAccomplishments(
  $filter: ModelAccomplishmentFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncAccomplishments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      title
      description
      link
      engagementID
      companyID
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncAccomplishmentsQueryVariables,
  APITypes.SyncAccomplishmentsQuery
>;
export const accomplishmentsByEngagementID = /* GraphQL */ `query AccomplishmentsByEngagementID(
  $engagementID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAccomplishmentFilterInput
  $limit: Int
  $nextToken: String
) {
  accomplishmentsByEngagementID(
    engagementID: $engagementID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      description
      link
      engagementID
      companyID
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AccomplishmentsByEngagementIDQueryVariables,
  APITypes.AccomplishmentsByEngagementIDQuery
>;
export const accomplishmentsByCompanyID = /* GraphQL */ `query AccomplishmentsByCompanyID(
  $companyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAccomplishmentFilterInput
  $limit: Int
  $nextToken: String
) {
  accomplishmentsByCompanyID(
    companyID: $companyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      description
      link
      engagementID
      companyID
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AccomplishmentsByCompanyIDQueryVariables,
  APITypes.AccomplishmentsByCompanyIDQuery
>;
export const getSchool = /* GraphQL */ `query GetSchool($id: ID!) {
  getSchool(id: $id) {
    id
    name
    Degrees {
      items {
        id
        major
        startYear
        endYear
        schoolID
        School {
          id
          name
          educationID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    educationID
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSchoolQueryVariables, APITypes.GetSchoolQuery>;
export const listSchools = /* GraphQL */ `query ListSchools(
  $filter: ModelSchoolFilterInput
  $limit: Int
  $nextToken: String
) {
  listSchools(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      Degrees {
        items {
          id
          major
          startYear
          endYear
          schoolID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      educationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSchoolsQueryVariables,
  APITypes.ListSchoolsQuery
>;
export const syncSchools = /* GraphQL */ `query SyncSchools(
  $filter: ModelSchoolFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSchools(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      Degrees {
        items {
          id
          major
          startYear
          endYear
          schoolID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      educationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSchoolsQueryVariables,
  APITypes.SyncSchoolsQuery
>;
export const schoolsByEducationID = /* GraphQL */ `query SchoolsByEducationID(
  $educationID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSchoolFilterInput
  $limit: Int
  $nextToken: String
) {
  schoolsByEducationID(
    educationID: $educationID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      Degrees {
        items {
          id
          major
          startYear
          endYear
          schoolID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      educationID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SchoolsByEducationIDQueryVariables,
  APITypes.SchoolsByEducationIDQuery
>;
export const getExperience = /* GraphQL */ `query GetExperience($id: ID!) {
  getExperience(id: $id) {
    id
    title
    text
    Companies {
      items {
        id
        name
        role
        startDate
        endDate
        historyID
        Engagements {
          nextToken
          startedAt
          __typename
        }
        Accomplishments {
          nextToken
          startedAt
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        title
        gptResponse
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    gptResponse
    Resume {
      id
      Summary {
        id
        goals
        persona
        url
        headshot
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        summaryResumeId
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Education {
        id
        summary
        Schools {
          nextToken
          startedAt
          __typename
        }
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        educationResumeId
        __typename
      }
      Experience {
        id
        title
        text
        Companies {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        experienceResumeId
        __typename
      }
      ContactInformation {
        id
        name
        email
        phone
        References {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      resumeSummaryId
      resumeEducationId
      resumeExperienceId
      resumeContactInformationId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    experienceResumeId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetExperienceQueryVariables,
  APITypes.GetExperienceQuery
>;
export const listExperiences = /* GraphQL */ `query ListExperiences(
  $filter: ModelExperienceFilterInput
  $limit: Int
  $nextToken: String
) {
  listExperiences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      text
      Companies {
        items {
          id
          name
          role
          startDate
          endDate
          historyID
          title
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      experienceResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListExperiencesQueryVariables,
  APITypes.ListExperiencesQuery
>;
export const syncExperiences = /* GraphQL */ `query SyncExperiences(
  $filter: ModelExperienceFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncExperiences(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      title
      text
      Companies {
        items {
          id
          name
          role
          startDate
          endDate
          historyID
          title
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      experienceResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncExperiencesQueryVariables,
  APITypes.SyncExperiencesQuery
>;
export const getSkill = /* GraphQL */ `query GetSkill($id: ID!) {
  getSkill(id: $id) {
    id
    title
    link
    resumeID
    companyID
    accomplishmentID
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSkillQueryVariables, APITypes.GetSkillQuery>;
export const listSkills = /* GraphQL */ `query ListSkills(
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSkillsQueryVariables,
  APITypes.ListSkillsQuery
>;
export const syncSkills = /* GraphQL */ `query SyncSkills(
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSkills(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSkillsQueryVariables,
  APITypes.SyncSkillsQuery
>;
export const skillsByResumeID = /* GraphQL */ `query SkillsByResumeID(
  $resumeID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  skillsByResumeID(
    resumeID: $resumeID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SkillsByResumeIDQueryVariables,
  APITypes.SkillsByResumeIDQuery
>;
export const skillsByCompanyID = /* GraphQL */ `query SkillsByCompanyID(
  $companyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  skillsByCompanyID(
    companyID: $companyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SkillsByCompanyIDQueryVariables,
  APITypes.SkillsByCompanyIDQuery
>;
export const skillsByAccomplishmentID = /* GraphQL */ `query SkillsByAccomplishmentID(
  $accomplishmentID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  skillsByAccomplishmentID(
    accomplishmentID: $accomplishmentID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      link
      resumeID
      companyID
      accomplishmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SkillsByAccomplishmentIDQueryVariables,
  APITypes.SkillsByAccomplishmentIDQuery
>;
export const getEngagement = /* GraphQL */ `query GetEngagement($id: ID!) {
  getEngagement(id: $id) {
    id
    client
    startDate
    endDate
    companyID
    Accomplishments {
      items {
        id
        title
        description
        link
        engagementID
        companyID
        Skills {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
    gptResponse
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEngagementQueryVariables,
  APITypes.GetEngagementQuery
>;
export const listEngagements = /* GraphQL */ `query ListEngagements(
  $filter: ModelEngagementFilterInput
  $limit: Int
  $nextToken: String
) {
  listEngagements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      client
      startDate
      endDate
      companyID
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEngagementsQueryVariables,
  APITypes.ListEngagementsQuery
>;
export const syncEngagements = /* GraphQL */ `query SyncEngagements(
  $filter: ModelEngagementFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncEngagements(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      client
      startDate
      endDate
      companyID
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncEngagementsQueryVariables,
  APITypes.SyncEngagementsQuery
>;
export const engagementsByCompanyID = /* GraphQL */ `query EngagementsByCompanyID(
  $companyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEngagementFilterInput
  $limit: Int
  $nextToken: String
) {
  engagementsByCompanyID(
    companyID: $companyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      client
      startDate
      endDate
      companyID
      Accomplishments {
        items {
          id
          title
          description
          link
          engagementID
          companyID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      gptResponse
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.EngagementsByCompanyIDQueryVariables,
  APITypes.EngagementsByCompanyIDQuery
>;
export const getSummary = /* GraphQL */ `query GetSummary($id: ID!) {
  getSummary(id: $id) {
    id
    goals
    persona
    url
    headshot
    gptResponse
    Resume {
      id
      Summary {
        id
        goals
        persona
        url
        headshot
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        summaryResumeId
        __typename
      }
      Skills {
        items {
          id
          title
          link
          resumeID
          companyID
          accomplishmentID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        nextToken
        startedAt
        __typename
      }
      Education {
        id
        summary
        Schools {
          nextToken
          startedAt
          __typename
        }
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        educationResumeId
        __typename
      }
      Experience {
        id
        title
        text
        Companies {
          nextToken
          startedAt
          __typename
        }
        gptResponse
        Resume {
          id
          title
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          resumeSummaryId
          resumeEducationId
          resumeExperienceId
          resumeContactInformationId
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        experienceResumeId
        __typename
      }
      ContactInformation {
        id
        name
        email
        phone
        References {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      resumeSummaryId
      resumeEducationId
      resumeExperienceId
      resumeContactInformationId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    summaryResumeId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSummaryQueryVariables,
  APITypes.GetSummaryQuery
>;
export const listSummaries = /* GraphQL */ `query ListSummaries(
  $filter: ModelSummaryFilterInput
  $limit: Int
  $nextToken: String
) {
  listSummaries(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      goals
      persona
      url
      headshot
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      summaryResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSummariesQueryVariables,
  APITypes.ListSummariesQuery
>;
export const syncSummaries = /* GraphQL */ `query SyncSummaries(
  $filter: ModelSummaryFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSummaries(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      goals
      persona
      url
      headshot
      gptResponse
      Resume {
        id
        Summary {
          id
          goals
          persona
          url
          headshot
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          summaryResumeId
          __typename
        }
        Skills {
          nextToken
          startedAt
          __typename
        }
        Education {
          id
          summary
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          educationResumeId
          __typename
        }
        Experience {
          id
          title
          text
          gptResponse
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          experienceResumeId
          __typename
        }
        ContactInformation {
          id
          name
          email
          phone
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        resumeSummaryId
        resumeEducationId
        resumeExperienceId
        resumeContactInformationId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      summaryResumeId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSummariesQueryVariables,
  APITypes.SyncSummariesQuery
>;
