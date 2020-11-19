const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const pubsub = new PubSub()
const {v4: uuid} = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const MONGODB_URI ='mongodb+srv://fullstack:asd123.@cluster0.vqjhh.mongodb.net/library-app?retryWrites=true&w=majority'

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(()=>{
  console.log('connected to MongoDb')
})
.catch((error) => {
  console.log('error connection to MongoDB:', error.message)
})


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    bookCount: Int!
    born: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!

    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Subscription{
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args)=> {

      if(args.author && !args.genre)
      {
        const author = await Author.findOne({name: args.author})
        return Book.find({
          author: author._id
        }).populate('author')
      }
      else if(args.genre && !args.author)
        return Book.find({
          genres: {
            $in: args.genre
          }
        }).populate('author')
      
      else if(args.genre && args.author) {
        const author = await Author.findOne({name: args.author})
        return Book.find({
          author: author._id,
          genres: {
            $in: args.genre
          }
        }).populate('author')
      }
      else
        return Book.find({}).populate('author')
    },

    allAuthors: async ()=> {

      const authors = await Author.find({})
      const books = await Book.find({}).populate('author')

      return authors.map((author)=>{    
        
        const bookCount = books.filter(book=> book.author.name === author.name).length
        
        return {
          id: author._id,
          name: author.name,
          born: author.born,
          bookCount
        }
      })
    },

    me: (root, args, context) => {
      return context.currentUser
    }
  },
  

  Mutation: {
    addBook: async (root, args, context) => {

      const currentUser = context.currentUser
      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({name: args.author})
      let newAuthor = false

      if( !author ){
        newAuthor = true
        author = new Author({
          name: args.author
        })

        try {
          author = await author.save()
        }
        catch(error){ 
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const newBook = new Book({
        ...args, author: author
      })

      try {
        await newBook.save()
      }
      catch(error){ 
        if(newAuthor) 
        {
          await Author.findByIdAndDelete(author._id)
        }
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      pubsub.publish('BOOK_ADDED' ,{bookAdded: newBook})
      
      return newBook
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }

      try{
        return Author.findOneAndUpdate({name: args.name}, {born: args.setBornTo}, {returnOriginal: false})
      }
      catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username,  favoriteGenre: args.favoriteGenre})
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secred' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded:{
      subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req})=>{
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(        
        auth.substring(7), JWT_SECRET      
        )      
        const currentUser = await User.findById(decodedToken.id)     
        return { currentUser }    
      }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})