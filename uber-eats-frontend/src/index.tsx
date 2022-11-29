import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { client } from './apollo';

import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</ApolloProvider>
	</React.StrictMode>
);

reportWebVitals();
