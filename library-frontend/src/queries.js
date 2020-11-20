import {gql} from '@apollo/client'

export const BOOK_FRAGMENT = gql`
  fragment bookDetails on Book{
    id,
    title,
    author{
      name
    }
    genres
    published
  }
` 

export const ALL_AUTHORS = gql`
  query allAuthors{
    allAuthors{
      name,
      born,
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String){
    allBooks(genre: $genre){
      ...bookDetails
    }
  }

  ${BOOK_FRAGMENT}
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ){
      ...bookDetails
    }
  }

  ${BOOK_FRAGMENT}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!){
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const USER_PREFERED_GENRE = gql`
  query me{
    me{
      favoriteGenre
    }
  }
`

export const BOOK_ADDED= gql`
  subscription{
    bookAdded{
      ...bookDetails
    }
  }

  ${BOOK_FRAGMENT}
`