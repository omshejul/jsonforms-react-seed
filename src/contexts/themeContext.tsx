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
            document.body.className = mode === 'dark' ? 'dark-theme' : 'light-theme';
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
              default: '#000',
              paper: '#000',
            },
          }),
          ...(mode === 'light' && {
            background: {
              default: 'hsl(0, 0%, 98%)',
              paper: 'hsl(0, 0%, 98%)',
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
                margin:"-1px",
                boxShadow: 'none',
                border:"1px solid hsla(0, 0%, 50%, 0.3)",
                backdropFilter: "blur(10px)",
                backgroundColor: `${
                  mode === "dark" ? "rgba(10, 10, 10, 0.7)" : "rgba(255, 255, 255, 0.9)"
                  // mode === "dark" ? "rgba(17, 21, 30, 0.7)" : "rgba(255, 255, 255, 0.7)"
                }`,
                // boxShadow: '0px 0px 0px 1px hsla(0, 0%, 50%, 0.3)',
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
