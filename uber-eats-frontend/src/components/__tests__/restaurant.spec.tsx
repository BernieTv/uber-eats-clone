/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import { Restaurant } from '../restaurant';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Restaurant />', () => {
	it('renders OK with props', () => {
		const restaurantProps = {
			id: '1',
			name: 'name',
			categoryName: 'categoryName',
			coverImg: 'x',
		};
		const { container } = render(
			<Router>
				<Restaurant {...restaurantProps} />
			</Router>
		);
		screen.getByText(restaurantProps.name);
		screen.getByText(restaurantProps.categoryName);
		expect(container.firstChild).toHaveAttribute(
			'href',
			`/restaurant/${restaurantProps.id}`
		);
	});
});
