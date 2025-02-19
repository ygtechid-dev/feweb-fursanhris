// React Imports
import { getDictionary } from '@/utils/getDictionary'
import type { ReactNode } from 'react'

export type Layout = 'vertical' | 'collapsed' | 'horizontal'

export type Skin = 'default' | 'bordered'

export type Mode = 'system' | 'light' | 'dark'

export type SystemMode = 'light' | 'dark'

export type Direction = 'ltr' | 'rtl'

export type LayoutComponentWidth = 'compact' | 'wide'

export type LayoutComponentPosition = 'fixed' | 'static'

export type ChildrenType = {
  children: ReactNode
}
export type DictionaryType = {
 dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
