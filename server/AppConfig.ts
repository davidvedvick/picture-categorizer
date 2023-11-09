import type {EncoderConfig} from "./security/EncoderConfig.js";
import {createRequire} from 'node:module';
import {AuthenticationConfiguration} from "./security/AuthenticationConfiguration.js";

const require = createRequire(import.meta.url);
const config = require('./app-config.json');

export interface AppConfig {
    authentication: AuthenticationConfiguration;
    db: {
        host: string,
        database: string,
        port: number,
        user: string,
        password: string,
    },
    security: {
        encoder: EncoderConfig,
    }
}

export default config as AppConfig;