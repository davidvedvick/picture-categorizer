export default interface Encoder {
    encode(rawPassword: string): Promise<string>

    matches(rawPassword: string, encodedPassword: string): Promise<boolean>
}