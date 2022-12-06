import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated/category';

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
	const { slug } = useParams() as {
		slug: string;
	};

	const { data } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
		variables: { input: { page: 1, slug } },
	});

	return (
		<div>
			<h1>Category Name: {data?.category.category?.name}</h1>
		</div>
	);
};
