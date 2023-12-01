import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import useStore from '@/hooks/useStore'
import { Button, Checkbox, Loader, SimpleGrid, TextInput } from '@mantine/core'
import { TodoListProps, TodoProps, programProps } from '@/types/programs'
import { uuid } from '@/utils/file'
import useFS from '@/hooks/useFS'
import { ApiError } from 'browserfs/dist/node/core/api_error'
import DefaultWindow from '../containers/DefaultWindow'
import TaskItem from '../organisms/TaskItem'

const TodoApp = ({
  tab,
  window
}:programProps) => {

  const { states, dispatch } = useStore()
  const { fs } = useFS()

  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = React.useState('')


  const todoAppDir = '/ProgramFiles/todoApp'

  const [todoLists, setTodoLists] = useState<TodoListProps[]>([])
  const [currentList, setCurrentList] = useState<TodoListProps>({} as TodoListProps)

  const [tasks, setTasks] = useState<TodoProps[]>([])

  const [titleValue, setTitleValue] = React.useState<string>(currentList?.title || 'Untitled' )



  useEffect(() => {
    if (fs) {
      loadTodoLists()
    }
  }, [fs])


  useEffect(() => {
    if (currentList) {
      setTasks(currentList.todos)
      setTitleValue(currentList.title)
      // loadTodoLists()
    }
  }, [currentList])

  useEffect(() => {
    console.log("todoLists")
    if(!Object?.keys(currentList || {}).length){
      setCurrentList(todoLists[0])
    }
  }, [todoLists])

  const loadTodoListByUUID = (uuid: string) => {
    if (fs) {
      fs.readFile(`${todoAppDir}/${uuid}/list.json`, 'utf8', (err, data) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        if (!data) {
          setIsLoading(false)
          return
        }
        const _todoList: TodoListProps = JSON.parse(data)
        setCurrentList(_todoList)
        setIsLoading(false)
      })
    }
  }

  const loadTodoLists = () => {
    setTodoLists([])
    if (fs) {
      fs.readdir(todoAppDir, (err, files) => {
        if (err) {
          console.log(err)
          if (err.errno === 2) {
            fs.mkdir(todoAppDir, (err: ApiError) => {
              if (err) {
                console.log(err)
                setIsLoading(false)
                return
              }
              console.log('Created todoApp folder!')
              createTodoList({
                title: 'Favorites',
                icon: 'i-mdi-star',
                createdAt: new Date().toISOString(),
                uuid: uuid(6),
                todos: [],
              })
              
            })
          }
          setIsLoading(false)
          return
        } else {
          files?.forEach((file) => {
            fs.readFile(`${todoAppDir}/${file}/list.json`, 'utf8', (err, data) => {
              if (err) {
                console.log(err)
                setIsLoading(false)
                return
              }
              if (!data) {
                setIsLoading(false)
                return
              }
              const _todoList: TodoListProps = JSON.parse(data)
              setTodoLists((prev) => [...prev, _todoList])
              setIsLoading(false)
            })

          })
          setIsLoading(false)
        }
      })
    }
  }

  const createNewTask = ({
    title,
    description,
    completed,
    createdAt,
    uuid,
  }: TodoProps) => {
    if (fs) {
      
      const NewCurrentList = {
        ...currentList,
        todos: [...currentList?.todos || [], {
          title,
          description,
          completed,
          createdAt,
          uuid,
        }]
      }

      fs.writeFile(`${todoAppDir}/${currentList?.uuid}/list.json`, JSON.stringify(NewCurrentList), (err) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        console.log('Created todoApp list!')
        setCurrentList(NewCurrentList)
      })
    }
    else {
      console.log('No fs!')
    }
  }

  const UpdateTask = ({
    title,
    description,
    completed,
    createdAt,
    uuid,
  }: TodoProps) => {
    if (fs) {

      const todosBefore = currentList?.todos?.filter((item) => item.uuid !== uuid)
      const updatatedTodos = [...todosBefore || [], {
        title,
        description,
        completed,
        createdAt,
        uuid,
      }]

      const NewCurrentList = {
        ...currentList,
        todos: updatatedTodos,
      }


      fs.writeFile(`${todoAppDir}/${currentList?.uuid}/list.json`, JSON.stringify(NewCurrentList), (err) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        console.log('Saved!')
        setCurrentList(NewCurrentList)
      })
    }
    else {
      console.log('No fs!')
    }
  }

  const removeTask = (uuid: string) => {
    if (fs){
      const todosBefore = currentList?.todos?.filter((item) => item.uuid !== uuid)
      const NewCurrentList = {
        ...currentList,
        todos: todosBefore,
      }
      fs.writeFile(`${todoAppDir}/${currentList?.uuid}/list.json`, JSON.stringify(NewCurrentList), (err) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        console.log('Saved!')
        setCurrentList(NewCurrentList)
      })
    }
    else{
      console.log('No fs!')
    }
  }

  const createTodoList = ({
    title,
    icon,
    createdAt,
    uuid,
    todos,
  }: TodoListProps) => {
    if (fs) {
      fs.mkdir(`${todoAppDir}/${uuid}`, (err: ApiError) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        } else {
          console.log('Created todoApp folder!')
          const data = JSON.stringify({
            title,
            icon,
            createdAt,
            uuid,
            todos,
          })
          fs?.writeFile(`${todoAppDir}/${uuid}/list.json`, data, (err) => {
            if (err) {
              console.log(err)
              setIsLoading(false)
              return
            }
            console.log('Created todoApp list!')
            loadTodoLists()
          })
        }

      })
    } else {
      console.log('No fs!')
    }
  }

  interface ListItemProps {
    title: string
    className?: string
    onClick?: () => void
  }
  const ListItem = ({
    title,
    className,
    onClick,
  }: ListItemProps) => {

    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <div
        className='w-full h-8 flex my-1 p-1 rounded-sm rounded-t-md
      justify-between items-center cursor-pointer border-b-2
      drop-shadow-md backdrop-filter backdrop-blur-sm
      '
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
          borderColor: states.Settings.settings.system.systemHighlightColor || 'white',

        }}
      >
        <div className='flex items-center'>
          <span
            className={`${className} text-lg mr-2`}
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
          <CustomText
            text={title}
            className='!text-base font-semibold text-center'
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
        </div>
        <span
          className={`i-mdi-menu-right text-2xl 
          transition-all duration-300 ease-in-out
          -mr-2
        `}
          style={{
            color: isHovered ? states.Settings.settings.system.systemHighlightColor || 'white' : 'transparent',
          }}
        />
      </div>
    )
  }

  const [selectedClassName, setSelectedClassName] = React.useState<string | undefined>(undefined)

  interface IconSelectListItemProps {
    className: string
  }
  const IconSelectListItem = ({
    className,
  }: IconSelectListItemProps) => {





    return (
      <div className={`w-7 h-7 flex justify-center items-center rounded-md
      bg-slate-600 bg-opacity-30 cursor-pointer hover:bg-slate-500
      transition-all duration-300 ease-in-out ${selectedClassName === className ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => {
          setSelectedClassName(className)
        }}
      >
        <span
          className={`${className} text-xl`}
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white',
          }}
        />
      </div>
    )
  }



  const [listName, setListName] = React.useState<string>()
  const [selected, setSelected] = React.useState(false)


  const handlerSaveNewList = (title: string, icon: string) => {
    const newList: TodoListProps = {
      title: title || 'Untitled',
      icon: icon || 'i-mdi-question-mark',
      todos: [],
      createdAt: new Date().toISOString(),
      uuid: uuid(6)
    }

    createTodoList(newList)
  }

  const deleteList = (uid: string) => {
    if(fs){
      fs?.unlink(`${todoAppDir}/${uid}/list.json`, (err) => {
        if(err){
          console.log(err)
          return
        }
        fs?.rmdir(`${todoAppDir}/${uid}`,  (err) => {
          if(err){
            console.log(err)
            return
          }
          loadTodoLists()
          setIsLoading(true)
        })
      })
    }
    else{
      console.log('No fs!')
    }
  }

  

  const handlerSaveNewTask = (title: string, description: string) => {
    const NewTaskObject: TodoProps = {
      title: title || 'Untitled',
      description: description || 'No Description',
      completed: false,
      createdAt: new Date().toISOString(),
      uuid: uuid(6),
    }

    createNewTask(NewTaskObject)

  }

  const [isHovered, setIsHovered] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const [title, setTitle] = React.useState<string>()
    const [description, setDescription] = React.useState<string>()

  const AddTaskItem = ({ }) => {

    


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
            <span
              className='!text-lg i-mdi-plus font-semibold text-center'
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
            <CustomText
              text={'Add New Task'}
              className='!text-base font-semibold text-start ml-2 w-full'
              onClick={() => setIsOpen(!isOpen)}
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
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
              text='Title:'
              className='!text-sm mt-1 text-start w-full '
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
                height: isOpen ? '32px' : '0px',
              }}
            />
            <input
              className='w-full rounded-md outline-none'
              type='text'
              value={title || ''}
              onChange={(e) => {
                setTitle(e.currentTarget.value)
              }}
              style={{
                resize: 'both',
                height: isOpen ? '24px' : '0px',
              }}
            />
            <CustomText
              text='Description:'
              className='!text-sm mt-1 text-start w-full '
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
                height: isOpen ? '24px' : '0px',
              }}
            />
            <textarea
              className='w-full rounded-md outline-none'
              value={description || ''}
              onChange={(e) => {
                setDescription(e.currentTarget.value)
              }}
              style={{
                resize: 'both',
                height: isOpen ? '64px' : '0px',
              }}
            />
          </div>
          <div className='flex justify-between w-full'
            style={{
              height: isOpen ? '32px' : '0px',
            }}
          >
            <div className='flex justify-end w-full'>
              <Button
                className='w-full h-6 mx-1'
                color='red'
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                <CustomText
                  text='Cancel'
                  className='!text-xs font-semibold text-center'
                  style={{
                    color: 'red',
                  }}
                />
              </Button>
              <Button
                className='w-full h-6 mx-1'
                color='green'
                onClick={() => {
                  handlerSaveNewTask(title || '', description || '')
                  setIsOpen(false)
                }}
              >
                <CustomText
                  text='Add'
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

  if (isLoading) {
    return (
      <div
        className='absolute w-1/2 h-1/2 top-1/4 left-1/4
    flex flex-col  overflow-hidden
    rounded-lg bg-white'
      >
        <div
          className='w-full h-full flex items-center justify-center'
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
          }}
        >
          <Loader size={128} />
        </div>
      </div>
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Todo App'
      uuid={tab.uuid}
      resizable
      onClose={() => {}}
      onMinimize={() => {}}
    >
      <div
        className='w-full h-full flex'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
        }}
      >
        <div className='h-full w-1/3 border-r border-slate-500 border-opacity-30'>
          <div className='w-full h-32 flex flex-col justify-center items-start px-2'>
            <CustomText
              text='Menu'
              className='!text-2xl font-semibold text-center'
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
            <TextInput
              placeholder='Search'
              value={searchValue || ''}
              onChange={(e) => {
                setSearchValue(e.currentTarget.value)
              }}
              className='mt-1 w-full'
              radius={8}
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
          </div>
          <div className=' w-full h-[calc(100%-128px)] flex-col p-1 overflow-x-hidden overflow-y-auto'>
            <div
              className='w-full flex my-1 p-1 rounded-sm rounded-t-md
              justify-between items-center cursor-pointer border-b-2
              drop-shadow-md backdrop-filter backdrop-blur-sm
              transition-all duration-300 ease-in-out overflow-hidden
              '

              style={{
                backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
                borderColor: states.Settings.settings.system.systemHighlightColor || 'white',
                height: selected || selectedClassName ? '240px' : '32px',
                flexDirection: selected || selectedClassName ? 'column' : 'row',
              }}
            >
              <div className='flex items-start w-full'
                onClick={() => {
                  setSelected(true)
                }}
              >
                <span
                  className={`i-mdi-add text-xl mr-2`}
                  style={{
                    color: states.Settings.settings.system.systemTextColor || 'white',
                  }}
                />
                <input
                  className='!text-sm w-full bg-transparent'
                  placeholder='Add List'
                  value={listName || ''}
                  onChange={(e) => {
                    setListName(e.currentTarget.value)
                  }}
                  style={{
                    color: states.Settings.settings.system.systemTextColor || 'white',
                  }}
                />
              </div>
              <CustomText
                text='Select Icon:'
                className='!text-xs text-start h-4 w-full my-2 '
                style={{
                  color: states.Settings.settings.system.systemTextColor || 'white',
                  display: selected || selectedClassName ? 'block' : 'none',
                }}
              />
              <div
                className='w-full cursor-default overflow-hidden pt-2 pl-1 pr-4 '
                style={{
                  height: selected || selectedClassName ? '180px' : '0px',
                  display: selected || selectedClassName ? 'block' : 'none',
                }}
              >
                <SimpleGrid cols={6}>
                  <IconSelectListItem
                    className='i-mdi-math-compass'
                  />
                  <IconSelectListItem
                    className='i-mdi-account'
                  />
                  <IconSelectListItem
                    className='i-mdi-weather-sunny'
                  />
                  <IconSelectListItem
                    className='i-mdi-weather-night'
                  />
                  <IconSelectListItem
                    className='i-mdi-weather-sunset'
                  />
                  <IconSelectListItem
                    className='i-mdi-web'
                  />
                  <IconSelectListItem
                    className='i-mdi-picture'
                  />
                  <IconSelectListItem
                    className='i-mdi-cart'
                  />
                  <IconSelectListItem
                    className='i-mdi-cash'
                  />
                  <IconSelectListItem
                    className='i-mdi-bank'
                  />
                  <IconSelectListItem
                    className='i-mdi-question-mark'
                  />
                  <IconSelectListItem
                    className='i-mdi-music'
                  />
                  <IconSelectListItem
                    className='i-mdi-message'
                  />
                  <IconSelectListItem
                    className='i-mdi-car'
                  />
                  <IconSelectListItem
                    className='i-mdi-bike'
                  />
                  <IconSelectListItem
                    className='i-mdi-passport'
                  />
                  <IconSelectListItem
                    className='i-mdi-airplane'
                  />
                  <IconSelectListItem
                    className='i-mdi-tree'
                  />
                </SimpleGrid>
                <SimpleGrid
                  cols={2}
                  className='mt-2 w-full'
                >
                  <Button
                    className='w-full h-6'
                    color='red'
                    onClick={() => {
                      setSelected(false)
                      selectedClassName && setSelectedClassName(undefined)
                    }}
                  >
                    <CustomText
                      text='Cancel'
                      className='!text-xs font-semibold text-center'
                      style={{
                        color: 'red',
                      }}
                    />
                  </Button>
                  <Button
                    className='w-full h-6'
                    color='green'
                    onClick={() => {
                      handlerSaveNewList(listName || '', selectedClassName || '')
                      setListName('')
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
                </SimpleGrid>
              </div>
            </div>
            {todoLists.filter((item) => {
              if (searchValue) {
                return item.title.toLowerCase().includes(searchValue.toLowerCase())
              }
              return true
            }).map((list) => {
              return (
                <ListItem
                  key={list.uuid}
                  title={list.title}
                  className={list.icon}
                  onClick={() => {
                    loadTodoListByUUID(list.uuid)
                  }}
                />
              )
            })}
          </div>
        </div>
        <div className='h-full w-2/3 flex flex-col'>
          <div className='h-16 w-full flex p-2 justify-between items-center'>
          <input
            defaultValue={currentList?.title}
            value={titleValue}
            onChange={(e) => {
              setTitleValue(e.currentTarget.value)
            }}
            onKeyPress={(e) => {
              if(e.key === 'Enter'){
                e.currentTarget.blur()
              }
            }}
            onBlur={() => {
              if(fs){
                const newListData = {
                  ...currentList,
                  title: titleValue,
                }
                fs.writeFile(`${todoAppDir}/${currentList?.uuid}/list.json`, JSON.stringify(newListData), (err) => {
                  if(err){
                    console.log(err)
                    return
                  }
                  setCurrentList(newListData)
                  loadTodoLists()
                })
              }
              else{
                console.log('No fs!')
              }
            }}
            className='!text-xl font-semibold text-start outline-none'
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
              backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
            }}
          />
            <Button
              className='w-1/3 h-6 mx-1'
              color='red'
              onClick={() => {
                deleteList(currentList?.uuid || '')
              }}
            >
              <CustomText
                text='Delete List'
                className='!text-xs font-semibold text-center'
                style={{
                  color: 'red',
                }}
              />
            </Button>
          </div>
          <div className='w-full  h-[calc(100%-64px)] flex-col overflow-x-hidden overflow-y-auto p-1'>
            <AddTaskItem />
            {tasks
              ?.sort((a, b) => {
                if (a.completed === b.completed) {
                  return a.title.localeCompare(b.title);
                }
                return !a.completed ? -1 : 1;
              })
              ?.map((task) => (
                <TaskItem
                  key={task.uuid}
                  completed={task.completed}
                  title={task.title}
                  description={task.description}
                  createdAt={task.createdAt}
                  uuid={task.uuid}
                  removeTask={removeTask}
                  UpdateTask={UpdateTask}
                  
                />
              ))}
          </div>
        </div>
      </div>
    </DefaultWindow>
  )
}

export default TodoApp