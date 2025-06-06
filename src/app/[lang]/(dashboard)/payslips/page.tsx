
'use client'


import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import PayslipList from "@/views/apps/payslips/list"
import useSWR from "swr";

const PayslipListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/payslips', fetcher,{
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    // Tambahkan ini untuk memaksa revalidasi
    revalidateIfStale: true,
    revalidateOnMount: true,
  })

  if (error) {
    return <div>{dictionary['content'].failedToLoadData}</div>
  }

  if (isLoading) {
    return <div>{dictionary['content'].loading}...</div>
  }

  return <PayslipList datas={data?.data} />
}

export default PayslipListApp
