import Main from '../pages/Main';
import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
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
        path: '/favorite',
        element: <Main />,
      },
      {
        path: '/dance',
        element: <Main />,
      },
      {
        path: '/game',
        element: <Main />,
      },
    ],
  },
]);
