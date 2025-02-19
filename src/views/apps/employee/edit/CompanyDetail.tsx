// views/apps/employee/add/CompanyDetail.tsx
'use client'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { MenuItem } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import QTextField from '@/@core/components/mui/QTextField'
import QReactDatepicker from '@/@core/components/mui/QReactDatepicker'
import { fetchBranches, fetchDepartmentsByBranch, fetchDesignationsByDepartment } from '@/services/employeeService'
import { Branch, Department, Designation } from '@/types/apps/userTypes'
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'

const CompanyDetail = () => {
  const { register, formState: { errors }, control, watch, setValue } = useFormContext()
  
  const [branches, setBranches] = useState<Branch[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const {dictionary} = useDictionary();

  const branchId = watch('branch_id')
  const departmentId = watch('department_id')
  const designationId = watch('designation_id')

  // Fetch branches on component mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setIsLoading(true)
        const branchData = await fetchBranches()
        setBranches(branchData)

        
        // setValue('department_id', '')
        // setValue('designation_id', '')
      } catch (error) {
        console.error('Error loading branches:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBranches()
  }, [])

  // Fetch departments when branch changes
  useEffect(() => {
    const loadDepartments = async () => {
      if (!branchId) {
        setDepartments([])
        setValue('department_id', '')
        return
      }

      try {
        setIsLoading(true)
        const departmentData = await fetchDepartmentsByBranch(branchId)
        setDepartments(departmentData)
      } catch (error) {
        console.error('Error loading departments:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDepartments()
  }, [branchId, setValue])

  // Fetch designations when department changes
  useEffect(() => {
    const loadDesignations = async () => {
      if (!branchId || !departmentId) {
        setDesignations([])
        setValue('designation_id', '')
        return
      }

      try {
        setIsLoading(true)
        const designationData = await fetchDesignationsByDepartment(branchId, departmentId)
        setDesignations(designationData)
      } catch (error) {
        console.error('Error loading designations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDesignations()
  }, [branchId, departmentId, setValue])

  return (
    <Card>
      <CardHeader title={`${dictionary['content'].company} ${dictionary['content'].detail}`} />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid item xs={12} sm={12}>
            <QTextField
              name='employee_id'
              control={control}
              fullWidth
              readonly
              label={dictionary['content'].employeeId}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
              name='branch_id'
              control={control}
              fullWidth
              required
              label={dictionary['content'].branch}
              select
              disabled={isLoading}
            >
              <MenuItem value="">Select Branch</MenuItem>
              {branches.map(branch => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </QTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
              name='department_id'
              control={control}
              fullWidth
              required
              label={dictionary['content'].department}
              select
              disabled={!branchId || isLoading}
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map(department => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </QTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <QTextField
              name='designation_id'
              control={control}
              fullWidth
              required
              label={dictionary['content'].designation}
              select
              disabled={!departmentId || isLoading}
            >
              <MenuItem value="">Select Designation</MenuItem>
              {designations.map(designation => (
                <MenuItem key={designation.id} value={designation.id}>
                  {designation.name}
                </MenuItem>
              ))}
            </QTextField>
          </Grid>
          <Grid item xs={12} sm={12}>
            <QReactDatepicker
              name='company_doj'
              control={control}
              label={dictionary['content'].companyDateofJoining}
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CompanyDetail
