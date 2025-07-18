
'use client'

import { useDictionary } from "@/components/dictionary-provider/DictionaryContext";
import { fetcher } from "@/configs/config";
import ProjectList from "@/views/apps/projects/list"
import useSWR from "swr";

const ProjectListApp = () => {
  const {dictionary} = useDictionary();
  const { data, error, isLoading, mutate } = useSWR('/web/projects', fetcher,{
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


  return <ProjectList datas={data?.data?.projects} />
}

export default ProjectListApp
