// Third-party Imports
import 'server-only'

// Type Imports
import type { Locale } from '@configs/i18n'

const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  ms: () => import('@/data/dictionaries/ms.json').then(module => module.default),
  ar: () => import('@/data/dictionaries/ar.json').then(module => module.default),
  id: () => import('@/data/dictionaries/id.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
