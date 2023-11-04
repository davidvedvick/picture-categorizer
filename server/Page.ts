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
    last: boolean,
}