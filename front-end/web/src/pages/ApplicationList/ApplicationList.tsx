import { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const GET_APPLICATIONS = gql`
  query {
    applications {
      id
      title
      excerpt
    }
  }
`

type ApplicationType = {
  id: string
  title: string
  excerpt: string
}

type ApplicationListType = {
  applications: ApplicationType[]
}

const ApplicationList: FC = () => {
  const { loading, data, error } = useQuery<ApplicationListType>(GET_APPLICATIONS)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div> Where's the data?</div>

  return (
    <div>
      <ul>
        {data.applications.map((application: ApplicationType) => {
          return (
            <li key={application.id}>
              <Link to={`/applications/${application.id}`}>{application.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ApplicationList
