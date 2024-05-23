import logo from './logo.svg';
import './App.css';
import React from 'react';
import BookTable from './BookTable';

const App = () => {
  return (
    <div>
      <h1>Book Admin Dashboard</h1>
      <BookTable />
    </div>
  );
};

export default App;
