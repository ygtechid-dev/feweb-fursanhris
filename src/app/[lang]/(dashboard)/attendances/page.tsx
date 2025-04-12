
"use client"
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"


import { fetcher } from "@/configs/config"
import AttendanceList from "@/views/apps/attendances/list"
import useSWR from "swr"

const AttendanceListApp = () => {
   const {dictionary} = useDictionary();
  // Vars
  const { data, error, isLoading, mutate } = useSWR('/web/attendance-employee', fetcher,{
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

  return <AttendanceList datas={data?.data?.attendanceEmployee} mutate={mutate} />
}

export default AttendanceListApp
