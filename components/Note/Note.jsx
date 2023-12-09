import React, { useState, useRef } from 'react';
import { Editor } from "novel";
import { format } from 'date-fns';
import CalendarModal from "../Calendar/CalendarModal"
import { FiTrash2, FiCalendar, FiCircle } from 'react-icons/fi';
import { useDrag, useDrop } from 'react-dnd';

const Note = ({ index, note, title, content, moveNote, onDateSelect, onDelete, onUpdate, onDateUpdate, onClick, isActive }) => {
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

  const [{ isDragging }, drag, preview] = useDrag({
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

  drag(grabRef);
  drop(ref)

  return (
    <div
      ref={ ref } style={{ opacity: isDragging ? 0 : 1 }} onClick={ onClick } 
      className={`group py-2 mb-2 rounded-lg border-2 border-transparent transition duration-300 ease-in-out hover:border-2 hover:border-orange-200 hover:bg-orange-50 ${isActive ? 'border-2 border-orange-200 bg-orange-50' : ''}`}
    >
      <div ref={ grabRef } className={`cursor-grab border-t-4 border-transparent w-5 m-auto transition duration-300 ease-in-out group-hover:border-t-4 group-hover:border-orange-200 ${isActive ? 'border-t-4 border-orange-200' : ''}`}></div>
      <div className="flex justify-between items-center" ref={ preview }>
        <div className="flex items-center">
          <FiCircle 
            className={`ml-6 mr-1 text-orange-400 fill-current border-transparent rounded-full p-1 transition duration-300 ease-in-out group-hover:border group-hover:border-orange-400 ${isActive ? 'border border-orange-400' : ''}`}
            size={ 22 }
          />
          { isEditingTitle ? (
            <input
              type="text"
              value={ editedTitle }
              onChange={ handleTitleChange }
              onBlur={ handleTitleBlur }
              className="text-2xl font-light outline-none border-none p-0 m-0 min-w-min group-hover:bg-slate-100"
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
            <span className='ml-2 text-slate-500 cursor-default'>
              {format(note.date || selectedDate, 'yyyy-MM-dd')}
            </span>
          )}
          <span ref={ calendarRef }>
            <FiCalendar
              className="w-5 h-5 mx-2 cursor-pointer text-gray-400 hover:text-gray-500"
              onClick={ handleOpenCalendarModal }
            />
          </span>
          <FiTrash2
            className="w-5 h-5 mr-10 cursor-pointer text-gray-400 hover:text-gray-500"
            onClick={() => handleDelete(index)}
          />
        </div>
      </div>
      <Editor
        className="my-container min-h-[80px] w-full rounded-lg" 
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
