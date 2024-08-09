/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../src/API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createReference = /* GraphQL */ `mutation CreateReference(
  $input: CreateReferenceInput!
  $condition: ModelReferenceConditionInput
) {
  createReference(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateReferenceMutationVariables,
  APITypes.CreateReferenceMutation
>;
export const updateReference = /* GraphQL */ `mutation UpdateReference(
  $input: UpdateReferenceInput!
  $condition: ModelReferenceConditionInput
) {
  updateReference(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateReferenceMutationVariables,
  APITypes.UpdateReferenceMutation
>;
export const deleteReference = /* GraphQL */ `mutation DeleteReference(
  $input: DeleteReferenceInput!
  $condition: ModelReferenceConditionInput
) {
  deleteReference(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteReferenceMutationVariables,
  APITypes.DeleteReferenceMutation
>;
export const createContactInformation = /* GraphQL */ `mutation CreateContactInformation(
  $input: CreateContactInformationInput!
  $condition: ModelContactInformationConditionInput
) {
  createContactInformation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateContactInformationMutationVariables,
  APITypes.CreateContactInformationMutation
>;
export const updateContactInformation = /* GraphQL */ `mutation UpdateContactInformation(
  $input: UpdateContactInformationInput!
  $condition: ModelContactInformationConditionInput
) {
  updateContactInformation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateContactInformationMutationVariables,
  APITypes.UpdateContactInformationMutation
>;
export const deleteContactInformation = /* GraphQL */ `mutation DeleteContactInformation(
  $input: DeleteContactInformationInput!
  $condition: ModelContactInformationConditionInput
) {
  deleteContactInformation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteContactInformationMutationVariables,
  APITypes.DeleteContactInformationMutation
>;
export const createResume = /* GraphQL */ `mutation CreateResume(
  $input: CreateResumeInput!
  $condition: ModelResumeConditionInput
) {
  createResume(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateResumeMutationVariables,
  APITypes.CreateResumeMutation
>;
export const updateResume = /* GraphQL */ `mutation UpdateResume(
  $input: UpdateResumeInput!
  $condition: ModelResumeConditionInput
) {
  updateResume(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateResumeMutationVariables,
  APITypes.UpdateResumeMutation
>;
export const deleteResume = /* GraphQL */ `mutation DeleteResume(
  $input: DeleteResumeInput!
  $condition: ModelResumeConditionInput
) {
  deleteResume(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteResumeMutationVariables,
  APITypes.DeleteResumeMutation
>;
export const createEducation = /* GraphQL */ `mutation CreateEducation(
  $input: CreateEducationInput!
  $condition: ModelEducationConditionInput
) {
  createEducation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEducationMutationVariables,
  APITypes.CreateEducationMutation
>;
export const updateEducation = /* GraphQL */ `mutation UpdateEducation(
  $input: UpdateEducationInput!
  $condition: ModelEducationConditionInput
) {
  updateEducation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEducationMutationVariables,
  APITypes.UpdateEducationMutation
>;
export const deleteEducation = /* GraphQL */ `mutation DeleteEducation(
  $input: DeleteEducationInput!
  $condition: ModelEducationConditionInput
) {
  deleteEducation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEducationMutationVariables,
  APITypes.DeleteEducationMutation
>;
export const createDegree = /* GraphQL */ `mutation CreateDegree(
  $input: CreateDegreeInput!
  $condition: ModelDegreeConditionInput
) {
  createDegree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDegreeMutationVariables,
  APITypes.CreateDegreeMutation
>;
export const updateDegree = /* GraphQL */ `mutation UpdateDegree(
  $input: UpdateDegreeInput!
  $condition: ModelDegreeConditionInput
) {
  updateDegree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDegreeMutationVariables,
  APITypes.UpdateDegreeMutation
>;
export const deleteDegree = /* GraphQL */ `mutation DeleteDegree(
  $input: DeleteDegreeInput!
  $condition: ModelDegreeConditionInput
) {
  deleteDegree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDegreeMutationVariables,
  APITypes.DeleteDegreeMutation
>;
export const createCompany = /* GraphQL */ `mutation CreateCompany(
  $input: CreateCompanyInput!
  $condition: ModelCompanyConditionInput
) {
  createCompany(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCompanyMutationVariables,
  APITypes.CreateCompanyMutation
>;
export const updateCompany = /* GraphQL */ `mutation UpdateCompany(
  $input: UpdateCompanyInput!
  $condition: ModelCompanyConditionInput
) {
  updateCompany(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCompanyMutationVariables,
  APITypes.UpdateCompanyMutation
>;
export const deleteCompany = /* GraphQL */ `mutation DeleteCompany(
  $input: DeleteCompanyInput!
  $condition: ModelCompanyConditionInput
) {
  deleteCompany(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCompanyMutationVariables,
  APITypes.DeleteCompanyMutation
>;
export const createAccomplishment = /* GraphQL */ `mutation CreateAccomplishment(
  $input: CreateAccomplishmentInput!
  $condition: ModelAccomplishmentConditionInput
) {
  createAccomplishment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAccomplishmentMutationVariables,
  APITypes.CreateAccomplishmentMutation
>;
export const updateAccomplishment = /* GraphQL */ `mutation UpdateAccomplishment(
  $input: UpdateAccomplishmentInput!
  $condition: ModelAccomplishmentConditionInput
) {
  updateAccomplishment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAccomplishmentMutationVariables,
  APITypes.UpdateAccomplishmentMutation
>;
export const deleteAccomplishment = /* GraphQL */ `mutation DeleteAccomplishment(
  $input: DeleteAccomplishmentInput!
  $condition: ModelAccomplishmentConditionInput
) {
  deleteAccomplishment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAccomplishmentMutationVariables,
  APITypes.DeleteAccomplishmentMutation
>;
export const createSchool = /* GraphQL */ `mutation CreateSchool(
  $input: CreateSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  createSchool(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSchoolMutationVariables,
  APITypes.CreateSchoolMutation
>;
export const updateSchool = /* GraphQL */ `mutation UpdateSchool(
  $input: UpdateSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  updateSchool(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSchoolMutationVariables,
  APITypes.UpdateSchoolMutation
>;
export const deleteSchool = /* GraphQL */ `mutation DeleteSchool(
  $input: DeleteSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  deleteSchool(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSchoolMutationVariables,
  APITypes.DeleteSchoolMutation
>;
export const createExperience = /* GraphQL */ `mutation CreateExperience(
  $input: CreateExperienceInput!
  $condition: ModelExperienceConditionInput
) {
  createExperience(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateExperienceMutationVariables,
  APITypes.CreateExperienceMutation
>;
export const updateExperience = /* GraphQL */ `mutation UpdateExperience(
  $input: UpdateExperienceInput!
  $condition: ModelExperienceConditionInput
) {
  updateExperience(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateExperienceMutationVariables,
  APITypes.UpdateExperienceMutation
>;
export const deleteExperience = /* GraphQL */ `mutation DeleteExperience(
  $input: DeleteExperienceInput!
  $condition: ModelExperienceConditionInput
) {
  deleteExperience(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteExperienceMutationVariables,
  APITypes.DeleteExperienceMutation
>;
export const createSkill = /* GraphQL */ `mutation CreateSkill(
  $input: CreateSkillInput!
  $condition: ModelSkillConditionInput
) {
  createSkill(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSkillMutationVariables,
  APITypes.CreateSkillMutation
>;
export const updateSkill = /* GraphQL */ `mutation UpdateSkill(
  $input: UpdateSkillInput!
  $condition: ModelSkillConditionInput
) {
  updateSkill(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSkillMutationVariables,
  APITypes.UpdateSkillMutation
>;
export const deleteSkill = /* GraphQL */ `mutation DeleteSkill(
  $input: DeleteSkillInput!
  $condition: ModelSkillConditionInput
) {
  deleteSkill(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSkillMutationVariables,
  APITypes.DeleteSkillMutation
>;
export const createEngagement = /* GraphQL */ `mutation CreateEngagement(
  $input: CreateEngagementInput!
  $condition: ModelEngagementConditionInput
) {
  createEngagement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEngagementMutationVariables,
  APITypes.CreateEngagementMutation
>;
export const updateEngagement = /* GraphQL */ `mutation UpdateEngagement(
  $input: UpdateEngagementInput!
  $condition: ModelEngagementConditionInput
) {
  updateEngagement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEngagementMutationVariables,
  APITypes.UpdateEngagementMutation
>;
export const deleteEngagement = /* GraphQL */ `mutation DeleteEngagement(
  $input: DeleteEngagementInput!
  $condition: ModelEngagementConditionInput
) {
  deleteEngagement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEngagementMutationVariables,
  APITypes.DeleteEngagementMutation
>;
export const createSummary = /* GraphQL */ `mutation CreateSummary(
  $input: CreateSummaryInput!
  $condition: ModelSummaryConditionInput
) {
  createSummary(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSummaryMutationVariables,
  APITypes.CreateSummaryMutation
>;
export const updateSummary = /* GraphQL */ `mutation UpdateSummary(
  $input: UpdateSummaryInput!
  $condition: ModelSummaryConditionInput
) {
  updateSummary(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSummaryMutationVariables,
  APITypes.UpdateSummaryMutation
>;
export const deleteSummary = /* GraphQL */ `mutation DeleteSummary(
  $input: DeleteSummaryInput!
  $condition: ModelSummaryConditionInput
) {
  deleteSummary(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSummaryMutationVariables,
  APITypes.DeleteSummaryMutation
>;
