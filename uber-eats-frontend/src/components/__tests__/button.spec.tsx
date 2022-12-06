/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('<Button/>', () => {
	it('should render OK with props', () => {
		render(<Button canClick={true} loading={false} actionText='test' />);
		screen.getByText('test');
	});

	it('should display loading', () => {
		const { container } = render(
			<Button canClick={false} loading={true} actionText='test' />
		);
		screen.getByText('Loading...');
		expect(container.firstChild).toHaveClass('pointer-events-none');
	});
});
