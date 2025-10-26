import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
];

function LanguageSwitcherContainer() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='cursor-pointer group px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl'>
        <MdLanguage className='w-5 h-5' />
        <span className='font-semibold'>{currentLanguage.flag}</span>
        <span className='hidden sm:inline'>{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className='absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden z-20'>
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                  i18n.language === language.code
                    ? 'bg-purple-600/30 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}>
                <span className='text-2xl'>{language.flag}</span>
                <span className='font-medium'>{language.name}</span>
                {i18n.language === language.code && (
                  <svg
                    className='w-5 h-5 ml-auto text-purple-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { LanguageSwitcherContainer };
