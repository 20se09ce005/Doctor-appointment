import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { Table } from "antd";
import moment from "moment";
import { API_URL } from "../services/config";
import { get } from "../services/axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentsData = async () => {
    dispatch(showLoading());
    const resposne = await get(API_URL + "/api/patient/get-appointments-by-user-id",).then((resposne) => {
      dispatch(hideLoading());
      if (resposne.data.data) {
        setAppointments(resposne.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading());
    })
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span>
          {record.doctorInfo.phoneNumber}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    }
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  return <div>
    <h1 className="page-title">Appointments</h1>
    <hr />
    <Table columns={columns} dataSource={appointments} />
  </div>
}

export default Appointments;
