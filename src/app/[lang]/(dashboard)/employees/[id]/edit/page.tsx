'use client'

import Grid from '@mui/material/Grid'
import { useForm, FormProvider } from 'react-hook-form'
import ProductAddHeader from '@/views/apps/employee/edit/ProductAddHeader'
import { Branch, Department, Designation, EmployeeFormData } from '@/types/apps/userTypes'
import PersonalDetail from '@/views/apps/employee/edit/PersonalDetail'

import BankAccount from '@/views/apps/employee/edit/BankAccount'
import Document from '@/views/apps/employee/edit/Document'
import { getEmployeeById, updateEmployee } from '@/services/employeeService'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useRouter, useParams } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CompanyDetail from '@/views/apps/employee/edit/CompanyDetail'
import Family from '@/views/apps/employee/add/Family'

interface InitialOptions {
    branches: Branch[]
    departments: Department[]
    designations: Designation[]
  }

const EmployeeEdit = () => {
  // States
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [options, setOptions] = useState<InitialOptions>({
    branches: [], // Initialize as empty arrays instead of empty objects
    departments: [],
    designations: []
  })

  // Hooks
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const params = useParams()
  const employeeId = params?.id
  const lang = params?.lang

  const methods = useForm<EmployeeFormData>({
    defaultValues: {
      name: '',
      phone: '',
      dob: '',
      gender: '',
      email: '',
      password: '',
      address: '',
      employee_id: '',
      branch_id: '',
      department_id: '',
      designation_id: '',
      company_doj: '',
      status: '',
      account_holder_name: '',
      account_number: '',
      bank_name: '',
      bank_identifier_code: '',
      branch_location: '',
      tax_payer_id: '',
      documents: { certificate: '', photo: '' },
        family_name: '',
      family_address: '',
      family_phone: '',
    }
  })

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!employeeId) {
          throw new Error('Employee ID is required')
        }

        const response = await getEmployeeById(employeeId as string)
        
        if (response.status && response.data) {
          const { employee, branches, departments, designations } = response.data
          
          // Store options for dropdowns
          setOptions({
            branches,
            departments,
            designations
          })
          
          // Format employee data for form
          const formattedData = {
            ...employee,
            branch_id: employee.branch_id,
            department_id: employee.department_id,
            designation_id: employee.designation_id,
            dob: employee.dob ? moment(employee.dob).format('YYYY-MM-DD') : '',
            company_doj: employee.company_doj ? moment(employee.company_doj).format('YYYY-MM-DD') : '',
            documents: employee.documents
          }

          methods.setValue('branch_id', employee.branch_id)
          methods.setValue('department_id', employee.department_id)
          methods.setValue('designation_id', employee.designation_id)
console.log({formattedData})
          // Reset form with formatted data
          methods.reset(formattedData)
        }
      } catch (err: any) {
        console.error('Fetch error:', err)
        setError(err?.message || 'Failed to fetch employee data')
        toast.error('Error loading employee data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployeeData()
  }, [employeeId, methods])

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (!employeeId) {
        throw new Error('Employee ID is required')
      }

      const formattedData = {
        ...data,
        dob: data.dob ? moment(data.dob).format('YYYY-MM-DD') : '',
        company_doj: data.company_doj ? moment(data.company_doj).format('YYYY-MM-DD') : '',
        // Convert string IDs back to numbers if your API expects numbers
        branch_id: data.branch_id ? data.branch_id : '',
        department_id: data.department_id ?data.department_id : '',
        designation_id: data.designation_id ?data.designation_id : ''
      }

      const res = await updateEmployee(employeeId as string, formattedData)
      console.log({res})
      if (res.status) {
        await mutate('/web/employees')
        toast.success(res?.message || 'Employee updated successfully')
        router.push(`/${lang}/employees`)
      }
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error?.response?.data?.message || 'Failed to update employee')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-error">{error}</p>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProductAddHeader onSubmit={methods.handleSubmit(onSubmit)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PersonalDetail />
        </Grid>
        <Grid item xs={12} md={6}>
          <CompanyDetail
            // initialOptions={{
            //     branches: options.branches,
            //     departments: options.departments,
            //     designations: options.designations
            // }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Document />
        </Grid>
        <Grid item xs={12} md={6}>
          <BankAccount />
        </Grid>
        <Grid item xs={12} md={6}>
            <Family />
          </Grid>
      </Grid>
    </FormProvider>
  )
}

export default EmployeeEdit
