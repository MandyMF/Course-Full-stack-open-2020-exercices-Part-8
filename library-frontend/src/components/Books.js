import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'
import {ALL_BOOKS} from '../queries'

const Books = ({genre, setGenre, ...props}) => {
  
  const {data, loading} = useQuery(ALL_BOOKS)

  let genres = data?.allBooks?.flatMap(book=> {
    return book.genres
  })
  genres = [...(new Set(genres))]
  
  if (!props.show) {
    return null
  }

  if (loading)
  {
    return <h3>Loading Books ...</h3>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {data.allBooks.filter(
            book => {
              if(genre)
                return book.genres.includes(genre)
              return true
            }
          ).map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres?.map( gen =>
        <button key={gen} onClick={()=>setGenre(gen)}>{gen}</button>
        )}
        <button onClick={()=>setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books