import React from "react";
import { Outlet } from "react-router-dom";
import Styles from "../Layouts/MainLayout.module.css"
import { ChakraProvider } from "@chakra-ui/react";
export function MainLayout() {
  return (
    <div className={Styles.Main}>
      <ChakraProvider>
        <div className={Styles.Outlet}>
          {/* <Header ShowButtons={true} /> */}
          <Outlet />
          {/* <Footer /> */}
        </div>
      </ChakraProvider>
    </div>
  );
}
