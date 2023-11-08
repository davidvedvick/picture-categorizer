import config from './app-config.json';
import type {EncoderConfig} from "./security/EncoderConfig.js";

export interface AppConfig {
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