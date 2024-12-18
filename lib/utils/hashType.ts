import { SearchType } from "../config"

export function isContentType(type: string) {
    return type === SearchType.Content
}

export function isMessageType(type: string) {
    return type === SearchType.Message
}

export function isAllType(type: string) {
    return type === SearchType.All
}