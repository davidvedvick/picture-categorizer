import {ManageJwtTokens} from "./ManageJwtTokens.js";
import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {JwtToken} from "./JwtToken.js";
import jwt, {JwtPayload, Secret, SignOptions, VerifyOptions} from 'jsonwebtoken';
import {AuthenticationConfiguration} from "./AuthenticationConfiguration.js";
import * as util from "util";

const bearer = "Bearer";
const expirationDuration = 86_400_000 // 1 day

const promiseSigning = util.promisify<string | Buffer | object, Secret, SignOptions, string | undefined>(jwt.sign);
const promiseVerification = util.promisify<string, Secret, VerifyOptions, JwtPayload | string | undefined>(jwt.verify);

export class JwtTokenManagement implements ManageJwtTokens {

    constructor(private readonly configuration: AuthenticationConfiguration) {}

    async decodeToken(token: string): Promise<AuthenticatedCatEmployee | null> {
        const decoded = await promiseVerification(
            token.substring(bearer.length).trim(),
            this.configuration.secret,
            {
                algorithms: [ 'HS512' ]
            });

        if (!decoded) return null;

        const payload = decoded as JwtPayload;

        if (!payload.sub) return null;

        return new AuthenticatedCatEmployee(decoded.sub as string, "");
    }

    async generateToken(authenticatedEmployee: AuthenticatedCatEmployee): Promise<JwtToken | null> {
        const expiration = Math.floor(Date.now() / 1000) + expirationDuration;

        const token = await promiseSigning(
            {},
            this.configuration.secret,
            {
                algorithm: 'HS512',
                subject: authenticatedEmployee.email,
                expiresIn: expiration,
            });

        if (!token) return null;

        return {
            token: token,
            expiresInMs: expiration,
        };
    }
}