import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
	restaurantsPageQuery,
	restaurantsPageQueryVariables,
} from '../../__generated/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
	query restaurantsPageQuery($input: RestaurantsInput!) {
		allCategories {
			ok
			error
			categories {
				...CategoryParts
			}
		}
		restaurants(input: $input) {
			error
			ok
			totalPages
			totalResults
			results {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

interface IFormProps {
	searchTerm: string;
}

export const Restaurants = () => {
	const [page, setPage] = useState(1);
	const { data, loading } = useQuery<
		restaurantsPageQuery,
		restaurantsPageQueryVariables
	>(RESTAURANTS_QUERY, { variables: { input: { page } } });
	const { register, handleSubmit, getValues } = useForm<IFormProps>();
	const navigate = useNavigate();

	const onSearchSubmit = () => {
		const { searchTerm } = getValues();

		navigate({ pathname: '/search', search: `?term=${searchTerm}` });
	};

	const onNextPageClick = () => setPage((current) => current + 1);
	const onPrevPageClick = () => setPage((current) => current - 1);

	return (
		<div>
			<Helmet>
				<title>Home | Uber Eats</title>
			</Helmet>
			<form
				onSubmit={handleSubmit(onSearchSubmit)}
				className='bg-gray-800 w-full py-40 flex justify-center items-center'>
				<input
					{...register('searchTerm', {
						required: true,
						minLength: 3,
					})}
					type='Search'
					className='input rounded-md border-0 w-3/4 md:w-3/12'
					placeholder='Search restaurants...'
				/>
			</form>
			{!loading && (
				<div className='max-w-screen-2xl pb-20 mx-auto mt-8'>
					<div className='flex justify-around max-w-screen-sm mx-auto'>
						{data?.allCategories.categories?.map((category) => (
							<Link to={`/category/${category.slug}`} key={category.id}>
								<div className='flex flex-col group items-center justify-center cursor-pointer'>
									<div
										className='w-16 h-16 bg-cover rounded-full group-hover:bg-gray-100'
										style={{
											backgroundImage: `url(${category.coverImg})`,
										}}></div>
									<span className='mt-1 text-sm text-center font-medium'>
										{category.name}
									</span>
								</div>
							</Link>
						))}
					</div>
					<div className='grid mt-16 md:grid-cols-3 gap-x-7 gap-y-10'>
						{data?.restaurants.results?.map((restaurant) => (
							<Restaurant
								id={restaurant.id + ''}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
								key={restaurant.id}
							/>
						))}
					</div>
					<div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
						{page > 1 ? (
							<button
								onClick={onPrevPageClick}
								className='focus:outline-none font-medium text-2xl'>
								&larr;
							</button>
						) : (
							<div></div>
						)}
						<span>
							Page {page} of {data?.restaurants.totalPages}
						</span>
						{page !== data?.restaurants.totalPages ? (
							<button
								onClick={onNextPageClick}
								className='focus:outline-none font-medium text-2xl'>
								&rarr;
							</button>
						) : (
							<div></div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
