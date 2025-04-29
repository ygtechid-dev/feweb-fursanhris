// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { getDictionary } from '@/utils/getDictionary'
import { useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const { user } = useAuth()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/${locale}/dashboard`} icon={<i className='tabler-smart-home' />}>
        {dictionary['navigation'].dashboard}
        </MenuItem>
        {/* <MenuSection label={'Administration'}> */}
        <MenuItem href={`/${locale}/users`} icon={<i className='tabler-users' />}>
          {dictionary['navigation'].user}
        </MenuItem>
        {/* </MenuSection> */}
        {/* <MenuSection label={'Super Admin'}> */}
        <SubMenu label={dictionary['navigation'].companies} icon={<i className='tabler-buildings' />}>
        {/* {user?.type == 'super admin' && (<MenuItem href={`/${locale}/companies`}>
          {dictionary['navigation'].companyList}
          </MenuItem>)} */}
          
        <MenuItem href={`/${locale}/companies/branches`}>
          {dictionary['navigation'].branches}
        </MenuItem>
        <MenuItem href={`/${locale}/companies/departments`}>
          {dictionary['navigation'].departments}
        </MenuItem>
        <MenuItem href={`/${locale}/companies/designations`}>
          {dictionary['navigation'].designations}
        </MenuItem>
        </SubMenu>
        {/* </MenuSection> */}
        {/* <MenuSection label={'Hrm'}> */}
        <MenuItem href={`/${locale}/employees`} icon={<i className='tabler-user' />}>
          {dictionary['navigation'].employees}
        </MenuItem>
        <MenuItem href={`/${locale}/attendances`} icon={<i className='tabler-transfer-in' />}>
        {dictionary['navigation'].attendances}
        </MenuItem>
        <MenuItem href={`/${locale}/leaves`} icon={<i className='tabler-door-exit' />}>
        {dictionary['navigation'].leaves}
        </MenuItem>
        <MenuItem href={`/${locale}/overtimes`} icon={<i className='tabler-clock' />}>
        {dictionary['navigation'].overtimes}
        </MenuItem>
        <MenuItem href={`/${locale}/assets`} icon={<i className='tabler-device-desktop-dollar' />}>
          {dictionary['navigation'].assets}
        </MenuItem>
        <MenuItem href={`/${locale}/reimbursements`} icon={<i className='tabler-moneybag' />}>
          {dictionary['navigation'].reimbursements}
        </MenuItem>

        <SubMenu label={dictionary['navigation'].payrolls} icon={<i className='tabler-wallet' />}>
          <MenuItem href={`/${locale}/salary`}>
          {dictionary['navigation'].employeeSalary}
          </MenuItem>
          <MenuItem href={`/${locale}/payslips`}>
          {dictionary['navigation'].payslip}
          </MenuItem>
        </SubMenu>
        <MenuItem href={`/${locale}/projects`} icon={<i className='tabler-chart-bar' />}>
        {dictionary['navigation'].projects}
        </MenuItem>
        <SubMenu label={dictionary['navigation'].hrAdminSetup} icon={<i className='tabler-settings-2' />}>
          <MenuItem href={`/${locale}/reward`}>
          {dictionary['navigation'].reward}
          </MenuItem>
          <MenuItem href={`/${locale}/resignation`}>
          {dictionary['navigation'].resignation}
          </MenuItem>
          <MenuItem href={`/${locale}/trip`}>
          {dictionary['navigation'].trip}
          </MenuItem>
          <MenuItem href={`/${locale}/promotion`}>
          {dictionary['navigation'].promotion}
          </MenuItem>
          <MenuItem href={`/${locale}/complaint`}>
          {dictionary['navigation'].complaint}
          </MenuItem>
          <MenuItem href={`/${locale}/warning`}>
          {dictionary['navigation'].warning}
          </MenuItem>
          <MenuItem href={`/${locale}/termination`}>
          {dictionary['navigation'].termination}
          </MenuItem>
        </SubMenu>
        {/* <MenuItem href={`/${locale}/documents`} icon={<i className='tabler-file' />}>
        {dictionary['navigation'].document}
        </MenuItem> */}

        {/* </MenuSection> */}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
