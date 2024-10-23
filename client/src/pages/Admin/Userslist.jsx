import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { Table } from "antd";
import moment from "moment";
import { API_URL } from "../../services/config";
import { get } from "../../services/axios";


function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsersData = async () => {
    dispatch(showLoading());
    const resposne = await get(API_URL + "/api/admin/get-all-users",).then((resposne) => {
      dispatch(hideLoading());
      if (resposne.data) {
        setUsers(resposne.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading());
    })
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="page-header">Users List</h1>
      <hr />
      <Table columns={columns} dataSource={users} />
    </div>

  );
}

export default Userslist;
