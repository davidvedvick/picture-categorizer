export default interface Encoder {
    encode(rawPassword: string): string

    matches(rawPassword: string, encodedPassword: string): boolean
}