
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {useApolloClient} from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recomendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [genre, setGenre] = useState(null)

  const logout = () => {    
    setToken(null)    
    localStorage.clear()    
    client.resetStore()  
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token ? 
        <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
        </> :
        <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        token={token}
        show={page === 'authors'}
      />

      <Books 
        genre={genre}
        setGenre={setGenre}
        show={page === 'books'}
      />

      <NewBook
        setGenre={setGenre}
        show={page === 'add'}
      />

      <LoginForm
        setPage= {setPage}
        setToken={setToken}
        show={page === 'login'}
      />


      <Recommendations
        show={page === 'recommend'}
      />

    </div>
  )
}

export default App