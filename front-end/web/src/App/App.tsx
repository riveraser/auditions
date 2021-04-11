import { FC } from 'react'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo/client'
import ApplicationList from '../components/ApplicationList/ApplicationList'

const App: FC = () => {
  return (
    <ApolloProvider client={client}>
      <ApplicationList />
    </ApolloProvider>
  )
}

export default App
