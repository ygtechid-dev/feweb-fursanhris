
'use client'
/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

import { fetcher } from "@/configs/config"
import LeaveList from "@/views/apps/leave/list"
import useSWR from "swr"


const LeaveListApp =  () => {
  const { data, error, isLoading, mutate } = useSWR('/web/leaves', fetcher,{
    // Enable auto refresh every 5 seconds
    refreshInterval: 5000,
    // Revalidate on focus
    revalidateOnFocus: true,
    // Revalidate on reconnect
    revalidateOnReconnect: true
  })

  if (error) {
    return <div>Failed to load leaves data</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <LeaveList datas={data?.data} mutate={mutate}/>
}

export default LeaveListApp
