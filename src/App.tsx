import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/layout/LoginHeader';

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
