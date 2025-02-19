// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import { PublicRoute } from '@/components/PublicRoute'
import { AuthProvider } from '@/components/AuthProvider'
import { i18n, Locale } from '@/configs/i18n'

type Props = ChildrenType

const Layout = ({ children, params }: Props & { params: { lang: Locale } }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
       <AuthProvider lang={params.lang}>
        <PublicRoute lang={params.lang}>
          <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
        </PublicRoute>
       </AuthProvider>
    </Providers>
  )
}

export default Layout
