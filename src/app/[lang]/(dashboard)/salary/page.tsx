'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import SalaryList from "@/views/apps/salary/list"
import useSWR from "swr";


const SalaryListApp =  () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/salaries', fetcher,{
    // Kurangi refresh interval atau hapus jika tidak diperlukan
    refreshInterval: 10000, // 10 detik atau hapus baris ini
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    // Tambahkan dedupingInterval untuk mencegah request berlebihan
    dedupingInterval: 2000,
    
  })


  if (error) {
    return <div>{dictionary['content'].failedToLoadData}</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  return <SalaryList datas={data?.data} />
}

export default SalaryListApp
