import React, { useEffect, useState } from "react";
import { Row, Col, Card, Input, Button, Typography } from "antd";
import { get, post } from "../../services/axios";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/config";
import { socket } from "../../utils/socket";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useLocation } from "react-router-dom";

const { Paragraph, Title } = Typography;

function AdminChat() {
    const location=useLocation();
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const dispatch = useDispatch();
    const ticketId = selectedTicket?._id;

    
    
    const fetchData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(`${API_URL}/api/admin/get-All-Apply-Ticket`);
            dispatch(hideLoading());
            if (response.data && response.data.data) {
                setSelectedTicket(response.data.data[0]);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error("Error fetching tickets:", error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() && ticketId) {
            const messageData = { userId: "adminId", ticketId, message: newMessage };
            console.log(newMessage)
            try {
                await post(`${API_URL}/api/admin/send-message`, messageData);
                socket.emit("sendMessage", messageData);
                console.log("sending message via socket:",messageData);
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to send message. Please try again.");
            }
        }
    };
    
    const fetchMessages = async () => {
        try {           
            const response = await get(`${API_URL}/api/admin/get-Messages?ticketId=${location.state.ticket._id}`);            
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    socket.on("response",(message)=>{
        fetchMessages();
    })
    useEffect(() => {
        fetchData();
        fetchMessages();
    }, []);
    return (
        <Row>
            <Col span={8} style={{ padding: "8px" }}>
                <Card title="Complaint Ticket Info" bordered>
                    {selectedTicket ? (
                        <>
                            <Paragraph><b>Ticket ID:</b> {selectedTicket._id}</Paragraph>
                            <Paragraph><b>Title:</b> {selectedTicket.title}</Paragraph>
                            <Paragraph><b>Details:</b> {selectedTicket.reason} </Paragraph>
                            <div style={{ marginTop: "16px" }}>
                                <Title level={5}>Attached Images</Title>
                                <img
                                    src={`${API_URL}/uploads/images/${selectedTicket.photo}`}
                                    alt="Ticket"
                                    style={{ width: "275px", height: "156px" }}
                                />
                            </div>
                        </>
                    ) : (
                        <Paragraph>No ticket selected</Paragraph>
                    )}
                </Card>
            </Col>

            <Col span={16} style={{ padding: "8px" }}>
                <Card title="Chat" bordered>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <p>{msg.messages}</p>
                            </div>
                        ))}
                    </div>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onPressEnter={handleSendMessage}
                        placeholder="Type a message"
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                </Card>
            </Col>
        </Row>
    );
}

export default AdminChat