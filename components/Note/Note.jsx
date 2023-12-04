import React, { useState, useRef } from 'react';
import { Editor } from "novel";
import { format } from 'date-fns';
import CalendarModal from "../Calendar/CalendarModal"
import { FiTrash2, FiCalendar, FiCircle } from 'react-icons/fi';
import { useDrag, useDrop } from 'react-dnd';

const Note = ({ index, note, title, content, moveNote, onDateSelect, onDelete, onUpdate, onDateUpdate  }) => {
  const noteContent = note ? note.content : '';
  const calendarRef = useRef(null);
  const ref = useRef(null);
  const grabRef = useRef(null);
  const [ isEditingTitle, setIsEditingTitle ] = useState(false);
  const [ editedTitle, setEditedTitle ] = useState(title);
  const [ editContent, setEditContent ] = useState(noteContent);
  const [ selectedDate, setSelectedDate ] = useState(null);
  const [ isCalendarModalOpen, setIsCalendarModalOpen ] = useState(false);

  const handleDelete = () => {
    onDelete(index);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
    onUpdate(note.id, { ...note, title: e.target.value });
  };  

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleContentChange = (editor) => {
    const updatedContent = editor.getJSON();
    setEditContent(updatedContent);
    const updatedNote = { ...note, content: updatedContent };
    onUpdate(note.id, updatedNote);
  };

  const handleOpenCalendarModal = () => {
    setIsCalendarModalOpen(!isCalendarModalOpen);
  };

  const handleCalendarDateSelect = (date) => {
    setSelectedDate(date);
    onDateSelect(index, date);
    onDateUpdate(note.id, date);
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { type: 'note', index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'note',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveNote(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ ref } style={{ opacity: isDragging ? 0 : 1 }}
      className="group py-2 rounded-lg border-2 border-transparent hover:border-2 hover:border-orange-200 hover:bg-orange-50"
    >
      <div ref={ grabRef } className='cursor-grab group-hover:border-t-2 group-hover:border-orange-200 group-hover:w-5 group-hover:m-auto'></div>
      <div className="flex justify-between items-center ">
        <div className="flex items-center">
          <FiCircle 
            className="ml-6 mr-1 text-orange-400 fill-current group-hover:border group-hover:border-orange-400 rounded-full p-1 transition duration-300 ease-in-out"
            size={ 22 }
          />
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
          {(note.date || selectedDate) && (
            <span className='ml-2 text-slate-500'>
              {format(note.date || selectedDate, 'yyyy-MM-dd')}
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
      <Editor
        className="my-container min-h-[100px] w-full rounded-lg" 
        defaultValue={ content }
        disableLocalStorage={ true }
        value={ editContent }
        onDebouncedUpdate={ handleContentChange }
        debounceDuration={ 750 }
      />
      { isCalendarModalOpen && (
        <CalendarModal
          isOpen={ isCalendarModalOpen }
          onClose={() => setIsCalendarModalOpen(false)}
          onSelectDate={ handleCalendarDateSelect }
          preselectedDate={ selectedDate }
          targetRef={ calendarRef }
        />
      )}
    </div>
  );
};

export default Note;
