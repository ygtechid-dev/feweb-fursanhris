
'use client'


import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
import { fetcher } from "@/configs/config"
import AssetList from "@/views/apps/asset/list"
import useSWR from "swr"

const AssetApp =  () => {
    const {dictionary} = useDictionary();
  
  const { data, error, isLoading, mutate } = useSWR('/web/assets', fetcher,{
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

  return <AssetList datas={data?.data}/>
}

export default AssetApp
