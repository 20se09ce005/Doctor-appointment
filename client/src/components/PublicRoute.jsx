import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute(props) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />
  }
}

export default PublicRoute;
