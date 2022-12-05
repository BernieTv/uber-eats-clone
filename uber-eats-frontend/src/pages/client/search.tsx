import { gql, useLazyQuery } from '@apollo/client';
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
	searchRestaurant,
	searchRestaurantVariables,
} from '../../__generated/searchRestaurant';

const SEARCH_RESTAURANT = gql`
	query searchRestaurant($input: SearchRestaurantInput!) {
		searchRestaurant(input: $input) {
			error
			ok
			totalPages
			totalResults
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const navigateRef = useRef(navigate);
	const [callQuery, { loading, data, called }] = useLazyQuery<
		searchRestaurant,
		searchRestaurantVariables
	>(SEARCH_RESTAURANT);

	useEffect(() => {
		const query = location.search.split('?term=')[1];

		if (!query) {
			return navigateRef.current('/', { replace: true });
		}

		callQuery({
			variables: { input: { page: 1, query } },
		});
	}, [location.search, callQuery]);

	return (
		<div>
			<Helmet>
				<title>Search | Uber Eats</title>
			</Helmet>
			<h1>Search Page</h1>
		</div>
	);
};
