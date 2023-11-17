'use client'
import React from 'react'
import { Provider } from 'react-redux';
import store from '@/store';
import ThemeProviders from './ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = (
  { children }: ProvidersProps
) => {
  return (
    <Provider store={store}>
        <ThemeProviders>
          {children}
        </ThemeProviders>
    </Provider>


  )
}

export default Providers