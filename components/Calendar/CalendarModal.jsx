import React, { useState, useEffect } from 'react';
import Calendar from "../Calendar/Calendar";
import { FiX } from 'react-icons/fi';
import { computePosition, flip, shift, offset, arrow } from "@floating-ui/react";

const CalendarModal = ({ isOpen, onClose, onSelectDate, preselectedDate }) => {
  const [ selectedDate, setSelectedDate ] = useState(preselectedDate);

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
    const button = document.getElementById('fi-calendar');
    const floating = document.getElementById('calendar-modal');
    const arrowElement = document.getElementById('arrow');
  
    if (button && floating && arrowElement) {
      computePosition(button, floating, {
        placement: 'bottom',
        middleware: [
          offset(20),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowElement }),
        ],
      }).then(({ x, y, middlewareData }) => {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        if (middlewareData.arrow) {
          const { x } = middlewareData.arrow;
      
          Object.assign(arrowElement.style, {
            left: `${x}px`,
            top: `${-arrowElement.offsetHeight / 2}px`
          });
        }
      });
    }
    if (isOpen) {
      setSelectedDate(preselectedDate || new Date());
    }
  }, [ isOpen, preselectedDate ]);

  return (
    <div id="calendar-modal"
      className={`${isOpen ? 'block' : 'hidden'} absolute z-50 max-w-[24rem]`}>
      <div className="relative bg-white p-3 w-full rounded-xl shadow-2xl border-solid border-stone-500">
        <FiX className="absolute w-5 h-5 top-2 right-2 text-gray-500 cursor-pointer" onClick={ onClose } />
        <Calendar onDateSelect={ handleDateSelect } selectedDate={ selectedDate } setSelectedDate={ setSelectedDate } />
        <div id="arrow" className="absolute w-6 h-6 bg-white transform rotate-45" ></div>
        <div className="flex justify-end space-x-2">
          <button className="bg-transparent text-gray-500 hover:text-gray-400 px-3 py-2 mt-2" onClick={ handleDateCancel }>Clear</button>
          <button className="bg-orange-400 hover:bg-orange-300 rounded-full text-white px-3 py-2 mt-2" onClick={ handleSave }>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
