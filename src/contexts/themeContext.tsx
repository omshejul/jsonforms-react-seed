import React, { createContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
});

export const CustomThemeProvider: React.FC = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(
        localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
      );
          useEffect(() => {
      document.body.className = theme ? 'dark-theme' : 'light-theme';
    }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newMode);
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));

      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          ...(mode === 'dark' && {
            primary: {
              main: '#65baff',
            },
            error: {
              main: 'rgb(255, 118, 111)',
            },
            background: {
              default: '#1E2129',
              paper: 'rgba(24, 27, 34)',
            },
          }),
          ...(mode === 'light' && {
            background: {
              default: 'hsl(0, 0%, 98%)',
              paper: 'rgba(255, 255, 255)',
            },
          }),
        },
        components: {
          MuiFormControl: {
            styleOverrides: {
              root: {
                margin: '0.8rem 0',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '0px 0px 0px 1px hsla(0, 0%, 50%, 0.3)',
              },
            },
          },
        },
        typography: {
          fontFamily: [
            'Figtree',
            'sans-serif'
          ].join(','),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
