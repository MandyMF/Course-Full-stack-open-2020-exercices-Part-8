import React, {useState} from 'react'
import { useMutation } from '@apollo/client'
import {EDIT_AUTHOR, ALL_AUTHORS} from '../queries'

const AuthorBirthyearForm = (props) => {
  
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const editBirthyear = (event) =>{
    event.preventDefault()

    editAuthor({variables:{
      name,
      born: Number(born)
    }})

    setBorn('')
    setName('')
  }

  return (
    <div>
      <h2>
        Set birthyear
      </h2>

      <form onSubmit={editBirthyear}>

      <div>
      name
      <input
        value={name}
        onChange = {(event) => setName(event.target.value)}
       />
      </div>

      <div>
      born
      <input
        type='number'
        value={born}
        onChange = {(event) => setBorn(event.target.value)}
       />
       </div>

       <button type="submit">update author</button>

       </form>
      
    </div>
  )
}

export default AuthorBirthyearForm