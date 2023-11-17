import React, { useState, useRef } from 'react';
import { Editor } from "novel";
import { format } from 'date-fns';
import CalendarModal from "../Calendar/CalendarModal"
import { FiHexagon, FiTrash2, FiCalendar } from 'react-icons/fi';

const Note = ({ index, onDelete, title, content }) => {
  const [ isEditingTitle, setIsEditingTitle ] = useState(false);
  const [ editedTitle, setEditedTitle ] = useState(title);
  const [ selectedDate, setSelectedDate ] = useState(null);
  const [ isCalendarModalOpen, setIsCalendarModalOpen ] = useState(false);
  const calendarRef = useRef(null);

  const handleDelete = () => {
    onDelete(index);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleOpenCalendarModal = () => {
    setIsCalendarModalOpen(!isCalendarModalOpen);
  };

  return (
    <div className="group py-2 rounded-lg border-2 border-transparent hover:border-2 hover:border-slate-300 hover:bg-slate-100 ">
      <div className="flex justify-between items-center ">
        <div className="flex items-center">
          <FiHexagon className="w-5 h-5 ml-6 mr-2 text-orange-400  group-hover:fill-current " />
          { isEditingTitle ? (
            <input
              type="text"
              value={ editedTitle }
              onChange={ handleTitleChange }
              onBlur={ handleTitleBlur }
              className="text-2xl font-light bg-white outline-none border-none p-0 m-0 min-w-min group-hover:bg-slate-100"
            />
          ) : (
            <span
              className="text-2xl font-light min-w-min cursor-pointer"
              onClick={ handleTitleClick }
            >
              { editedTitle }
            </span>
          )}
        </div>
        <div className='flex items-center'>
        { selectedDate && (
          <span className='ml-2 text-slate-500 '>
            {format(selectedDate, 'yyyy-MM-dd')}
          </span>
        )}
        <FiCalendar
          id="fi-calendar"
          ref={ calendarRef }
          className="w-5 h-5 mx-2 cursor-pointer text-gray-400 hover:text-gray-500"
          onClick={ handleOpenCalendarModal }
        />
        <FiTrash2
          className="w-5 h-5 mr-10 cursor-pointer text-gray-400 hover:text-gray-500"
          onClick={() => handleDelete(index)}
        />
        </div>
      </div>
      <Editor className="my-container min-h-[100px] w-full rounded-lg" defaultValue={content} />
      { isCalendarModalOpen && (
        <CalendarModal
          isOpen={ isCalendarModalOpen }
          onClose={() => setIsCalendarModalOpen(false)}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setIsCalendarModalOpen(false);
          }}
          preselectedDate={ selectedDate }
          targetRef={ calendarRef }
        />
      )}
    </div>
  );
};

export default Note;
