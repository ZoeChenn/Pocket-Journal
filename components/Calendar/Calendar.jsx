import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, addWeeks } from 'date-fns';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Calendar = ({ onDateSelect, selectedDate, setSelectedDate, defaultDate, noteDates }) => {
  const [ currentMonth, setCurrentMonth ] = useState(defaultDate || new Date() );

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between px-4 py-2">
        <button onClick={ prevMonth } className="p-2">
          <FaAngleLeft className="text-gray-500 hover:text-gray-700"/>
        </button>
        <span className="text-lg font-bold text-gray-800">
          { format(currentMonth, dateFormat) }
        </span>
        <button onClick={ nextMonth } className="p-2">
          <FaAngleRight className="text-gray-500 hover:text-gray-700"/>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];
    let startDate = startOfWeek( currentMonth, { weekStartsOn: 1 } );
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col-span-1 text-center font-medium text-xs text-gray-500 uppercase" key={i}>
          { format(addDays(startDate, i), dateFormat) }
        </div>
      );
    }
    return <div className="grid grid-cols-7">{ days }</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth( currentMonth );
    const monthEnd = endOfMonth( monthStart );
    const startDate = startOfWeek( monthStart, { weekStartsOn: 1 } );
    const endDate = endOfWeek( addWeeks(monthEnd, 1), { weekStartsOn: 1 } );

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    let rowsCount = 0;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = isSameDay(cloneDay, selectedDate);
        const hasNote = noteDates && noteDates.some(noteDate => isSameDay(cloneDay, noteDate));
        days.push(
          <div
            className={`col-span-1 text-center p-1 rounded-full cursor-pointer ${!isSameMonth(cloneDay, currentMonth)
              ? "text-gray-400"
              : isSelected
              ? "bg-orange-400 text-white"
              : "text-gray-700"
            }`}
            key={ cloneDay }
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="inline-block w-7 h-7 leading-7 text-center rounded-full hover:bg-orange-200">
              { formattedDate }
              { hasNote && <span className="block w-1 h-1 bg-orange-400 rounded-full mx-auto mt-1"></span> }
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={ day.toISOString() }>
          { days }
        </div>
      );
      days = [];
      rowsCount++;
      if (rowsCount === 6) break;
    }
    return <div className="body">{ rows }</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    onDateSelect(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className=" bg-white overflow-hidden">
      { renderHeader() }
      { renderDays() }
      { renderCells() }
    </div>
  );
};

export default Calendar;
