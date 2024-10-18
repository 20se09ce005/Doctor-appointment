import { Button, Form, Input } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    dispatch(showLoading());
    const response = await post(API_URL + "/api/patient/login", values).then((response) => {
      dispatch(hideLoading());
      if (response) {
        toastMessage('success', response.data.messages);
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("id", response.data.id);
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
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" required>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" required>
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="anchor mt-2">
            CLICK HERE TO REGISTER
          </Link>

        </Form>
      </div>
    </div>
  );
}

export default Login;
