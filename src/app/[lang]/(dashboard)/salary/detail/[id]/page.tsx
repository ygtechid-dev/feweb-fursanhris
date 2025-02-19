
/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-Detail` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

import { getUserData } from "@/app/server/actions"
import SalaryDetail from "@/views/apps/salary/view/SalaryDetail"

/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-Detail`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */

const SalaryDetailApp = async () => {
  // Vars
  const data = await getUserData()

  return <SalaryDetail userData={data} />
}

export default SalaryDetailApp
