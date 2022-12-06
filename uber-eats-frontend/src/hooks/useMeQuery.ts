import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__generated/meQuery';

export const ME_QUERY = gql`
	query meQuery {
		me {
			id
			email
			role
			verified
		}
	}
`;

export const useMeQuery = () => {
	return useQuery<meQuery>(ME_QUERY);
};
