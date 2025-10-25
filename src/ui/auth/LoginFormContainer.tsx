import { APIError } from '@/libs/fetcher';
import { useForm } from '@/modules/form/useForm';

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormContainerProps = {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  error: APIError | null;
  onClickRegister: () => void;
};

function LoginFormContainer({
  onSubmit,
  isLoading,
  error,
  onClickRegister,
}: LoginFormContainerProps) {
  const form = useForm<LoginFormData>(['email', 'password']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = form.getFormData();
    onSubmit(formData);
  };

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4'>
        <h1 className='text-3xl font-bold text-center mb-6 bg-linear-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent'>
          Login
        </h1>
        <p className='text-center text-gray-600 mb-6'>Sign in to continue</p>

        <form onSubmit={handleSubmit}>
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
                {error.message || 'Login failed. Please try again.'}
              </p>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={onClickRegister}
            disabled={isLoading}
            className='cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
            Don&apos;t have an account? Register
          </button>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-xs text-gray-500'>Firebase Authentication Demo</p>
        </div>
      </div>
    </div>
  );
}

export { LoginFormContainer };
