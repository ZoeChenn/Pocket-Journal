import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from './Calendar';

test("renders Calendar component", () => {
  render(<Calendar />);
  const calendarElement = screen.getByText("January 2024");
  expect(calendarElement).toBeInTheDocument();
});

test("clicking next month button updates the displayed month", () => {
  render(<Calendar />);
  const nextMonthButton = screen.getByTestId("next-month-button");
  fireEvent.click(nextMonthButton);
  const updatedCalendarElement = screen.getByText("February 2024");
  expect(updatedCalendarElement).toBeInTheDocument();
});

test("clicking previous month button updates the displayed month", () => {
  render(<Calendar />);
  const prevMonthButton = screen.getByTestId("prev-month-button");
  fireEvent.click(prevMonthButton);
  const updatedCalendarElement = screen.getByText("December 2023");
  expect(updatedCalendarElement).toBeInTheDocument();
});
