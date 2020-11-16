import React, {useState} from 'react'
import { useMutation } from '@apollo/client'
import {EDIT_AUTHOR, ALL_AUTHORS} from '../queries'
import Select from 'react-select'

const AuthorBirthyearForm = ({options}) => {
  
  const [nameSelected, setNameSelected] = useState(null)
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const editBirthyear = (event) =>{
    event.preventDefault()

    editAuthor({variables:{
      name: nameSelected.value,
      born: Number(born)
    }})

    setBorn('')
    setNameSelected(null)
  }

  const handleSelectName = (selectedName) =>{
    setNameSelected(selectedName)
  }

  return (
    <div>
      <h2>
        Set birthyear
      </h2>

      <form onSubmit={editBirthyear}>

      <Select 
        value={nameSelected} 
        onChange={handleSelectName}
        options={options}
      />

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