import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

type TCategoryParams = {
	slug?: string;
};

const CATEGORY_QUERY = gql`
	query category($input: CategoryInput!) {
		category(input: $input) {
			error
			ok
			totalPages
			totalResults
			restaurants {
				...RestaurantParts
			}
			category {
				...CategoryParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

export const Category = () => {
	const { slug } = useParams<TCategoryParams>();

	return <h1>Category</h1>;
};
