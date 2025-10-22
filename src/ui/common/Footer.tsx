import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation(['common']);

  return (
    <div className='flex flex-col h-24 w-full bg-red-100 text-center justify-center'>
      <h3 className='text-2xl font-bold'>{t('common:footer.title')}</h3>
      <p>{t('common:footer.description')}</p>
    </div>
  );
}

export { Footer };
