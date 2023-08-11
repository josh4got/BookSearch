const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id}).select('-__v -password')
                console.log('User:', userData)
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('invalid credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('invalid credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('you must be logged in to save a book');
        },
        // remove a book from `savedBooks`
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: {bookId} } },
                { new: true }
            );
            return updatedUser;
            }
            throw new AuthenticationError('you must be logged in to remove a book');
        },
    },
};

module.exports = resolvers;