'use client'
import React, { useEffect, useState } from 'react'
import useFS from '@/hooks/useFS';
import DefaultWindow from '../containers/DefaultWindow';
import { programProps } from '@/types/programs';
import { Loader } from '@mantine/core';

const PdfReader = ({
  tab,
  window,
}: programProps) => {

  const { fs } = useFS();
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    if (!tab.value) return
    if (tab.value === '/Desktop') return
    fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
      if (err) throw err
      if (data) {
        setPdfContent(data)
        setIsLoading(false)
      }
    })
  }, [fs])

  const [pdfContent, setPdfContent] = useState<string | null>(null);

  if(isLoading) return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='PDF Reader'
      uuid={tab.uuid}
      resizable
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      className='w-1/4 h-2/5 flex flex-col !bg-white'
    >
      <div className='w-full h-full flex justify-center items-center'>
        <Loader/>
      </div>
    </DefaultWindow>
  )

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title={tab.ficTitle || tab.title}
      uuid={tab.uuid}
      resizable
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
    >
      {pdfContent && (
        <iframe
          title={`PDF Viewer - ${tab.ficTitle || 'File'}`}
          src={`data:application/pdf;base64,${pdfContent}`}
          width="100%"
          height="100%"
        ></iframe>
      )}

    </DefaultWindow>
  );
};

export default PdfReader;
