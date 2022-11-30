import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useMeQuery } from '../hooks/useMeQuery';
import uberLogo from '../images/logo.svg';

export const Header = () => {
	const { data } = useMeQuery();

	return (
		<header className='py-4'>
			<div className='w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center'>
				<img src={uberLogo} alt='Uber Logo' className='w-24' />
				<span className='text-xs'>
					<Link to='/my-profile'>
						<FontAwesomeIcon icon={faUser} className='text-xl' />
					</Link>
				</span>
			</div>
		</header>
	);
};
