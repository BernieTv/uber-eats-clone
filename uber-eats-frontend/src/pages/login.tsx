import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { FormError } from '../components/form-error';

const LOGIN_MUTATION = gql`
	mutation loginMutation($email: String!, $password: String!) {
		login(input: { email: $email, password: $password }) {
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
		formState: { errors },
		handleSubmit,
	} = useForm<ILoginForm>();

	const [loginMutation] = useMutation(LOGIN_MUTATION);

	const onSubmit = () => {
		const { email, password } = getValues();
		loginMutation({
			variables: {
				email,
				password,
			},
		});
	};

	return (
		<div className='h-screen flex items-center justify-center bg-gray-800'>
			<div className='bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center'>
				<h3 className='text-3xl text-gray-800'>Log In</h3>
				<form onSubmit={handleSubmit(onSubmit)} className='grid gap-3 mt-5 px-5'>
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
							minLength: 10,
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
						<FormError errorMessage='Password must be more than 10 chars.' />
					)}
					<button className='btn'>Log In</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
