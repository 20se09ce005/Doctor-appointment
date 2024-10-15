import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";
import { post } from "../../services/axios";
import { API_URL } from "../../services/config";
import toastMessage from "../../utils/toast";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/doctor/update-doctor-profile",
      {
        ...values, userId: user._id,
        timings: [moment(values.timings[0]).format("HH:mm"), moment(values.timings[1]).format("HH:mm"),],
      },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
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

  const getDoctorData = async () => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/doctor/get-doctor-info-by-user-id",
      {
        userId: params.userId,
      },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        setDoctor(response.data.data);
      }
    }).catch(() => {
      dispatch(hideLoading());
    })
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initivalValues={doctor} />}
    </Layout>
  );
}

export default Profile;
