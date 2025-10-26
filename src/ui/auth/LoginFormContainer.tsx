import { useTranslation } from 'react-i18next';
import { FcGoogle as GoogleIcon } from 'react-icons/fc';

import { APIError } from '@/libs/fetcher';
import { useForm } from '@/modules/form/useForm';

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormContainerProps = {
  onSubmit: (data: LoginFormData) => void;
  onGoogleSignIn: () => void;
  isLoading: boolean;
  error: APIError | null;
  onClickRegister: () => void;
};

function LoginFormContainer({
  onSubmit,
  onGoogleSignIn,
  isLoading,
  error,
  onClickRegister,
}: LoginFormContainerProps) {
  const { t } = useTranslation();
  const form = useForm<LoginFormData>(['email', 'password']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = form.getFormData();
    onSubmit(formData);
  };

  return (
    <div className='w-full'>
      <div className='bg-app-card/80 backdrop-blur-xl shadow-2xl rounded-3xl px-8 pt-8 pb-8 mb-4 border border-app-border'>
        <h1 className='text-4xl font-black text-center mb-3 bg-gradient-to-r from-app-accent via-app-accent-purple to-app-accent-pink bg-clip-text text-transparent'>
          {t('auth.login')}
        </h1>
        <p className='text-center text-app-secondary mb-8'>
          {t('auth.loginSubtitle')}
        </p>

        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label
              htmlFor='email'
              className='block text-app-secondary text-sm font-semibold mb-2'>
              {t('auth.email')}
            </label>
            <input
              id='email'
              type='email'
              ref={form.refs.email}
              className='w-full px-4 py-3 bg-app-surface/50 backdrop-blur-sm border border-app-border rounded-xl text-app-primary placeholder-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-purple focus:border-transparent transition-all duration-200'
              placeholder={t('auth.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-app-secondary text-sm font-semibold mb-2'>
              {t('auth.password')}
            </label>
            <input
              id='password'
              type='password'
              ref={form.refs.password}
              className='w-full px-4 py-3 bg-app-surface/50 backdrop-blur-sm border border-app-border rounded-xl text-app-primary placeholder-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-purple focus:border-transparent transition-all duration-200'
              placeholder={t('auth.passwordPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className='mb-6 p-4 bg-app-error/20 border border-app-error/50 text-app-error rounded-xl backdrop-blur-sm animate-fadeIn'>
              <p className='text-sm font-medium'>
                {error.message || t('auth.loginFailedMessage')}
              </p>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-app-accent to-app-accent-purple hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-accent-purple focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50'>
            {isLoading ? t('auth.loginButtonLoading') : t('auth.loginButton')}
          </button>
        </form>

        <div className='mt-6 mb-6 flex items-center'>
          <div className='flex-1 border-t border-app-border'></div>
          <span className='px-4 text-app-secondary text-sm font-medium'>
            {t('auth.orContinueWith')}
          </span>
          <div className='flex-1 border-t border-app-border'></div>
        </div>

        <button
          type='button'
          onClick={onGoogleSignIn}
          disabled={isLoading}
          className='w-full bg-white dark:bg-app-surface hover:bg-gray-50 dark:hover:bg-app-elevated text-gray-800 dark:text-app-primary font-semibold py-3.5 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-accent-purple focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 border border-app-border'>
          <GoogleIcon className='text-2xl' />
          <span>{t('auth.signInWithGoogle')}</span>
        </button>

        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={onClickRegister}
            disabled={isLoading}
            className='cursor-pointer text-sm text-app-secondary hover:text-app-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'>
            {t('auth.noAccount')}{' '}
            <span className='text-app-accent hover:text-app-accent-purple'>
              {t('auth.registerLink')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { LoginFormContainer };
