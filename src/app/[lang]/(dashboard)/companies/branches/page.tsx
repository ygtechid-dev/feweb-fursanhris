"use client"
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
import { fetcher } from "@/configs/config"


import BranchList from "@/views/apps/branch/list"
import useSWR from "swr"


const BranchListApp = () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/branches', fetcher,{
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

  return <BranchList datas={data?.data} />
}

export default BranchListApp
