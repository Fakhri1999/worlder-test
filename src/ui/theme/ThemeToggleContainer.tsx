import { MdDarkMode as MoonIcon, MdLightMode as SunIcon } from 'react-icons/md';

import { useTheme } from '@/providers/ThemeProvider';

function ThemeToggleContainer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className='group cursor-pointer px-4 py-2 bg-app-card/50 backdrop-blur-sm text-app-primary rounded-xl hover:bg-app-card/60 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 shadow-lg hover:shadow-xl'
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }>
      <div className='relative w-5 h-5'>
        <SunIcon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
        />
      </div>
      <span className='hidden sm:inline font-semibold'>
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export { ThemeToggleContainer };
