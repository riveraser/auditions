import { FC } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  application: {
    id: string
    title: string
  }
}
const ActionBar: FC<Props> = ({ application }) => {
  return (
    <div>
      <ul>
        <li>
          <Link to={`/applications/${application.id}/review`}>review</Link>
        </li>
      </ul>
    </div>
  )
}

export default ActionBar
