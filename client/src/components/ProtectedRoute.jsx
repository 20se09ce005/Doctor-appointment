import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUser = async () => {
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/get-user-info-by-id", 
      // { token: localStorage.getItem("token") },
      // {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // }
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.clear()
        navigate("/login");
      }
    }).catch((error) => {
      dispatch(hideLoading());
      localStorage.clear()
      navigate("/login");
    })
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, []);

  if (localStorage.getItem("token")) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;