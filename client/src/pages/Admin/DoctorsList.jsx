import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { Table } from "antd";
import moment from "moment";
import { API_URL } from "../../services/config";
import { get, post } from "../../services/axios";
import toastMessage from "../../utils/toast";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    dispatch(showLoading());
    const response = await get(API_URL + "/api/admin/get-all-doctors",).then((response) => {
      dispatch(hideLoading());
      if (response.data) {
        setDoctors(response.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading());
    })
  };

  const changeDoctorStatus = async (record, status) => {
    dispatch(showLoading());
    const response = await post(
      API_URL + "/api/admin/change-doctor-account-status",
      { doctorId: record._id, userId: record.userId, status: status },
    ).then((response) => {
      dispatch(hideLoading());
      if (response.data.data) {
        toastMessage('success', response.data.messages);
        getDoctorsData();
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
    getDoctorsData();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      <h1 className="page-header">Doctors List</h1>
      <hr />
      <Table columns={columns} dataSource={doctors} />
    </div>

  );
}

export default DoctorsList;
