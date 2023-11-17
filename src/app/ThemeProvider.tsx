'use client'
import React from 'react'
import { MantineProvider, Button, Group, createTheme, Loader } from '@mantine/core';
import RingLoader from '@/components/atoms/RingLoader';


interface ThemeProvidersProps {
  children: React.ReactNode
}

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        color: 'cyan',
        variant: 'outline',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
  },
});

const ThemeProviders = (
  { children }: ThemeProvidersProps
) => {
  return (
      <MantineProvider theme={theme}>
          <div className='bg-gradient-to-tl from-slate-100 via-cyan-300 to-blue-500'> 
            {children}
          </div>
      </MantineProvider>
  )
}

export default ThemeProviders