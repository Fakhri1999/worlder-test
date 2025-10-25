import { useForm } from '@/modules/auth/hooks/useForm';
import { APIError } from '@/libs/fetcher';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormContainerProps = {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  error: APIError | null;
  onClickLogin: () => void;
};

function RegisterFormContainer({
  onSubmit,
  isLoading,
  error,
  onClickLogin,
}: RegisterFormContainerProps) {
  const form = useForm<RegisterFormData>(['name', 'email', 'password']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = form.getFormData();
    onSubmit(formData);
  };

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4'>
        <h1 className='text-3xl font-bold text-center mb-6 bg-linear-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent'>
          Register
        </h1>
        <p className='text-center text-gray-600 mb-6'>Create a new account</p>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-gray-700 text-sm font-bold mb-2'>
              Name
            </label>
            <input
              id='name'
              type='text'
              ref={form.refs.name}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your name'
              required
              disabled={isLoading}
            />
          </div>

          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-gray-700 text-sm font-bold mb-2'>
              Email
            </label>
            <input
              id='email'
              type='email'
              ref={form.refs.email}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your email'
              required
              disabled={isLoading}
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-gray-700 text-sm font-bold mb-2'>
              Password
            </label>
            <input
              id='password'
              type='password'
              ref={form.refs.password}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your password'
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-fadeIn'>
              <p className='text-sm'>
                {error.message || 'Registration failed. Please try again.'}
              </p>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={onClickLogin}
            disabled={isLoading}
            className='cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
            Already have an account? Sign in
          </button>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-xs text-gray-500'>
            Password must be at least 6 characters
          </p>
        </div>
      </div>
    </div>
  );
}

export { RegisterFormContainer };
