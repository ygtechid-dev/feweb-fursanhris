"use client"

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
import { fetcher } from "@/configs/config"
import DepartmentList from "@/views/apps/department/list"
import useSWR from "swr"

const DepartmentListApp =  () => {
    const {dictionary} = useDictionary();
  
  const { data, error, isLoading, mutate } = useSWR('/departments', fetcher,{
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

  return <DepartmentList datas={data?.data} />
}

export default DepartmentListApp
