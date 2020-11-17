import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'
import {ALL_BOOKS} from '../queries'
import {USER_PREFERED_GENRE} from '../queries'

const Books = (props) => {
  
  const {data, loading} = useQuery(ALL_BOOKS)
  const {data: user_pref_genre, loading: genre_loading} = useQuery(USER_PREFERED_GENRE)
  const [genre, setGenre] = useState(null)

  useEffect(()=>{
    if(user_pref_genre?.me)
    {
      setGenre(user_pref_genre.me.favoriteGenre)
    }
      
  }, [genre, user_pref_genre])
  
  if (!props.show) {
    return null
  }

  if (loading || genre_loading)
  {
    return <h3>Loading Books ...</h3>
  }

  return (
    <div>
      <h2>recommendations</h2>
        <p>books in your favorite genre <strong>{genre}</strong></p>
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
    </div>
  )
}

export default Books