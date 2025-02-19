// app/layout.tsx
import { Suspense } from 'react'
import Button from '@mui/material/Button'
import type { ChildrenType } from '@core/types'
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import Providers from '@components/Providers'
import { AuthProvider, useAuth } from '@components/AuthProvider'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import Loading from '@/components/Loading'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { i18n, Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { DictionaryProvider } from '@/components/dictionary-provider/DictionaryContext'

const Layout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  const direction = i18n.langDirection[params.lang]
  const dictionary = await getDictionary(params.lang)
  const mode = getMode()
  const systemMode = getSystemMode()
  
  return (
    <Providers direction={direction}>
      <AuthProvider lang={params.lang}>
        <DictionaryProvider dictionary={dictionary}>
          <Suspense fallback={<Loading />}>
            <ProtectedRoute lang={params.lang}> 
              <LayoutWrapper
                systemMode={systemMode}
                verticalLayout={
                  <VerticalLayout
                    navigation={<Navigation mode={mode} systemMode={systemMode} dictionary={dictionary}/>}
                    navbar={<Navbar />}
                    footer={<VerticalFooter />}
                  >
                    {children}
                  </VerticalLayout>
                }
                horizontalLayout={
                  <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
                    {children}
                  </HorizontalLayout>
                }
              />
            </ProtectedRoute>
            <ScrollToTop className='mui-fixed'>
              <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
              >
                <i className='tabler-arrow-up' />
              </Button>
            </ScrollToTop>
          </Suspense>
        </DictionaryProvider>
      </AuthProvider>
    </Providers>
  )
}

export default Layout
