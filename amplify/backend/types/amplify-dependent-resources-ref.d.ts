export type AmplifyDependentResourcesAttributes = {
  api: {
    resumebuilder: {
      GraphQLAPIEndpointOutput: "string"
      GraphQLAPIIdOutput: "string"
      GraphQLAPIKeyOutput: "string"
    }
  }
  auth: {
    resumebuilder: {
      AppClientID: "string"
      AppClientIDWeb: "string"
      IdentityPoolId: "string"
      IdentityPoolName: "string"
      UserPoolArn: "string"
      UserPoolId: "string"
      UserPoolName: "string"
    }
  }
  function: {
    openAI: {
      Arn: "string"
      LambdaExecutionRole: "string"
      LambdaExecutionRoleArn: "string"
      Name: "string"
      Region: "string"
    }
  }
  storage: {
    s3resumebuilderstorage1a319798: {
      BucketName: "string"
      Region: "string"
    }
  }
}
