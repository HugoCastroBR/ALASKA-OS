'use client'
import React from 'react'
import { MantineProvider, Button, createTheme, Loader, Tooltip } from '@mantine/core';
import RingLoader from '@/components/atoms/RingLoader';
import useStore from '@/hooks/useStore';


interface ThemeProvidersProps {
  children: React.ReactNode
}



const ThemeProviders = (
  { children }: ThemeProvidersProps
) => {

  const { states, dispatch } = useStore()
  
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
      Tooltip: Tooltip.extend({
        defaultProps: {
          withArrow: false,
          offset: 6,
          zIndex: 1000,
          color: states.Settings.settings.system.systemTextColor,
          bg: states.Settings.settings.system.systemBackgroundColor,
          transitionProps: { 
            duration: 150,
            timingFunction: 'ease',
            transition: 'pop',
          },
        },
      })
    },
  });

  return (
      <MantineProvider theme={theme}>
          <div className='bg-gradient-to-tl from-slate-100 via-cyan-300 to-blue-500'> 
            {children}
          </div>
      </MantineProvider>
  )
}

export default ThemeProviders