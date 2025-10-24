import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageProvider } from '@/providers/PageProvider';
import { routesUrl } from '@/routes/routesConfig';

function Index() {
  const { t } = useTranslation(['common']);
  return (
    <PageProvider>
      <div className='flex flex-col flex-1 w-full text-center justify-center'>
        <h1 className='text-4xl font-bold'>{t('common:page.title')}</h1>
        <p className='mt-2'>{t('common:page.description')}</p>
        <Link to={routesUrl.movies}>
          <button
            type='button'
            className='cursor-pointer mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
            Go to &quot;Other Page&quot;
          </button>
        </Link>
      </div>
    </PageProvider>
  );
}

export { Index };
