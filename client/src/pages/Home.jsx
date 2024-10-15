import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { get } from "../services/axios";
function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    dispatch(showLoading());
    const response = await get(API_URL + "/api/patient/get-all-approved-doctors", {
    }).then((response) => {
      dispatch(hideLoading())
      if (response.data) {
        setDoctors(response.data.data);
      }
    }).catch((error) => {
      dispatch(hideLoading())
    })
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;
