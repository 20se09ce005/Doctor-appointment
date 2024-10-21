import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/patient/apply-doctor-account",
      {
        ...values, userId: user._id,
        timings: [moment(values.timings[0]).format("HH:mm"), moment(values.timings[1]).format("HH:mm"),],
      },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data.data) {
        toastMessage('success', response.data.messages);
        navigate("/");
      } else {
        toastMessage('error', response?.data?.messages);
      }
    }).catch((error) => {
      dispatch(hideLoading());
      if (error.response && error.response.data) {
        toastMessage('error', Object.values(error.response.data).toString());
      } else {
        toastMessage('error', 'An unexpected error occurred. Please try again.');
      }
    })
  };

  return (
    <div>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} />
    </div>

  );
}

export default ApplyDoctor;
