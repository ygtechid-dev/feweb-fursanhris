'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import ResignationList from "@/views/apps/resignation/list"
import useSWR from "swr";

const ResignationListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/resignations', fetcher,{
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

  return <ResignationList datas={data?.data?.resignations} />
}

export default ResignationListApp
