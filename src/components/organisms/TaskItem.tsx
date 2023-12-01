import { TodoProps } from '@/types/programs'
import { Checkbox, Button } from '@mantine/core'
import React from 'react'
import CustomText from '../atoms/CustomText'
import useStore from '@/hooks/useStore'

type Props = & TodoProps & {
  UpdateTask: (task: TodoProps) => void
  removeTask: (uuid: string) => void
}

const TaskItem = ({
  completed,
  title,
  description,
  createdAt,
  uuid,
  UpdateTask,
  removeTask,
}: Props) => {

  const {states} = useStore()

  const [isHovered, setIsHovered] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const [taskTitle, setTaskTitle] = React.useState<string>(title)
  const [taskDescription, setTaskDescription] = React.useState<string>(description)
  const [taskCompleted, setTaskCompleted] = React.useState<boolean>(completed)


  return (
    <div className='w-full flex my-1 p-1 rounded-md 
    justify-between items-start flex-col
    drop-shadow-md backdrop-filter backdrop-blur-sm h-8
    transition-all duration-300 ease-in-out
    border border-transparent 
    '
      style={{
        backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
        borderColor: isHovered ? states.Settings.settings.system.systemHighlightColor || 'white' : 'transparent',
        height: isOpen ? '264px' : '32px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex h-8 w-full justify-between items-start'>
        <div className='flex h-8 -mt-1 w-4/5 items-center cursor-pointer'>
          <Checkbox
            defaultChecked={taskCompleted}
            checked={taskCompleted}
            onChange={() => {
              UpdateTask({
                title: taskTitle,
                description: taskDescription,
                completed: !taskCompleted,
                createdAt,
                uuid,
              })
              setTaskCompleted(!taskCompleted)
            }}
            className='!text-base font-semibold text-center'
          />
          {!isOpen ?
            <CustomText
            text={title}
            className='!text-base font-semibold text-start ml-2 w-full'
            onClick={() => setIsOpen(!isOpen)}
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
          :
          <input
            defaultValue={title}
            className='!text-base font-semibold text-start ml-2 w-full 
            outline-none rounded-md p-0.5 h-6'
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.currentTarget.value)
            }}
            />}
        </div>
        <span
          onClick={() => setIsOpen(!isOpen)}
          className={`i-mdi-menu-right text-4xl 
          transition-all duration-300 ease-in-out
          -mr-8 flex justify-end w-1/5 cursor-pointer
        `}
          style={{
            color: isHovered ? states.Settings.settings.system.systemHighlightColor || 'white' : 'transparent',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            marginTop: '-7px',
          }}
        />
      </div>
      <div className='w-full flex-col px-1'
        style={{
          height: isOpen ? '232px' : '0px',
          display: isOpen ? 'flex' : 'none',
          overflowX: 'hidden',
          overflowY: isOpen ? 'auto' : 'hidden',
        }}
      >
        <div className='flex flex-col w-full'
          style={{
            height: isOpen ? '178px' : '0px',
            display: isOpen ? 'flex' : 'none',
            overflowX: 'hidden',
            overflowY: isOpen ? 'auto' : 'hidden',
          }}
        >
          <CustomText
            text='Description:'
            className='!text-sm mt-1 text-start w-full '
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
              height: isOpen ? '32px' : '0px',
            }}
          />
          <textarea
            className='w-full rounded-md outline-none p-0.5'
            defaultValue={description}
            value={taskDescription}
            onChange={(e) => {
              setTaskDescription(e.currentTarget.value)
            }}
            style={{
              resize: 'both',
              height: isOpen ? '120px' : '0px',
            }}
          />
        </div>
        <div className='flex justify-between w-full'
          style={{
            height: isOpen ? '32px' : '0px',
          }}
        >
          <CustomText
            text={`Created At: ${new Date(createdAt).toLocaleString()}`}
            className='!text-xs mt-5 text-start w-full '
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
          <div className='flex justify-end w-full'>
          <Button
              className='w-full h-6  mx-px'
              p={6}
              color='red'
              onClick={() => {
                setIsOpen(false)
                removeTask(uuid)
              }}
            >
              <span 
              className='i-mdi-trash'
              style={{
                color: 'red',
              }}
              />
            </Button>
            <Button
              className='w-full h-6 mx-px'
              color='red'
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <CustomText
                text='Close'
                className='!text-xs font-semibold text-center'
                style={{
                  color: 'red',
                }}
              />
            </Button>
            <Button
              className='w-full h-6 mx-px'
              color='green'
              onClick={() => {
                UpdateTask({
                  title: taskTitle,
                  description: taskDescription,
                  completed: taskCompleted,
                  createdAt,
                  uuid,
                })
                setIsOpen(false)
              }}
            >
              <CustomText
                text='Save'
                className='!text-xs font-semibold text-center'
                style={{
                  color: 'green'
                }}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskItem