import { Link } from 'react-router-dom';

import { useAuthMachine } from '@/modules/auth/authMachineHooks';
import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';
import { LoginFormContainer } from '@/ui/auth/LoginFormContainer';
import { RegisterFormContainer } from '@/ui/auth/RegisterFormContainer';

function Index() {
  const [state, send] = useAuthMachine();

  const error = state.context.error;
  const user = state.context.user;

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    send({
      type: 'LOGIN',
      data,
    });
  };

  const handleRegisterSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    send({
      type: 'REGISTER',
      data,
    });
  };

  const handleLogout = () => {
    send({ type: 'LOGOUT' });
  };

  const handleShowLoginForm = () => {
    send({ type: 'SHOW_LOGIN_FORM' });
  };

  const handleShowRegisterForm = () => {
    send({ type: 'SHOW_REGISTER_FORM' });
  };

  return (
    <PageProvider>
      <div className='flex flex-col flex-1 w-full items-center justify-center px-4'>
        {state.matches('Showing Register Form') && (
          <RegisterFormContainer
            onSubmit={handleRegisterSubmit}
            isLoading={state.matches({
              'Showing Register Form': 'Registering',
            })}
            error={error}
            onClickLogin={handleShowLoginForm}
          />
        )}

        {state.matches('Showing Login Form') && (
          <LoginFormContainer
            onSubmit={handleLoginSubmit}
            isLoading={state.matches({
              'Showing Login Form': 'Logging In',
            })}
            error={error}
            onClickRegister={handleShowRegisterForm}
          />
        )}

        {state.matches('Authenticated') && (
          <div className='w-full max-w-md'>
            <div className='bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 animate-fadeInUp'>
              <h1 className='text-3xl font-bold text-center mb-4 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>
                Welcome Back!
              </h1>
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                <p className='text-gray-700 mb-1'>
                  <span className='font-semibold'>Name:</span> {user?.name}
                </p>
                <p className='text-gray-700 mb-1'>
                  <span className='font-semibold'>Email:</span> {user?.email}
                </p>
                <p className='text-gray-700'>
                  <span className='font-semibold'>ID:</span> {user?.id}
                </p>
              </div>

              <div className='space-y-3'>
                <Link to={routesUrl.movies} className='block'>
                  <button
                    type='button'
                    className='w-full cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200'>
                    Go to Movies
                  </button>
                </Link>

                <button
                  type='button'
                  onClick={handleLogout}
                  className='cursor-pointer w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200'>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageProvider>
  );
}

export { Index };
