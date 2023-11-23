import React, { useEffect, useRef, useState } from 'react'
import { Workbook, WorkbookInstance } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css"
import AppTaskMenu from '../molecules/AppTaskMenu';
import useFS from '@/hooks/useFS';
import { arrayToBase64, extractParentPath, base64ToXlsx, xlsxToBase64, base64ToArray, removeExtension } from '@/utils/file';
import { Button, Loader } from '@mantine/core';
import CustomText from '../atoms/CustomText';
import DefaultWindow from '../containers/DefaultWindow';
import { programProps } from '@/types/programs';
const SpreadSheet = ({
  tab,
  window
}: programProps) => {

  const { fs } = useFS()
  const sheet = useRef<WorkbookInstance>(null);


  const [data, setData] = useState<any>()
  const [file, setFile] = useState<File | null>(null)
  const [sheetBase64, setSheetBase64] = useState<string>('')
  const [dataLoaded, setDataLoaded] = useState<any>([])



  const handlerDataToFile = async () => {
    // const sheetData = sheet.current?.getAllSheets()
    // const file = await sheetData?.map(async (sheet) => {
    //   if (!sheet.data) return
    //   const dataBase64 = arrayToBase64(sheet.data as [])
    //   const res = await objectToXlsx(dataBase64, sheet.name)
    //   setFile(res)
    // })


    const sheetDoc = await sheet.current?.getAllSheets()[0]
    if(!sheetDoc) return
    const dataBase64 = arrayToBase64(sheetDoc.data as [])
    setSheetBase64(dataBase64)
    // const res = await objectToXlsx(dataBase64, sheetDoc.name)
    // setFile(res)

  }

  const handlerDataToBase64 = async () => {
    const sheetDoc = await sheet.current?.getAllSheets()[0]
    if(!sheetDoc) return
    const dataBase64 = arrayToBase64(sheetDoc.data as [])
    setSheetBase64(dataBase64)
  }


  useEffect(() => {
    if (!tab.value) {
      setLoading(false)
      return
    }
    if (tab.value === '/Desktop') {
      setLoading(false)
      return
    }
    fs?.readFile(`${tab.value}`, 'utf8', async (err, data) => {
      if (err) throw err
      if (data) {
        const res = await base64ToArray(data)
        setDataLoaded(res)
        setLoading(false)
      }
    })
    
  }, [fs, tab])

  const [loading, setLoading] = React.useState(true);
  const [saveAsInputOpen, setSaveAsInputOpen] = React.useState(false)
  const [saveAsName, setSaveAsName] = useState<string>(`${removeExtension(tab.ficTitle || '')}_new`)
  const handlerSaveAs = () => {
    if (!tab.value) return
    if (tab.value === '/Desktop') {
      const fileNewName = `${tab.value}/${saveAsName}.xlsx`
      fs?.writeFile(`${fileNewName}`, sheetBase64, (err) => {
        if (err) throw err
        console.log('File Saved!')
        setSaveAsInputOpen(false)
      })
    } else {
      const fileNewName = `${extractParentPath(tab.value || '/')}/${saveAsName}.xlsx}`
      fs?.writeFile(`${fileNewName}`, sheetBase64, (err) => {
        if (err) throw err
        console.log('File Saved!')
        setSaveAsInputOpen(false)
      })
    }

  }


  interface CellData {
    ct: { fa: string; t: string };
    m: string;
    v: string;
  }
  
  interface TransformedData {
    r: number;
    c: number;
    v: CellData;
  }
  
  function transformCelldata(celldata: Array<Array<CellData | null>>): TransformedData[] {
    // Inicializa o array de resultado
    let result: TransformedData[] = [];
  
    // Itera sobre as arrays aninhadas
    for (let i = 0; i < celldata.length; i++) {
      // Inicializa a array interna
      let innerArray = celldata[i];
  
      // Itera sobre os elementos da array interna
      for (let j = 0; j < innerArray.length; j++) {
        // Verifica se o elemento não é nulo
        if (innerArray[j] !== null) {
          // Extrai as propriedades relevantes
          let { ct, m, v } = innerArray[j] as CellData;
  
          // Adiciona o objeto transformado ao resultado
          result.push({
            r: i,
            c: j,
            v: { ct, m, v },
          });
        }
      }
    }
    return result;
  }

  useEffect(() => {
    if(!data) return
    handlerDataToBase64()
  },[data])
  
  if(loading){
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
        <div className='
          h-full w-full flex flex-col bg-white'>
          <div className='flex justify-center items-center w-full h-full bg-white'>
            <Loader size={64} />
          </div>
        </div>
      </DefaultWindow >
    )
  }

  return (
    <>
      {saveAsInputOpen &&
        <DefaultWindow
          currentTab={tab}
          currentWindow={window}
          preventDefaultClose
          onClose={() => {
            setSaveAsInputOpen(false)
          }}
          title='Save As'
          uuid={tab.uuid}
          className='absolute !w-64 !h-32 bg-slate-200 bg-opacity-60 flex  !z-40  '>
          <div className='w-full h-full flex flex-col justify-evenly items-end'>
            <input
              autoFocus
              defaultValue={`${removeExtension(tab.ficTitle || '')}_new`}
              onChange={(e) => {
                setSaveAsName(e.target.value)
              }}
              placeholder='File Name'
              className='
            mr-2
            w-60 h-8 bg-gray-200 flex flex-col resize
            outline-none rounded-md border border-gray-400
          '
            />
            <Button
              onClick={() => {
                handlerSaveAs()
              }}
              styles={{
                root: {
                  backgroundColor: 'transparent',
                  color: '#fff',
                  width: '6rem',
                  height: '2rem',
                  marginRight: '8px',
                  borderRadius: '0.25rem',
                  border: '1px solid gray',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                }
              }}
            >
              <CustomText text='Save' />
            </Button>
          </div>
        </DefaultWindow>
      }
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

        <div className='absolute w-full h-6 top-0'>
          <AppTaskMenu
            onSave={() => {
              if (!tab.value) return
              if (tab.value === '/Desktop') return
              fs?.writeFile(`${tab.value}`, sheetBase64, (err) => {
                if (err) throw err
                console.log('File Saved!')
              })
            }}
            onSaveAs={() => {
              setSaveAsInputOpen(true)
            }}
          />
        </div>
        <div
          className='w-full h-full mt-6 resize overflow-auto'
        >
          <Workbook
            hooks={{
              afterActivateSheet: (sheet: any) => {
                console.log(sheet)
              }
            }}
            ref={sheet}
            data={[
              {
                name: "Sheet1",
                id: "Sheet1",
                celldata: transformCelldata(dataLoaded),
              }
            ]}
            showSheetTabs={false}
            allowEdit={true}
            rowHeaderWidth={100}
            onChange={(data: any) => {
              setData(data)
            }}
          />
        </div>
      </DefaultWindow>
    </>
  )
}

export default SpreadSheet 