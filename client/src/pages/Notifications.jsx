import { Tabs } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { setUser } from "../redux/userSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async () => {
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/mark-all-notifications-as-seen", { userId: user._id }, {
    }).then((response) => {
      dispatch(hideLoading());
      if (response.data.data) {
        console.log(response, "response Notifications---------------------");
        toastMessage('success', response.data.messages);
        dispatch(setUser(response.data.data));
      } else {
        toastMessage('error', response.data.messages);
      }
    }).catch((error) => {
      dispatch(hideLoading());
      if (error.response && error.response.data) {
        toastMessage('error', Object.values(error.response.data).toString());
      } else {
        toastMessage('error', 'An unexpected error occurred. Please try again.');
      }
    })
  }

  const deleteAll = async () => {
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/delete-all-notifications", { userId: user._id }, {
    }).then((response) => {
      dispatch(hideLoading());
      if (response.data.data) {
        toastMessage('success', response.data.messages);
        dispatch(setUser(response.data.data));
      } else {
        toastMessage('error', response.data.messages);
      }
    }).catch((error) => {
      dispatch(hideLoading());
      if (error.response && error.response.data) {
        toastMessage('error', Object.values(error.response.data).toString());
      } else {
        toastMessage('error', 'An unexpected error occurred. Please try again.');
      }
    })
  }
  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <hr />

      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => markAllAsSeen()}>Mark all as seen</h1>
          </div>

          {user?.unseenNotifications.map((notification) => (
            <div className="card p-2 mt-2" onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.messages}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="seen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={() => deleteAll()}>Delete all</h1>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div className="card p-2 mt-2" onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.messages}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
