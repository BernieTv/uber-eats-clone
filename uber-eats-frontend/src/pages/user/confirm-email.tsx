import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { verifyEmail, verifyEmailVariables } from '../../__generated/verifyEmail';
import { useMeQuery } from '../../hooks/useMeQuery';
import { Helmet } from 'react-helmet-async';

const VERIFY_EMAIL_MUTATION = gql`
	mutation verifyEmail($input: VerifyEmailInput!) {
		verifyEmail(input: $input) {
			error
			ok
		}
	}
`;

export const ConfirmEmail = () => {
	const { data: userData } = useMeQuery();
	const client = useApolloClient();
	const navigate = useNavigate();

	const onCompleted = (data: verifyEmail) => {
		const {
			verifyEmail: { ok },
		} = data;

		if (ok && userData?.me.id) {
			client.writeFragment({
				id: `User:${userData.me.id}`,
				fragment: gql`
					fragment VerifiedUser on User {
						verified
					}
				`,
				data: {
					verified: true,
				},
			});

			navigate('/');
		}
	};

	const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
		VERIFY_EMAIL_MUTATION,
		{ onCompleted }
	);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, code] = window.location.href.split('code=');

		verifyEmail({ variables: { input: { code } } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex flex-col items-center justify-center mt-52'>
			<Helmet>
				<title>Verify Email | Uber Eats</title>
			</Helmet>
			<h2 className='text-lg mb-1 font-medium'>Confirming email...</h2>
			<h4 className='text-gray-700 text-sm'>Please wait, don't close this page...</h4>
		</div>
	);
};
