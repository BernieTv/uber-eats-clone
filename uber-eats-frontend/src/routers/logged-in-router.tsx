import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Header } from '../components/header';
import { useMeQuery } from '../hooks/useMeQuery';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { meQuery } from '../__generated/meQuery';

interface IRoutesByRoleProps {
	children: JSX.Element;
	data: meQuery;
}

const RoutesByRole = ({ children, data }: IRoutesByRoleProps) => {
	if (data.me.role === 'Client') {
		return children;
	}

	return <Navigate to='/login' />;
};

export const LoggedInRouter = () => {
	const { data, loading, error } = useMeQuery();

	if (!data || loading || error) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<span className='font-medium text-xl tracking-wide'>Loading...</span>
			</div>
		);
	}

	return (
		<Router>
			<Header />
			<Routes>
				<Route
					path='/'
					element={
						<RoutesByRole data={data}>
							<Restaurants />
						</RoutesByRole>
					}
				/>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
};
