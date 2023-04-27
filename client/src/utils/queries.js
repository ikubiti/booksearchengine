import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
	query users {
		users {
			_id
			username
			email
			savedBooks {
				_id
				authors
				description
				bookId
				image
				link
				title
			}
		}
	}
`;

export const QUERY_USER = gql`
	query user($userId: ID) {
	user(id: $userId) {
		_id
		username
		email
		savedBooks {
			_id
			authors
			description
			bookId
			image
			link
			title
		}
	}
	}
`;