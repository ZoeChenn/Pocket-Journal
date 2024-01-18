import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, addWeeks } from 'date-fns';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Calendar = ({ onChangeMonth, onDateSelect, selectedDate, setSelectedDate, defaultDate, notes = [] }) => {
  const [ currentMonth, setCurrentMonth ] = useState(defaultDate || new Date() );

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between px-4 py-2">
        <button onClick={ prevMonth } className="p-2" data-testid="prev-month-button">
          <FaAngleLeft className="text-gray-500 hover:text-gray-700"/>
        </button>
        <span className="text-lg font-bold text-gray-800 cursor-default">
          { format(currentMonth, dateFormat) }
        </span>
        <button onClick={ nextMonth } className="p-2" data-testid="next-month-button">
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
        <div className="col-span-1 text-center font-medium text-xs text-gray-500 uppercase cursor-default" key={i}>
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
        const hasNote = notes?.some(note => note.date && isSameDay(cloneDay, new Date(note.date)));
        days.push(
          <div
            className={`col-span-1 text-center p-1 rounded-full cursor-pointer relative ${
              !isSameMonth(cloneDay, currentMonth)
                ? "text-gray-400"
                : isSelected
                ? "bg-orange-400 text-white"
                : "text-gray-700"
            }`}
            key={ cloneDay }
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={`w-9 h-9 text-center rounded-full hover:bg-orange-200 flex items-center justify-center ${
              isSelected ? "bg-orange-400 text-white" : ""
            }`}>
              { formattedDate }
              { hasNote && <span className="absolute w-1 h-1 bg-orange-600 rounded-full bottom-0 mb-2 left-1/2 transform -translate-x-1/2"></span> }
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
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
    if (onChangeMonth) {
      onChangeMonth(next);
    }
  };

  const prevMonth = () => {
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
    if (onChangeMonth) {
      onChangeMonth(prev);
    }
  };

  return (
    <div className=" bg-white overflow-visible">
      { renderHeader() }
      { renderDays() }
      { renderCells() }
    </div>
  );
};
export default Calendar;
