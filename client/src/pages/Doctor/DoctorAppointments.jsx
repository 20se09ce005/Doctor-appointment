import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { Table } from "antd";
import moment from "moment";
import { get, post } from "../../services/axios";
import { API_URL } from "../../services/config";
import toastMessage from "../../utils/toast";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    dispatch(showLoading());
    const response = await get(
      API_URL + "/api/doctor/get-appointments-by-doctor-id",
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        setAppointments(response.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading());
    })
  };

  const changeAppointmentStatus = async (record, status) => {
    dispatch(hideLoading());
    const response = await post(
      API_URL + "/api/doctor/change-appointment-status",
      { appointmentId: record._id, status: status },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        toastMessage('success', response.data.messages);
        getAppointmentsData();
      }else {
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
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default DoctorAppointments;
