
'use client'
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"


import { fetcher } from "@/configs/config"
import LeaveList from "@/views/apps/leave/list"
import ReimbursementList from "@/views/apps/reimbursement/list"
import useSWR from "swr"


const ReimburseListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/reimbursements', fetcher,{
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
    return <div>{dictionary['content'].loading}...</div>
  }

  return <ReimbursementList datas={data?.data}/>
}

export default ReimburseListApp
