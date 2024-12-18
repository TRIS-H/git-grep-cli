export enum SearchType {
    Message = 'message',
    Content = 'content',
    All = 'all'
}

export enum HashType {
    Blob = 'blob',
    Commit = 'commit',
    Tree = 'tree'
}

/** 管道并发数 */
export const PIPE_CONCURRENCY = 50;

export const isWindows = process.platform === 'win32';