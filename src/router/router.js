import Main from '../pages/Main';
import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import Chat from '../pages/Chat';
import Join from '../pages/Join';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/join',
        element: <Join />,
      },
    ],
  },
]);
