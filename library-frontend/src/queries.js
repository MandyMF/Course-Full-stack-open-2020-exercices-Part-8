import {gql} from '@apollo/client'

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
  query allBooks{
    allBooks{
      title,
      author{
        name
      }
      genres
      published
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ){
      title,
      author{
        name
      }
      published,
      genres
    }
  }
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