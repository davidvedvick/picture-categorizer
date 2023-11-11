export interface Page<T> {
    content: T[],
    number: number,
    last: boolean,
}