import { AAD_LOGGING_LEVEL } from '../utils/config/aad.config';

export interface IAzureADConfig {
  identityMetadata: string;
  clientID: string;
  clientSecret: string;
  validateIssuer: boolean;
  passReqToCallback: boolean;
  issuer: string;
  audience: string;
  allowMultiAudiencesInToken: string;
  loggingLevel: AAD_LOGGING_LEVEL;
  loggingNoPII: boolean;
  scope: string;
}
