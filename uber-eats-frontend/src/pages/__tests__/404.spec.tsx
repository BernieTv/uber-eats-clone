import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotFound } from '../404';

describe('<NotFound />', () => {
	it('renders OK', async () => {
		render(
			<Router>
				<HelmetProvider>
					<NotFound />
				</HelmetProvider>
			</Router>
		);
		await waitFor(() => {
			expect(document.title).toBe('Not Found | Uber Eats');
		});
	});
});
