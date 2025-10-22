import { PageProvider } from '@/providers/PageProvider';

function PageNotFound() {
  return (
    <PageProvider>
      <div className='flex flex-col flex-1 justify-center items-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>404</h1>
        <p className='text-base md:text-xl mt-2'>Not Found</p>
      </div>
    </PageProvider>
  );
}

export { PageNotFound };
