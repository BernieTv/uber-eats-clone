import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import { FormError } from '../components/form-error';
import uberLogo from '../images/logo.svg';
import { Button } from '../components/button';

const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
		createAccount(input: $createAccountInput) {
			error
			ok
		}
	}
`;

interface ICreateAccountForm {
	email: string;
	password: string;
}

const CreateAccount = () => {
	const {
		register,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<ICreateAccountForm>({ mode: 'onChange' });

	const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION);

	const onSubmit = () => {};

	return (
		<div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Create Account | Uber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
				<img src={uberLogo} alt='Uber Logo' className='w-52 mb-10' />
				<h4 className='w-full font-medium text-left text-3xl mb-5'>
					Let's get started
				</h4>
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
					<Button canClick={isValid} loading={false} actionText={'Create Account'} />
				</form>
				<div>
					Already have an account?{' '}
					<Link to='/login' className='text-lime-600 hover:underline'>
						Log in now
					</Link>
				</div>
			</div>
		</div>
	);
};

export default CreateAccount;
