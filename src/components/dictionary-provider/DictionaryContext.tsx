"use client"

import { DictionaryType } from '@/@core/types'
import { getDictionary } from '@/utils/getDictionary'
import { createContext, useContext } from 'react'

const DictionaryContext = createContext<DictionaryType | undefined>(undefined)

export const DictionaryProvider = ({ children, dictionary }: {children: React.ReactNode ,dictionary: Awaited<ReturnType<typeof getDictionary>>}) => {
  return (
    <DictionaryContext.Provider value={{dictionary}}>
      {children}
    </DictionaryContext.Provider>
  )
}

export const useDictionary = () => {
  const context = useContext(DictionaryContext)
  if (!context) {
    throw new Error('useDictionary must be used within DictionaryProvider')
  }
  return context
}
