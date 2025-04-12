
'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import RewardList from "@/views/apps/reward/list"
import useSWR from "swr";

const RewardListApp = () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/rewards', fetcher,{
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
  return <RewardList datas={data?.data?.rewards} />
}

export default RewardListApp
