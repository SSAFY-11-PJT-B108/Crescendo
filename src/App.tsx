import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import NotLoginHeader from './components/header/NotLoginHeader';
import LoginHeader from './components/header/LoginHeader';

import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEEHandler from './components/alarm/SEEHandler';
import ChatConnect from './components/chat/ChatConnect';

export default function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <>
          <LoginHeader />
          <SEEHandler />
          <ChatConnect />
        </>
      ) : (
        <NotLoginHeader />
      )}

      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}
