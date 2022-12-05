import { gql } from '@apollo/client';

export const RESTAURANT_FRAGMENT = gql`
	fragment RestaurantParts on Restaurant {
		id
		name
		coverImg
		address
		isPromoted
		category {
			name
		}
	}
`;

export const CATEGORY_FRAGMENT = gql`
	fragment CategoryParts on Category {
		id
		name
		coverImg
		slug
		restaurantCount
	}
`;
