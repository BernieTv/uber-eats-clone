import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useMeQuery } from '../hooks/useMeQuery';
import uberLogo from '../images/logo.svg';

export const Header = () => {
	const { data } = useMeQuery();

	if (!data) return <></>;

	return (
		<>
			{!data?.me.verified && (
				<div className='p-3 text-center text-white bg-red-600'>
					<span>Please verify your email.</span>
				</div>
			)}
			<header className='py-4'>
				<div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center'>
					<Link to='/'>
						<img src={uberLogo} alt='Uber Logo' className='w-36' />
					</Link>
					<span className='text-xs'>
						<Link to='/edit-profile'>
							<FontAwesomeIcon icon={faUser} className='text-xl' />
						</Link>
					</span>
				</div>
			</header>
		</>
	);
};
