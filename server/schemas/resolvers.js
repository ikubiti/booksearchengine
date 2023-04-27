const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		users: async () => {
			return await User.find({});
		},
		user: async (parent, args, context) => {
			return await User.findOne({ $or: [{ _id: context.user ? context.user._id : args.id }, { username: args.username }] });
		}

	},
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			if (!user) {
				throw new AuthenticationError('User creation failed');
			}
			const token = signToken(user);

			return { token, user };
		},
		saveBook: async (parent, args, context) => {
			if (context.user) {
				return await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: args } },
					{ new: true, runValidators: true }
				);
			}

			throw new AuthenticationError('Not logged in');
		},
		deleteBook: async (parent, args, context) => {
			if (context.user) {
				return await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: args } },
					{ new: true }
				);
			}

			throw new AuthenticationError('Not logged in');
		},
		login: async (parent, { email, username, password }) => {
			const credentials = username ? ({ username: username }) : ({ email: email });
			const user = await User.findOne(credentials);

			if (!user) {
				throw new AuthenticationError('Incorrect username or email');
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		}
	}

};


module.exports = resolvers;
