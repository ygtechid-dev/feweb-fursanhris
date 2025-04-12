
'use client'
import { useDictionary } from "@/components/dictionary-provider/DictionaryContext"
/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

// import { getUserData } from "@/app/server/actions"
import { fetcher } from "@/configs/config"
import UserList from "@/views/apps/user/list"
import useSWR from "swr"

const UserListApp = () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/users', fetcher,{
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

  return <UserList datas={data?.data} mutate={mutate}/>
}

export default UserListApp
