"use client"
import { fetcher } from "@/configs/config"
/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

import BranchList from "@/views/apps/branch/list"
import useSWR from "swr"


const BranchListApp = () => {
  const { data, error, isLoading, mutate } = useSWR('/branches', fetcher,{
    // Enable auto refresh every 5 seconds
    refreshInterval: 5000,
    // Revalidate on focus
    revalidateOnFocus: true,
    // Revalidate on reconnect
    revalidateOnReconnect: true
  })

  if (error) {
    return <div>Failed to load branches data</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <BranchList datas={data?.data} mutate={mutate} />
}

export default BranchListApp
