import { MainLayout } from "../Layouts/MainLayout";
import { Navigate, useRoutes } from "react-router";
import SignInPage from "../Pages/SignInPage/SignInPage";
import RegisterPage from "../Pages/SignInPage/RegisterPage";
import { useSelector } from "react-redux";
import Homepage from "../Pages/HomePage/Homepage";
export default function Routes() {
  const { token } = useSelector((x) => x.auth);
  const { userId } = useSelector((x) => x.userCredentials)
  let routes = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: token ? <Homepage /> : <Navigate to={"/Login"} />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/login",
          element: <SignInPage />,
        },
        {
          path: "/CreateUser",
          element:  <RegisterPage/>   ,
        },
      ],
    },
    {
      // path: "/*",
      // element: <NotFountPage />,
    },
  ];
  return useRoutes(routes);
}
