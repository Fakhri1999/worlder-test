import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation(['common']);

  return (
    <div className='flex flex-col h-24 w-full bg-blue-100 text-center justify-center'>
      <h3 className='text-xl font-bold'>{t('common:header.title')}</h3>
      <p>{t('common:header.description')}</p>
    </div>
  );
}

export { Header };
