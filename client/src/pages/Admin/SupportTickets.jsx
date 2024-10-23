import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { get, post } from "../../services/axios";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/config";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import SupportTicketCard from "../../components/SupportTicketCard";  

function SupportTickets() {
    const [pendingTickets, setPendingTickets] = useState([]);
    const [acceptedTickets, setAcceptedTickets] = useState([]);
    const [rejectedTickets, setRejectedTickets] = useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(API_URL + "/api/admin/get-All-Apply-Ticket");
            dispatch(hideLoading());
            if (response.data) {
                setPendingTickets(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    const handleTicketResponse = async (ticket, status) => {
        dispatch(showLoading());
        try {
            await post(API_URL + "/api/admin/ticketResponse", {
                ticketId: ticket._id,
                status,
            });
            dispatch(hideLoading());

            setPendingTickets((prev) => prev.filter((t) => t._id !== ticket._id));
            if (status === "accepted") {
                setAcceptedTickets((prev) => [...prev, ticket]);
            } else {
                setRejectedTickets((prev) => [...prev, ticket]);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="support-tickets-container">
            <div className="ticket-column">
                <h4>Pending Tickets</h4>
                <Row gutter={20}>
                    {pendingTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard
                                ticket={ticket}
                                onAccept={() => handleTicketResponse(ticket, "accepted")}
                                onReject={() => handleTicketResponse(ticket, "rejected")}
                                showButtons={true}
                                isPending={true}
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="ticket-column">
                <h4>Accepted Tickets</h4>
                <Row gutter={20}>
                    {acceptedTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard ticket={ticket} showButtons={false} />
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="ticket-column">
                <h4>Rejected Tickets</h4>
                <Row gutter={20}>
                    {rejectedTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard ticket={ticket} showButtons={false} />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}

export default SupportTickets;