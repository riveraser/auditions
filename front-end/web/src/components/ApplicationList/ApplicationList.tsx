import { FC } from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_APPLICATIONS = gql`
  query {
    applications {
      title
      excerpt
    }
  }
`
type Application = {
  title: string
  excerpt: string
}

const ApplicationList: FC = () => {
  const { loading, data, error } = useQuery(GET_APPLICATIONS)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.applications.map((application: Application) => {
        return <div>{application.title}</div>
      })}
    </div>
  )
}

export default ApplicationList
