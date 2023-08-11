import { gql } from '@apollo/client';

// login user using email and password
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password){
            token
            user {
                _id
                username
            }
        }
    }
`;

// create user with username, email, and password
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

// save book to user's account
export const SAVE_BOOK = gql`
    mutation saveBook($bookData: BookInput!){
        saveBook(bookData: $bookData) {
            _id
            username
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

// remove book from user's account
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!){
        removeBook(bookId: $bookId) {
            _id
            username
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;
