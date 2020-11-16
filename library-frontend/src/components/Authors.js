  
import React from 'react'
import {ALL_AUTHORS} from '../queries'
import { useQuery } from '@apollo/client'
import AuthorBirthyearForm from './AuthorBirthyearForm'

const Authors = (props) => {
  const {data, loading} = useQuery(ALL_AUTHORS)

  const options = data?.allAuthors ? data?.allAuthors?.map(author => ({
    value: author.name,
    label: author.name
  })) : []
  
  if (!props.show) {
    return null
  }

  if (loading)
  {
    return <h3>Loading Authors ...</h3>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {data?.allAuthors?.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {
      props.token &&
      <AuthorBirthyearForm options={options} />
      }
    </div>
  )
}

export default Authors
