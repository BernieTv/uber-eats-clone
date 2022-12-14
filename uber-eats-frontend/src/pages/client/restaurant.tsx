import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated/restaurant';

const RESTAURANT_QUERY = gql`
	query restaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			error
			ok
			restaurant {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

type TRestaurantParams = {
	id: string;
};

export const RestaurantPage = () => {
	const { id } = useParams<TRestaurantParams>();
	const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
		variables: { input: { restaurantId: Number(id) } },
	});

	return (
		<div>
			<div
				className='bg-gray-800 py-48 bg-center bg-cover'
				style={{
					backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
				}}>
				<div className='bg-white w-3/12 py-8 pl-48'>
					<h4 className='text-4xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
					<h5 className='text-sm font-light mb-2'>
						{data?.restaurant.restaurant?.category?.name}
					</h5>
					<h6 className='text-sm font-light'>
						{data?.restaurant.restaurant?.address}
					</h6>
				</div>
			</div>
		</div>
	);
};
