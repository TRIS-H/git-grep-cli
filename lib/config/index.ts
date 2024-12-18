export enum SearchType {
    Message = 'message',
    Content = 'content',
    All = 'all'
}

export enum HashType {
    Blob = 'blob',
    Commit = 'commit'
}

/** 管道并发数 */
export const PIPE_CONCURRENCY = 50;