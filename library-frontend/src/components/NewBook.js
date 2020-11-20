import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {ADD_BOOK, ALL_AUTHORS, USER_PREFERED_GENRE} from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const {data: user_pref_genre} = useQuery(USER_PREFERED_GENRE)

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{query: ALL_AUTHORS}],
    update:(store, response) => {      
      props.updateCacheWith(response.data.addBook, user_pref_genre?.me?.favoriteGenre)
    }
  }) 

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook(
      {
        variables:
        {
          title,
          author,
          published: Number(published),
          genres
        }
      })

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
    props.setGenre(null)
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook