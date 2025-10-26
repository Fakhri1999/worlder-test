import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuthUser } from '@/modules/auth/authHooks';
import { useAuthMachine } from '@/modules/auth/authMachineHooks';
import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';
import { LoginFormContainer } from '@/ui/auth/LoginFormContainer';
import { RegisterFormContainer } from '@/ui/auth/RegisterFormContainer';

function Index() {
  const { t } = useTranslation();
  const { isAuthReady } = useAuthUser();
  const [state, send] = useAuthMachine();

  useEffect(() => {
    if (isAuthReady) {
      send({ type: 'CHECK_AUTHENTICATION' });
    }
  }, [isAuthReady]);

  const error = state.context.error;
  const user = state.context.user;

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    send({
      type: 'LOGIN',
      data,
    });
  };

  const handleGoogleSignIn = () => {
    send({ type: 'LOGIN_WITH_GOOGLE' });
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
      <div className='flex flex-col flex-1 w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden'>
        {/* Animated Background Elements */}
        <div
          className='absolute inset-0 opacity-10 dark:opacity-20'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className='relative flex flex-col flex-1 w-full items-center justify-center px-4 py-8'>
          {/* Auth Forms */}
          {state.matches('Showing Register Form') && (
            <div className='w-full max-w-xl animate-fadeIn'>
              <RegisterFormContainer
                onSubmit={handleRegisterSubmit}
                isLoading={state.matches({
                  'Showing Register Form': 'Registering',
                })}
                error={error}
                onClickLogin={handleShowLoginForm}
              />
            </div>
          )}

          {state.matches('Showing Login Form') && (
            <div className='w-full max-w-xl animate-fadeIn'>
              <LoginFormContainer
                onSubmit={handleLoginSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={state.hasTag('loading')}
                error={error}
                onClickRegister={handleShowRegisterForm}
              />
            </div>
          )}

          {/* Authenticated User Dashboard */}
          {state.matches('Authenticated') && (
            <div className='w-full max-w-xl animate-fadeIn'>
              {/* Welcome Card */}
              <div className='bg-app-card/80 backdrop-blur-xl shadow-2xl rounded-3xl px-4 py-6 sm:px-8 sm:py-10 mb-6 border border-app-border'>
                <div className='text-center mb-6 sm:mb-8'>
                  <h1 className='text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-app-accent via-app-accent-purple to-app-accent-pink bg-clip-text text-transparent animate-slideInDown'>
                    {t('home.title')}
                  </h1>
                  <p className='text-app-secondary text-base sm:text-lg'>
                    {t('home.subtitle')}
                  </p>
                </div>

                {/* User Info Card */}
                <div className='bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg'>
                  <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0'>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h2 className='text-app-primary text-lg sm:text-xl md:text-2xl font-bold truncate'>
                        {user?.name}
                      </h2>
                      <p className='text-green-600 dark:text-green-200 text-xs sm:text-sm truncate'>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className='bg-app-tertiary/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-app-border'>
                    <p className='text-app-muted text-xs break-all'>
                      <span className='font-semibold text-app-accent-purple'>
                        User ID:
                      </span>{' '}
                      <span className='font-mono'>{user?.id}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3 sm:space-y-4'>
                  <Link to={routesUrl.movies} className='block'>
                    <button
                      type='button'
                      className='group w-full cursor-pointer px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-app-accent to-app-accent-purple hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-app-accent-purple/50 flex items-center justify-center gap-2 sm:gap-3'>
                      <svg
                        className='w-5 h-5 sm:w-6 sm:h-6 transform group-hover:scale-110 transition-transform flex-shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z'
                        />
                      </svg>
                      <span className='truncate'>
                        {t('home.exploreMovies')}
                      </span>
                      <svg
                        className='w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform flex-shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 7l5 5m0 0l-5 5m5-5H6'
                        />
                      </svg>
                    </button>
                  </Link>

                  <button
                    type='button'
                    onClick={handleLogout}
                    className='group cursor-pointer w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-app-tertiary/50 backdrop-blur-sm hover:bg-red-500/20 text-app-primary rounded-xl font-semibold text-sm sm:text-base border border-app-border hover:border-red-400/50 transition-all duration-300 flex items-center justify-center gap-2'>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform flex-shrink-0'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageProvider>
  );
}

export { Index };
