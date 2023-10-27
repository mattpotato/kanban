import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { FaEllipsis } from "react-icons/fa6"

interface Props {
  onDelete: () => void;
}

const TaskColumnDropDown: React.FC<Props> = ({ onDelete }) => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button><FaEllipsis className="hover:bg-slate-300 hover:opacity-90 rounded" size={24} /></Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="flex flex-col absolute top-full bg-white rounded border border-gray-400 p-2 w-40 cursor-pointer">
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`${active && 'bg-blue-400'}`}
                  onClick={onDelete}
                >
                  Delete
                </a>
              )}
            </Menu.Item>
          </Menu.Items>

        </Transition>
      </Menu>
    </div>
  )
}
export default TaskColumnDropDown;