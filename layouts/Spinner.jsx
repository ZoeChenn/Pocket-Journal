import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full border-t-2 border-stone-500 border-solid h-6 w-6"></div>
    </div>
  );
};

export default Spinner;
