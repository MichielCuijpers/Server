import { config } from 'dotenv';
import { ConfigurationValidator } from './validators/configuration';

export function LoadConfiguration(): void {

    config();

    const configurationValidator = new ConfigurationValidator();
    configurationValidator.validate();
}
