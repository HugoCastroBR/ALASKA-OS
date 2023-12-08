import { programProps } from "@/types/programs";
import DefaultWindow from "../containers/DefaultWindow";
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';
const CalendarProgram = ({
  tab,
  AlaskaWindow,
}: programProps) => {

  
  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      title={tab.ficTitle || tab.title}
      uuid={tab.uuid}
      resizable
      onClose={() => { }}
      onMinimize={() => { }}
      className="w-80 h-80"
    >
      <div
        className="w-full h-full flex justify-center items-center bg-white"
      >
        <Calendar
          renderDay={(date) => {
            const day = date.getDate()
            const currentDay = new Date().getDate()
            return (
              <Indicator size={6} color="blue" offset={-2} disabled={day !== currentDay}>
                <div>{day}</div>
              </Indicator>
            );
          }}
        
        />
      </div>
    </DefaultWindow>
  )
}

export default CalendarProgram