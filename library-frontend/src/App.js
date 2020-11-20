
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {useApolloClient, useSubscription} from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recomendations'
import {BOOK_ADDED, ALL_BOOKS} from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [genre, setGenre] = useState(null)

  const updateCacheWith = (addedBook, userGenre) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {...dataInStore, allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }

    if (userGenre)
    {
      const dataInStoreByGenre = client.readQuery({query: ALL_BOOKS, variables:{genre: userGenre}})
      if(addedBook.genres.includes(userGenre) && !includedIn(dataInStoreByGenre.allBooks, addedBook)){
        client.writeQuery({
          query: ALL_BOOKS, 
          variables:{genre: userGenre},
          data: {...dataInStoreByGenre, allBooks : dataInStoreByGenre.allBooks.concat(addedBook) }
        })
      }
    }

  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateCacheWith(subscriptionData.data.bookAdded)
      window.alert(`BOOK ADDED ${subscriptionData.data.bookAdded.title}`)
    }
  })

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
        updateCacheWith= {updateCacheWith}
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