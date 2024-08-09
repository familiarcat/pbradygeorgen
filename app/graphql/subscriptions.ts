/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../src/API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateReference = /* GraphQL */ `subscription OnCreateReference($filter: ModelSubscriptionReferenceFilterInput) {
  onCreateReference(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateReferenceSubscriptionVariables,
  APITypes.OnCreateReferenceSubscription
>;
export const onUpdateReference = /* GraphQL */ `subscription OnUpdateReference($filter: ModelSubscriptionReferenceFilterInput) {
  onUpdateReference(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateReferenceSubscriptionVariables,
  APITypes.OnUpdateReferenceSubscription
>;
export const onDeleteReference = /* GraphQL */ `subscription OnDeleteReference($filter: ModelSubscriptionReferenceFilterInput) {
  onDeleteReference(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteReferenceSubscriptionVariables,
  APITypes.OnDeleteReferenceSubscription
>;
export const onCreateContactInformation = /* GraphQL */ `subscription OnCreateContactInformation(
  $filter: ModelSubscriptionContactInformationFilterInput
) {
  onCreateContactInformation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateContactInformationSubscriptionVariables,
  APITypes.OnCreateContactInformationSubscription
>;
export const onUpdateContactInformation = /* GraphQL */ `subscription OnUpdateContactInformation(
  $filter: ModelSubscriptionContactInformationFilterInput
) {
  onUpdateContactInformation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateContactInformationSubscriptionVariables,
  APITypes.OnUpdateContactInformationSubscription
>;
export const onDeleteContactInformation = /* GraphQL */ `subscription OnDeleteContactInformation(
  $filter: ModelSubscriptionContactInformationFilterInput
) {
  onDeleteContactInformation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteContactInformationSubscriptionVariables,
  APITypes.OnDeleteContactInformationSubscription
>;
export const onCreateResume = /* GraphQL */ `subscription OnCreateResume($filter: ModelSubscriptionResumeFilterInput) {
  onCreateResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateResumeSubscriptionVariables,
  APITypes.OnCreateResumeSubscription
>;
export const onUpdateResume = /* GraphQL */ `subscription OnUpdateResume($filter: ModelSubscriptionResumeFilterInput) {
  onUpdateResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateResumeSubscriptionVariables,
  APITypes.OnUpdateResumeSubscription
>;
export const onDeleteResume = /* GraphQL */ `subscription OnDeleteResume($filter: ModelSubscriptionResumeFilterInput) {
  onDeleteResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteResumeSubscriptionVariables,
  APITypes.OnDeleteResumeSubscription
>;
export const onCreateEducation = /* GraphQL */ `subscription OnCreateEducation($filter: ModelSubscriptionEducationFilterInput) {
  onCreateEducation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEducationSubscriptionVariables,
  APITypes.OnCreateEducationSubscription
>;
export const onUpdateEducation = /* GraphQL */ `subscription OnUpdateEducation($filter: ModelSubscriptionEducationFilterInput) {
  onUpdateEducation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEducationSubscriptionVariables,
  APITypes.OnUpdateEducationSubscription
>;
export const onDeleteEducation = /* GraphQL */ `subscription OnDeleteEducation($filter: ModelSubscriptionEducationFilterInput) {
  onDeleteEducation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEducationSubscriptionVariables,
  APITypes.OnDeleteEducationSubscription
>;
export const onCreateDegree = /* GraphQL */ `subscription OnCreateDegree($filter: ModelSubscriptionDegreeFilterInput) {
  onCreateDegree(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDegreeSubscriptionVariables,
  APITypes.OnCreateDegreeSubscription
>;
export const onUpdateDegree = /* GraphQL */ `subscription OnUpdateDegree($filter: ModelSubscriptionDegreeFilterInput) {
  onUpdateDegree(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDegreeSubscriptionVariables,
  APITypes.OnUpdateDegreeSubscription
>;
export const onDeleteDegree = /* GraphQL */ `subscription OnDeleteDegree($filter: ModelSubscriptionDegreeFilterInput) {
  onDeleteDegree(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDegreeSubscriptionVariables,
  APITypes.OnDeleteDegreeSubscription
>;
export const onCreateCompany = /* GraphQL */ `subscription OnCreateCompany($filter: ModelSubscriptionCompanyFilterInput) {
  onCreateCompany(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCompanySubscriptionVariables,
  APITypes.OnCreateCompanySubscription
>;
export const onUpdateCompany = /* GraphQL */ `subscription OnUpdateCompany($filter: ModelSubscriptionCompanyFilterInput) {
  onUpdateCompany(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCompanySubscriptionVariables,
  APITypes.OnUpdateCompanySubscription
>;
export const onDeleteCompany = /* GraphQL */ `subscription OnDeleteCompany($filter: ModelSubscriptionCompanyFilterInput) {
  onDeleteCompany(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCompanySubscriptionVariables,
  APITypes.OnDeleteCompanySubscription
>;
export const onCreateAccomplishment = /* GraphQL */ `subscription OnCreateAccomplishment(
  $filter: ModelSubscriptionAccomplishmentFilterInput
) {
  onCreateAccomplishment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAccomplishmentSubscriptionVariables,
  APITypes.OnCreateAccomplishmentSubscription
>;
export const onUpdateAccomplishment = /* GraphQL */ `subscription OnUpdateAccomplishment(
  $filter: ModelSubscriptionAccomplishmentFilterInput
) {
  onUpdateAccomplishment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAccomplishmentSubscriptionVariables,
  APITypes.OnUpdateAccomplishmentSubscription
>;
export const onDeleteAccomplishment = /* GraphQL */ `subscription OnDeleteAccomplishment(
  $filter: ModelSubscriptionAccomplishmentFilterInput
) {
  onDeleteAccomplishment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAccomplishmentSubscriptionVariables,
  APITypes.OnDeleteAccomplishmentSubscription
>;
export const onCreateSchool = /* GraphQL */ `subscription OnCreateSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onCreateSchool(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSchoolSubscriptionVariables,
  APITypes.OnCreateSchoolSubscription
>;
export const onUpdateSchool = /* GraphQL */ `subscription OnUpdateSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onUpdateSchool(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSchoolSubscriptionVariables,
  APITypes.OnUpdateSchoolSubscription
>;
export const onDeleteSchool = /* GraphQL */ `subscription OnDeleteSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onDeleteSchool(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSchoolSubscriptionVariables,
  APITypes.OnDeleteSchoolSubscription
>;
export const onCreateExperience = /* GraphQL */ `subscription OnCreateExperience(
  $filter: ModelSubscriptionExperienceFilterInput
) {
  onCreateExperience(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateExperienceSubscriptionVariables,
  APITypes.OnCreateExperienceSubscription
>;
export const onUpdateExperience = /* GraphQL */ `subscription OnUpdateExperience(
  $filter: ModelSubscriptionExperienceFilterInput
) {
  onUpdateExperience(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateExperienceSubscriptionVariables,
  APITypes.OnUpdateExperienceSubscription
>;
export const onDeleteExperience = /* GraphQL */ `subscription OnDeleteExperience(
  $filter: ModelSubscriptionExperienceFilterInput
) {
  onDeleteExperience(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteExperienceSubscriptionVariables,
  APITypes.OnDeleteExperienceSubscription
>;
export const onCreateSkill = /* GraphQL */ `subscription OnCreateSkill($filter: ModelSubscriptionSkillFilterInput) {
  onCreateSkill(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSkillSubscriptionVariables,
  APITypes.OnCreateSkillSubscription
>;
export const onUpdateSkill = /* GraphQL */ `subscription OnUpdateSkill($filter: ModelSubscriptionSkillFilterInput) {
  onUpdateSkill(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSkillSubscriptionVariables,
  APITypes.OnUpdateSkillSubscription
>;
export const onDeleteSkill = /* GraphQL */ `subscription OnDeleteSkill($filter: ModelSubscriptionSkillFilterInput) {
  onDeleteSkill(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSkillSubscriptionVariables,
  APITypes.OnDeleteSkillSubscription
>;
export const onCreateEngagement = /* GraphQL */ `subscription OnCreateEngagement(
  $filter: ModelSubscriptionEngagementFilterInput
) {
  onCreateEngagement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEngagementSubscriptionVariables,
  APITypes.OnCreateEngagementSubscription
>;
export const onUpdateEngagement = /* GraphQL */ `subscription OnUpdateEngagement(
  $filter: ModelSubscriptionEngagementFilterInput
) {
  onUpdateEngagement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEngagementSubscriptionVariables,
  APITypes.OnUpdateEngagementSubscription
>;
export const onDeleteEngagement = /* GraphQL */ `subscription OnDeleteEngagement(
  $filter: ModelSubscriptionEngagementFilterInput
) {
  onDeleteEngagement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEngagementSubscriptionVariables,
  APITypes.OnDeleteEngagementSubscription
>;
export const onCreateSummary = /* GraphQL */ `subscription OnCreateSummary($filter: ModelSubscriptionSummaryFilterInput) {
  onCreateSummary(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSummarySubscriptionVariables,
  APITypes.OnCreateSummarySubscription
>;
export const onUpdateSummary = /* GraphQL */ `subscription OnUpdateSummary($filter: ModelSubscriptionSummaryFilterInput) {
  onUpdateSummary(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSummarySubscriptionVariables,
  APITypes.OnUpdateSummarySubscription
>;
export const onDeleteSummary = /* GraphQL */ `subscription OnDeleteSummary($filter: ModelSubscriptionSummaryFilterInput) {
  onDeleteSummary(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSummarySubscriptionVariables,
  APITypes.OnDeleteSummarySubscription
>;
