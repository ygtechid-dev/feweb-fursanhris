
'use client'
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"


import { fetcher } from "@/configs/config"
import LeaveList from "@/views/apps/leave/list"
import useSWR from "swr"


const LeaveListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/leaves', fetcher,{
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

  return <LeaveList datas={data?.data}/>
}

export default LeaveListApp
