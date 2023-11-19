import { programProps } from '@/types/programs'
import React from 'react'
import DefaultWindow from '../containers/DefaultWindow'

const PokemonFireRed = ({
  tab,
  window,
}:programProps) => {
  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Pokemon Fire Red'
      uuid={tab.uuid}
      onClose={() => { }}
      onMinimize={() => { }}
      resizable
    >
      <iframe 
      src="/games/pokemonFireRed.html" 
      onLoadStart={() => {
        console.log('loading')
      }}
      height="100%"
      width="100%" ></iframe>
    </DefaultWindow>
  )
}

export default PokemonFireRed