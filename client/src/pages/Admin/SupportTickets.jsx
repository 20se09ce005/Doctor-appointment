import React, { useEffect, useState } from "react";
import { Col, Row, Modal, Input, Button } from "antd";
import { get, post } from "../../services/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { API_URL } from "../../services/config";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import SupportTicketCard from "../../components/SupportTicketCard";

function SupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(`${API_URL}/api/admin/get-All-Apply-Ticket`);
            dispatch(hideLoading());
            if (response.data) {
                setTickets(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    const openModal = (ticket, action) => {
        setSelectedTicket(ticket);
        setActionType(action);
        setModalVisible(true);
    };

    const handleTicketResponse = async () => {
        if (!reply.trim()) {
            return alert("Please enter a reply.");
        }
        dispatch(showLoading());
        try {
            await post(`${API_URL}/api/admin/ticket-response`, {
                ticketId: selectedTicket._id,
                response: actionType,
                reply: reply,
            });
            dispatch(hideLoading());
            setModalVisible(false);
            setReply("");
            getData();
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const pendingTickets = tickets.filter((ticket) => ticket.status === 0);
    const acceptedTickets = tickets.filter((ticket) => ticket.status === 1);
    const rejectedTickets = tickets.filter((ticket) => ticket.status === 2);

    const goToChat = (ticket) => {
        navigate("/admin-chat", { state: { ticket } });
    };

    return (
        <div className="support-tickets-container">
            <div className="ticket-column">
                <h5>Pending Tickets</h5>
                <Row gutter={20}>
                    {pendingTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard
                                ticket={ticket}
                                onAccept={() => openModal(ticket, "Accept")}
                                onReject={() => openModal(ticket, "Reject")}
                                showButtons={ticket.status === 0} 
                                isPending={ticket.status === 0}
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="ticket-column">
                <h5>Accepted Tickets</h5>
                <Row gutter={20}>
                    {acceptedTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard
                                ticket={ticket}
                                showButtons={false}
                                extraButtons={
                                    <Button type="primary" onClick={() => goToChat(ticket)}>
                                        Chat
                                    </Button>
                                }
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="ticket-column">
                <h5>Rejected Tickets</h5>
                <Row gutter={20}>
                    {rejectedTickets.map((ticket) => (
                        <Col className="mb-3" span={24} key={ticket._id}>
                            <SupportTicketCard
                                ticket={ticket}
                                showButtons={false}
                                extraButtons={
                                    <Button type="primary" onClick={() => goToChat(ticket)}>
                                        Chat
                                    </Button>
                                }
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            <Modal
                title={`Add Reply for ${actionType} Action`}
                visible={modalVisible}
                onOk={handleTicketResponse}
                onCancel={() => setModalVisible(false)}
            >
                <Input.TextArea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Enter your reply"
                    rows={4}
                />
            </Modal>
        </div>
    );
}

export default SupportTickets;