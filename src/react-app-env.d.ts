/// <reference types="react-scripts" />

import { Dispatch } from "react"

export type Nullable<T> = T | null | undefined
export type ReactState<T> = [T, Dispatch<T>]
export type RequestQueryParams = {
  [name: string]: string | number | null | undefined
}
