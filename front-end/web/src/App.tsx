import { FC } from 'react'
import { ApolloProvider } from '@apollo/client'
import client from './apollo/client'
import ApplicationList from './pages/ApplicationList/ApplicationList'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import ApplicationDetail from './pages/ApplicationDetail/ApplicationDetail'

const App: FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/applications">Applications</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/applications/:id/:action?" component={ApplicationDetail} />
            <Route path="/applications" component={ApplicationList} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
