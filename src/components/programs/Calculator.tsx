import React, { useEffect, useState } from 'react';
import CustomText from '../atoms/CustomText';
import DefaultWindow from '../containers/DefaultWindow';
import { programProps } from '@/types/programs';
import useSettings from '@/hooks/useSettings';

const Calculator = ({ tab, window }: programProps) => {
  const [expression, setExpression] = useState<string>('');

  const {settings} = useSettings()

  const [SystemDefaultHighlightColor, setSystemDefaultHighlightColor] = React.useState(settings?.system.systemHighlightColor)
  const [SystemDefaultBackgroundColor, setSystemDefaultBackgroundColor] = React.useState(settings?.system.systemBackgroundColor)
  const [SystemDefaultTextColor, setSystemDefaultTextColor] = React.useState(settings?.system.systemTextColor)

  useEffect(() => {
    if(settings?.system.systemTextColor === SystemDefaultTextColor) return 
    setSystemDefaultTextColor(settings?.system.systemTextColor)
  },[settings?.system.systemHighlightColor, SystemDefaultHighlightColor, settings?.system.systemTextColor, SystemDefaultTextColor])

  useEffect(() => {
    if(settings?.system.systemHighlightColor === SystemDefaultHighlightColor) return 
    setSystemDefaultHighlightColor(settings?.system.systemHighlightColor)
  },[settings?.system.systemHighlightColor, SystemDefaultHighlightColor])

  useEffect(() => {
    if(settings?.system.systemBackgroundColor === SystemDefaultBackgroundColor) return 
    setSystemDefaultBackgroundColor(settings?.system.systemBackgroundColor)
  },[settings?.system.systemBackgroundColor, SystemDefaultBackgroundColor])


  const handleButtonClick = (value: string) => {
    if (value === '=') {
      handleCalculate();
    } else if (['+', '-', '*', '/'].includes(value)) {
      // Adiciona espaço antes e depois do operador
      setExpression((prevExpression) => prevExpression + ` ${value} `);
    } else {
      setExpression((prevExpression) => prevExpression + value);
    }
  };

  const handleCalculate = () => {
    try {
      const result = new Function(`return ${expression}`)();
      setExpression(result.toString());
    } catch (error) {
      setExpression('Error');
    }
  };

  const handleClear = () => {
    setExpression('');
  };

  const handleScientificFunction = (func: string) => {
    setExpression((prevExpression) => prevExpression + func + '(');
  };

  const handlerRenderMathButtons = (name: string) => {
    switch (name) {
      case 'sqrt':
        return <span className='i-mdi-square-root' />;
      case 'pow':
        return <span className='i-mdi-exponent' />;
      case 'sin':
        return <span className='i-mdi-math-sin' />;
      case 'cos':
        return <span className='i-mdi-math-cos' />;
      default:
        return (
          <CustomText text={name} className='text-sm font-semibold text-black' />
        );
    }
  };

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Calculator'
      uuid={tab.uuid}
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      className='w-60 h-96'
    >
      <div className="flex flex-col justify-center items-center w-60 h-96 pb-8  bg-white">
        <div className="mb-4">
          <input
            type="text"
            value={expression}
            className="w-44 h-10 p-2 text-lg border border-gray-300 rounded-md outline-none"
            readOnly
          />
        </div>
        <div className="grid grid-cols-4 gap-1">
          {['7', '8', '9', 'sqrt', '4', '5', '6', 'pow', '1', '2', '3', '-', '0', '.', '=', '+', 'sin', 'cos','(',')'].map((value) => (
            <button
              key={value}
              onClick={() => (['sqrt', 'pow', 'sin', 'cos'].includes(value) ? handleScientificFunction(`Math.${value}`) : handleButtonClick(value))}
              className={`w-10 h-10 bg-gray-200 rounded-sm`}
            >
              {handlerRenderMathButtons(value)}
            </button>
          ))}
          <button onClick={handleClear} className="col-span-2 w-10 h-10 bg-red-200 rounded-sm">
            C
          </button>
        </div>
      </div>
    </DefaultWindow>
  );
};

export default Calculator;
