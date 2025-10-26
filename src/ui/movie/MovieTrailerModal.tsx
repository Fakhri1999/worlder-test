import { useEffect } from 'react';
import { IoClose as CloseIcon } from 'react-icons/io5';

interface TrailerModalProps {
  videoKey: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

function MovieTrailerModal({
  videoKey,
  isOpen,
  onClose,
  title,
}: TrailerModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn'
      onClick={onClose}>
      <div
        className='relative w-full max-w-5xl bg-gradient-to-br from-app-card to-app-surface rounded-2xl shadow-2xl border border-app-border overflow-hidden animate-slideInUp'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-app-border'>
          <h3 className='text-xl sm:text-2xl font-bold text-app-primary'>
            {title || 'Trailer'}
          </h3>
          <button
            onClick={onClose}
            className='p-2 hover:bg-app-tertiary rounded-full transition-colors cursor-pointer'
            aria-label='Close trailer'>
            <CloseIcon className='w-6 h-6 sm:w-8 sm:h-8 text-app-primary' />
          </button>
        </div>

        <div className='relative w-full' style={{ paddingTop: '56.25%' }}>
          <iframe
            className='absolute inset-0 w-full h-full'
            src={`https://www.youtube.com/embed/${videoKey}?rel=0`}
            title='Movie Trailer'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export { MovieTrailerModal as MovieTrailerModal };
