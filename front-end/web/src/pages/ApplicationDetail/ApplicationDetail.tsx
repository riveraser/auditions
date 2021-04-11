import { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import ActionBar from './components/ActionBar/ActionBar'

const GET_APPLICATION_DETAIL = gql`
  query ApplicationDetail($id: ID!) {
    application(id: $id) {
      id
      title
      excerpt
    }
  }
`
type ApplicationDetailType = {
  application: {
    id: string
    title: string
    excerpt: string
  }
}

interface Props {
  match: {
    params: {
      id: string
      action?: string
    }
  }
}
const ApplicationDetail: FC<Props> = ({ match }) => {
  const { loading, data, error } = useQuery<ApplicationDetailType>(GET_APPLICATION_DETAIL, {
    variables: { id: match.params.id },
  })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data?</div>

  return (
    <div>
      <ActionBar application={data.application} />
      <h1>{data.application.title}</h1>
      <p>{data.application.excerpt}</p>

      {match.params.action === 'review' && <h3>Review Mode</h3>}
    </div>
  )
}

export default ApplicationDetail
