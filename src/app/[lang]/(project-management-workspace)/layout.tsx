// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import NavigationProject from '@/components/layout/vertical/NavigationProject'
import NavbarProject from '@/components/layout/vertical/NavbarProject'
import { AuthProvider } from '@/components/AuthProvider'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { i18n, Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { DictionaryProvider } from '@/components/dictionary-provider/DictionaryContext'

const Layout = async  ({ children, params }: ChildrenType & { params: { lang: Locale } })  => {
  // Vars
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
                        navigation={<NavigationProject mode={mode} systemMode={systemMode} dictionary={dictionary} />}
                        navbar={<NavbarProject />}
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
                  <ScrollToTop className='mui-fixed'>
                    <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
                      <i className='tabler-arrow-up' />
                    </Button>
                  </ScrollToTop>
              </ProtectedRoute>
            </Suspense>
         </DictionaryProvider>
      </AuthProvider>
    </Providers>
  )
}

export default Layout
