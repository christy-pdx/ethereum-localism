/**
 * Inline script that runs before React hydrates to set theme class and prevent flash.
 * Must be in head or start of body.
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var key = 'ethereum-localism-theme';
            var stored = localStorage.getItem(key);
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = stored === 'dark' ? true : stored === 'light' ? false : prefersDark;
            if (isDark) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          })();
        `,
      }}
    />
  );
}
