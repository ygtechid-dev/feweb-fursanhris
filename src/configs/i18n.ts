export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar', 'id', 'ms'],
  languageData:[
    {
      langCode: 'en',
      langName: 'English'
    },
    {
      langCode: 'ms',
      langName: 'Melayu'
    },
    {
      langCode: 'ar',
      langName: 'Arabic'
    },
    {
      langCode: 'id',
      langName: 'Indonesia'
    }
  ],
  langDirection: {
    en: 'ltr',
    id: 'ltr',
    ar: 'rtl',
    ms: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
