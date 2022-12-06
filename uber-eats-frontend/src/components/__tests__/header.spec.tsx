/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Header } from '../header';
import { ME_QUERY } from '../../hooks/useMeQuery';

describe('<Header />', () => {
	it('renders verify banner', async () => {
		await waitFor(async () => {
			render(
				<MockedProvider
					mocks={[
						{
							request: {
								query: ME_QUERY,
							},
							result: {
								data: {
									me: {
										id: 1,
										email: '',
										role: '',
										verified: false,
									},
								},
							},
						},
					]}>
					<Router>
						<Header />
					</Router>
				</MockedProvider>
			);
			await new Promise((resolve) => setTimeout(resolve, 0));
			screen.getByText('Please verify your email.');
		});
	});

	it('renders without verify banner', async () => {
		await waitFor(async () => {
			render(
				<MockedProvider
					mocks={[
						{
							request: {
								query: ME_QUERY,
							},
							result: {
								data: {
									me: {
										id: 1,
										email: '',
										role: '',
										verified: true,
									},
								},
							},
						},
					]}>
					<Router>
						<Header />
					</Router>
				</MockedProvider>
			);
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(screen.queryByText('Please verify your email.')).toBeNull();
		});
	});
});
