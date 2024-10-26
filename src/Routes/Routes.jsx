import { MainLayout } from "../Layouts/MainLayout";
import { Navigate, useRoutes } from "react-router";
import SignInPage from "../Pages/SignInPage/SignInPage";
import { useSelector } from "react-redux";
import Homepage from "../Pages/HomePage/Homepage";
import jwtDecode from "jwt-decode";
export default function Routes() {
  const { userId } = useSelector((x) => x.userCredentials)
  const { token } = useSelector((x) => x.auth);
  let decodedToken = null;
  let Role = null;
  if (token) {
    try {
      decodedToken = jwtDecode(token); // Decode the JWT
      Role = decodedToken.Role; // Log the decoded token
    } catch (error) {
      console.error("Token decoding failed:", error);
    }
  } else {
    console.log("No token found.");
  }
  
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
      ],
    },
    {
      // path: "/*",
      // element: <NotFountPage />,
    },
  ];
  return useRoutes(routes);
}
