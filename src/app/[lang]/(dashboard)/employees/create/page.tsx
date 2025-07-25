'use client'

import Grid from '@mui/material/Grid'
import { useForm, FormProvider } from 'react-hook-form'
import ProductAddHeader from '@/views/apps/employee/add/ProductAddHeader'
import { EmployeeFormData } from '@/types/apps/userTypes'
import PersonalDetail from '@/views/apps/employee/add/PersonalDetail'
import CompanyDetail from '@/views/apps/employee/add/CompanyDetail'
import BankAccount from '@/views/apps/employee/add/BankAccount'
import Document from '@/views/apps/employee/add/Document'
import { postEmployees, postEmployeesWithFiles } from '@/services/employeeService'
import { toast } from 'react-toastify'
import moment from 'moment'                                               
import { useParams, useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { toFormData } from '@/utils/toFormData'
import Family from '@/views/apps/employee/add/Family'


const EmployeeAdd = () => {
  const { mutate } = useSWRConfig()
  const { lang:locale} = useParams();

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
      branch_id: ``, 
      department_id: ``, 
      designation_id: ``, 
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

  const router = useRouter()

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const formattedData = {
        ...data,
        dob: data.dob ? moment(data.dob).format('YYYY-MM-DD') : '',
        company_doj: data.company_doj ? moment(data.company_doj).format('YYYY-MM-DD') : ''
      }
      
      const res = await postEmployeesWithFiles(toFormData(formattedData));

      if (res.status) {
        mutate('/web/employees')
        toast.success(res?.message)
        router.replace(`/${locale}/employees`)
      }

    } catch (error) {
      console.log({error})
      toast.error('Something went wrong!')
    }
  }

  return (
    <FormProvider {...methods}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProductAddHeader onSubmit={methods.handleSubmit(onSubmit)}/> {/* Tidak perlu props tambahan karena pakai context */}
          </Grid>
          <Grid item xs={12} md={6}>
            <PersonalDetail />
          </Grid>
          <Grid item xs={12} md={6}>
            <CompanyDetail />
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

export default EmployeeAdd
