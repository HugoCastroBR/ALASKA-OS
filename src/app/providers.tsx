'use client'
import React from 'react'
import { Provider } from 'react-redux';
import store from '@/store';
import ThemeProviders from './ThemeProvider';
import { PythonProvider } from 'react-py'


interface ProvidersProps {
  children: React.ReactNode
}

const Providers = (
  { children }: ProvidersProps
) => {
  return (
    <Provider store={store}>
        <PythonProvider>
          <ThemeProviders>
            {children}
          </ThemeProviders>
        </PythonProvider>
    </Provider>


  )
}

export default Providers