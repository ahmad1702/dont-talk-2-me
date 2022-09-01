import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { UserProvider } from '../Auth/UserProvider';

const lightTheme = createTheme({
  type: 'light',
  className: 'light',
  theme: {
    colors: {
      primary: '$yellow600',
    }
    // colors: { ...}, // optional
  }
})

const darkTheme = createTheme({
  type: 'dark',
  className: 'dark',
  theme: {
    colors: {
      primary: '$yellow600',
    }
    // colors: { ...}, // optional
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp
