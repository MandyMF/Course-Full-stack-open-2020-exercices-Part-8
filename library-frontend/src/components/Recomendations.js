import React, {useState, useEffect} from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {ALL_BOOKS} from '../queries'
import {USER_PREFERED_GENRE, ALL_BOOKS_BY_GENRE} from '../queries'

const Recommendations = (props) => {
  
  const [getBooks, result] = useLazyQuery(ALL_BOOKS_BY_GENRE)
  const {data: user_pref_genre, loading: genre_loading} = useQuery(USER_PREFERED_GENRE)


  useEffect(()=>{
    if(!genre_loading)
    {
      getBooks( {variables:{  
        genre: user_pref_genre.me.favoriteGenre
      }})
    }  
  }, [genre_loading, user_pref_genre]) // eslint-disable-line
  
  if (!props.show) {
    return null
  }

  if (result.loading || genre_loading)
  {
    return <h3>Loading Books ...</h3>
  }

  return (
    <div>
      <h2>recommendations</h2>
        <p>books in your favorite genre <strong>{user_pref_genre?.me?.favoriteGenre}</strong></p>
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
          {result.data.allBooks
          .map(a =>
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

export default Recommendations