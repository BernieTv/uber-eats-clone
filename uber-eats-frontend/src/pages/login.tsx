import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated/loginMutation';
import uberLogo from '../images/logo.svg';
import { Button } from '../components/button';

const LOGIN_MUTATION = gql`
	mutation loginMutation($loginInput: LoginInput!) {
		login(input: $loginInput) {
			ok
			error
			token
		}
	}
`;

interface ILoginForm {
	email: string;
	password: string;
}

const Login = () => {
	const {
		register,
		getValues,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<ILoginForm>({ mode: 'onChange' });

	const onCompleted = (data: loginMutation) => {
		const {
			login: { ok, token },
		} = data;

		if (ok) {
			console.log(token);
		}
	};

	const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
		loginMutation,
		loginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted,
	});

	const onSubmit = () => {
		if (!loading) {
			const { email, password } = getValues();
			loginMutation({
				variables: {
					loginInput: { email, password },
				},
			});
		}
	};

	return (
		<div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Login | Uber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
				<img src={uberLogo} alt='Uber Logo' className='w-52 mb-10' />
				<h4 className='w-full font-medium text-left text-3xl mb-5'>Welcome back</h4>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='grid gap-3 mt-5 w-full mb-5'>
					<input
						{...register('email', { required: 'Email is required' })}
						name='email'
						type='email'
						placeholder='Email'
						className='input'
					/>
					{errors.email?.message && (
						<FormError errorMessage={errors.email.message} />
					)}
					<input
						{...register('password', {
							required: 'Password is required',
							minLength: 3,
						})}
						name='password'
						type='password'
						placeholder='Password'
						className='input'
					/>
					{errors.password?.message && (
						<FormError errorMessage={errors.password.message} />
					)}
					{errors.password?.type === 'minLength' && (
						<FormError errorMessage='Password must be more than 3 chars.' />
					)}
					<Button canClick={isValid} loading={loading} actionText={'Log In'} />
					{loginMutationResult?.login.error && (
						<FormError errorMessage={loginMutationResult.login.error} />
					)}
				</form>
				<div>
					New to Uber?{' '}
					<Link to='/create-account' className='text-lime-600 hover:underline'>
						Create an Account
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
