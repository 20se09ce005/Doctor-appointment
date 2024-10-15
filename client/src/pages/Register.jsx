import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/register", values).then((response) => {
      dispatch(hideLoading());
      if (response.data.data) {
        toastMessage('success', response.data.messages);
        navigate("/login");
      } else {
        toastMessage('error',response.data.messages);
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
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Nice To Meet U</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            REGISTER
          </Button>

          <Link to="/login" className="anchor mt-2">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
