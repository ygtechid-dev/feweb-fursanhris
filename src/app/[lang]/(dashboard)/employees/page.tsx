'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"

import { fetcher } from "@/configs/config"
import EmployeeList from "@/views/apps/employee/list"
import useSWR from 'swr'

const EmployeeListApp = () => {
  // Vars
  const { dictionary } = useDictionary()
  const { data, error, isLoading } = useSWR('/web/employees', fetcher,{
    // Enable auto refresh every 5 seconds
    refreshInterval: 5000,
    // Revalidate on focus
    revalidateOnFocus: true,
    // Revalidate on reconnect
    revalidateOnReconnect: true
  })

  if (error) {
    return <div>{dictionary['content'].failedToLoadData}</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <EmployeeList userData={data?.data}/>
}

export default EmployeeListApp
