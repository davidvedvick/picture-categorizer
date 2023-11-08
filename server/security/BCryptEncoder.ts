import TextEncoder from "./Encoder.js";
import {EncoderConfig} from "./EncoderConfig.js";
import pkg from 'bcryptjs';

const { compare, genSalt, hash } = pkg;

export default class BCryptEncoder implements TextEncoder {

    private salt: string | null = null;

    constructor(private readonly encoderConfig: EncoderConfig) {

    }

    private async lazySalt() {
        return this.salt ?? (this.salt = await genSalt(this.encoderConfig.saltGenerations));
    }

    async encode(rawPassword: string): Promise<string> {
        return await hash(rawPassword, await this.lazySalt());
    }

    async matches(rawPassword: string, encodedPassword: string): Promise<boolean> {
        return await compare(rawPassword, encodedPassword);
    }
}