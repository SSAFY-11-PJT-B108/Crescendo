import Main from "../pages/Main/Main";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
export const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/",
          element: <Main/>,
        }
      ],
    },
  ]);