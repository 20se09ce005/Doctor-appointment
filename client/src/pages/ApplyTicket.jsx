import React from 'react';
import { Col, Row } from "antd";
import { get } from "../services/axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { API_URL } from "../services/config";
import { showLoading, hideLoading } from "../redux/alertsSlice";

const ApplyTicket = () => {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();
    const getData = async () => {
        dispatch(showLoading());
        const response = await get(API_URL + "/api/admin/get-all-suport-ticket", {
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
        <div>
            <h1 className="page-title">Apply Ticket</h1>
            <hr />

            <Row gutter={20}>

            </Row>
        </div>
    )
}

export default ApplyTicket