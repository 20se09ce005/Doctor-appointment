import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { get } from "../services/axios";
import { useDispatch } from "react-redux";
import { API_URL } from "../services/config";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import Ticket from "../components/TicketCard";

const ApplyTicket = () => {
    const [tickets, setTickets] = useState([]);
    const dispatch = useDispatch();
    const getData = async () => {
        dispatch(showLoading());
        const response = await get(API_URL + "/api/admin/get-all-suport-ticket", {
        }).then((response) => {
            dispatch(hideLoading())
            if (response.data) {
                setTickets(response.data.data);
            }
        }).catch((error) => {
            dispatch(hideLoading())
        })
        console.log(response)
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1 className="page-title">Apply Ticket</h1>
            <hr />

            <Row gutter={20}>
                {tickets.map((ticket) => (
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Ticket ticket={ticket} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default ApplyTicket