import React, { useEffect} from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {ALL_BOOKS} from '../queries'

const Books = ({genre, setGenre, ...props}) => {
  
  const {data} = useQuery(ALL_BOOKS)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
})
  
  let genres = data?.allBooks?.flatMap(book=> {
    return book.genres
  })
  genres = [...(new Set(genres))]

  useEffect(()=>{
    getBooks({variables:{genre}})
  }, [genre, getBooks])
  
  if (!props.show) {
    return null
  }

  if (result?.loading)
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
          {result?.data?.allBooks?.map(a =>
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