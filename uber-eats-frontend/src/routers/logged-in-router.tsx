import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from '../components/header';
import { useMeQuery } from '../hooks/useMeQuery';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';

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
				{data.me.role === 'Client' && <Route path='/' element={<Restaurants />} />}
				{data.me.role === 'Client' && (
					<Route path='/confirm' element={<ConfirmEmail />} />
				)}
				{data.me.role === 'Client' && (
					<Route path='/edit-profile' element={<EditProfile />} />
				)}
				{data.me.role === 'Client' && <Route path='/search' element={<Search />} />}
				{data.me.role === 'Client' && (
					<Route path='/category/:slug' element={<Category />} />
				)}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
};
