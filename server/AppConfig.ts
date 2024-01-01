import type { EncoderConfig } from "./security/EncoderConfig.js";
import { createRequire } from "node:module";
import { AuthenticationConfiguration } from "./security/AuthenticationConfiguration.js";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function isFileAccessible(file: fs.PathLike) {
    try {
        fs.accessSync(file, fs.constants.R_OK);
        return true;
    } catch (e) {
        console.warn(`An error occurred checking if ${file} is accessible.`, e);
        return false;
    }
}

export interface AppConfig {
    authentication: AuthenticationConfiguration;
    db: { file: string };
    security: {
        encoder: EncoderConfig;
        wellKnownLocation: string;
    };
}

let config = {
    security: {
        encoder: {
            saltGenerations: 10,
        },
    },
} as AppConfig;

const appConfigFile = join(__dirname, "./app-config.json");
if (isFileAccessible(appConfigFile)) {
    const require = createRequire(import.meta.url);
    config = Object.assign(config, require(appConfigFile));
}

export default {
    authentication: {
        secret: process.env.APP_AUTHENTICATION_SECRET ?? config.authentication.secret,
    },
    db: {
        file: process.env.SQLITE_DB_FILE ?? config.db.file ?? "pics.db",
    },
    security: {
        encoder: {
            saltGenerations: process.env.SALT_GENERATIONS ?? config.security.encoder.saltGenerations,
        },
        wellKnownLocation: process.env.WELL_KNOWN_LOCATION ?? config.security.wellKnownLocation,
    },
} as AppConfig;
