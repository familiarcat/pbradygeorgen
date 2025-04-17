Object.defineProperty(exports, "__esModule", { value: true })
exports.default = void 0
const awsmobile = {
  aws_project_region: "us-east-2",
  aws_appsync_graphqlEndpoint:
    "https://y7iyt2yhqbdq3nart45f2dbrwy.appsync-api.us-east-2.amazonaws.com/graphql",
  aws_appsync_region: "us-east-2",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-azedmtw44jhx5euoatvecwxoca",
  aws_cognito_identity_pool_id: "us-east-2:ab42b614-4919-4758-908c-07495c4fbb2a",
  aws_cognito_region: "us-east-2",
  aws_user_pools_id: "us-east-2_UtlM2FvFc",
  aws_user_pools_web_client_id: "58hshh97ikhf5pqdl05t370kq0",
  oauth: {},
  aws_cognito_username_attributes: ["EMAIL"],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL", "NAME"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      "REQUIRES_LOWERCASE",
      "REQUIRES_NUMBERS",
      "REQUIRES_SYMBOLS",
      "REQUIRES_UPPERCASE",
    ],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
  aws_user_files_s3_bucket: "resume-builder-storage-1a31979823421-staging",
  aws_user_files_s3_bucket_region: "us-east-2",
}
const _default = awsmobile
exports.default = _default
