import React, { useState, useEffect, useRef } from 'react';
import Calendar from "../Calendar/Calendar";
import { FiX } from 'react-icons/fi';
import { useFloating, computePosition, flip, shift, offset, arrow } from "@floating-ui/react";

const CalendarModal = ({ isOpen, onClose, onSelectDate, preselectedDate, targetRef }) => {
  const [ selectedDate, setSelectedDate ] = useState(preselectedDate);
  const arrowRef = useRef(null);
  const { refs, floatingStyles } = useFloating({
    strategy: 'absolute',
    middleware: [arrow({ element: arrowRef }), offset(10)],
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleDateCancel = () => {
    setSelectedDate(null);
    onSelectDate(null);
    onClose();
  };
  
  const handleSave = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && targetRef.current) {
      computePosition(targetRef.current, refs.floating.current, {
        strategy: 'absolute',
        middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
      }).then(({ x, y }) => {
        Object.assign(refs.floating.current.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }
  }, [isOpen, targetRef, refs.floating]);

  return (
    <div 
      id="calendar-modal"
      className={`${isOpen ? 'block' : 'hidden'} absolute z-50 max-w-[24rem]`}
      ref={ refs.setFloating }
      style={ floatingStyles }
      >
      <div className="relative bg-white p-3 w-full rounded-xl shadow-2xl border-solid border-stone-500">
        <FiX className="absolute w-5 h-5 top-2 right-2 text-gray-500 cursor-pointer" onClick={ onClose } />
        <Calendar onDateSelect={ handleDateSelect } selectedDate={ selectedDate } setSelectedDate={ setSelectedDate } />
        <div className="flex justify-end space-x-2">
          <button className="bg-transparent text-gray-500 hover:text-gray-400 px-3 py-2 mt-2" onClick={ handleDateCancel }>Clear</button>
          <button className="bg-orange-400 hover:bg-orange-300 rounded-full text-white px-3 py-2 mt-2" onClick={ handleSave }>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
