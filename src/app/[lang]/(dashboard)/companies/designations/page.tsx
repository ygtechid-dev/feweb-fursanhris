"use client"

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
import { fetcher } from "@/configs/config"
import DesignationList from "@/views/apps/designation/list"
import useSWR from "swr"

const DesignationListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/designations', fetcher,{
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

  return <DesignationList datas={data?.data}  />
}

export default DesignationListApp
