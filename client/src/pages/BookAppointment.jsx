import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/doctor/get-doctor-info-by-id", { doctorId: params.doctorId, },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        setDoctor(response.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading());
    })
  };

  const checkAvailability = async () => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/patient/check-booking-avilability", { doctorId: params.doctorId, date: date, time: time, },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        toastMessage('success', response.data.messages);
        setIsAvailable(true);
      } else {
        toastMessage('error', response?.data?.messages);
      }
    }).catch((error) => {
      if (error.response && error.response.data) {
        toastMessage('error', Object.values(error.response.data).toString());
      } else {
        toastMessage('error', 'An unexpected error occurred. Please try again.');
      }
      dispatch(hideLoading());
    })
  };
  const bookNow = async () => {
    setIsAvailable(false);
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/book-appointment", { doctorId: params.doctorId, userId: user._id, doctorInfo: doctor, userInfo: user, date: date, time: time, },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        toastMessage('success', response.data.messages);
        navigate('/appointments')
      } else {
        toastMessage('error', response?.data?.messages);
      }
    }).catch((error) => {
      if (error.response && error.response.data) {
        toastMessage('error', Object.values(error.response.data).toString());
      } else {
        toastMessage('error', 'An unexpected error occurred. Please try again.');
      }
      dispatch(hideLoading());
    })
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">

            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height='400'
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <p>
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit : </b>
                {doctor.feePerCunsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                {!isAvailable && <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>

          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
