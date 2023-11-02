import { Box, GlobalStyles } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import SessionProvider from '../context/session';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Box
        marginHorizontal={{
          mobile: 'xxLarge',
          tablet: 'xxLarge',
          desktop: 'xxLarge',
        }}
        marginVertical={{ mobile: 'xxLarge', tablet: 'xxLarge', desktop: 'xxLarge' }}
      >
        <div
          style={{
            height: 'calc(100vh - 70px)',
            width: '100%',
          }}
        >
          <SessionProvider>
            <Component {...pageProps} />
          </SessionProvider>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default MyApp;
