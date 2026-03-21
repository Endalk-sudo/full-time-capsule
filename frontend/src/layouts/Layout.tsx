import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <section className="h-screen max-w-full">
      <section className="mx-auto h-screen max-w-6xl">
        <Navbar />
        <section className="p-4 sm:p-6">
          <Outlet />
        </section>
      </section>
    </section>
  );
};

export default Layout;
