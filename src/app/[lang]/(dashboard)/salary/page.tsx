'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import SalaryList from "@/views/apps/salary/list"
import useSWR from "swr";


const SalaryListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/salaries', fetcher,{
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
  return <SalaryList datas={data?.data}/>
}

export default SalaryListApp
