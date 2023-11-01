interface Sort {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean,
}

interface Pageable {
    sort: Sort,
    offset: Number,
    pageNumber: Number,
    pageSize: Number,
    paged: boolean,
    unpaged: boolean,
}

export interface Page<T> {
    content: T[],
    pageable: Pageable,
    first: boolean,
    last: boolean,
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    size: number,
    number: number,
    sort: Sort,
}