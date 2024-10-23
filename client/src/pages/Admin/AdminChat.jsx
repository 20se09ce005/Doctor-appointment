import React, { useEffect, useState } from "react";
import { Row, Col, Card, Input, Button, Typography } from "antd";
import { get } from "../../services/axios";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/config";
import { socket } from "../../utils/socket";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { SendOutlined, SmileOutlined, AudioOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

function AdminChat() {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const [selectedTicket, setSelectedTicket] = useState(null);
    const dispatch = useDispatch();

    const getData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(`${API_URL}/api/admin/get-All-Apply-Ticket`);
            dispatch(hideLoading());
            if (response.data && response.data.data) {
                setSelectedTicket(response.data.data);
                setSelectedTicket(response.data.data[0]);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, `You: ${newMessage}`]);
            setNewMessage("");
        }
    };
    return (
        <div>
            <Row style={{ height: "" }}>
                <Col span={8} style={{ padding: "8px" }}>
                    <Card
                        title="Complaint Ticket Info"
                        bordered
                        style={{ height: "100%", overflowY: "auto" }}
                    >
                        {selectedTicket ? (
                            <>
                                <Paragraph>
                                    <b>Ticket ID:</b> {selectedTicket._id}
                                </Paragraph>
                                <Paragraph>
                                    <b>Title:</b> {selectedTicket.title}
                                </Paragraph>
                                <Paragraph>
                                    <b>Details:</b> {selectedTicket.reason}
                                </Paragraph>

                                <div style={{ marginTop: "16px" }}>
                                    <Title level={5}>Attached Images</Title>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <img
                                            src={API_URL + `/uploads/images/${selectedTicket.photo}`}
                                            style={{
                                                width: "275px",
                                                height: "156px",
                                                // objectFit: "cover",
                                                // borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Paragraph>No ticket selected</Paragraph>
                        )}
                    </Card>
                </Col>


                <Col span={16} style={{ padding: "8px", display: "flex", flexDirection: "column" }}>
                    <Card
                        title="Chat"
                        bordered
                        style={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "16px",
                                backgroundColor: "#eae6df",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                maxHeight: '309px',
                                minHeight: '309px'
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        alignSelf: msg.startsWith("You:") ? "flex-end" : "flex-start",
                                        backgroundColor: msg.startsWith("You:") ? "#dcf8c6" : "#fff",
                                        padding: "10px 15px",
                                        borderRadius: "20px",
                                        maxWidth: "60%",
                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    {msg}
                                </div>
                            ))}
                        </div>


                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 16px",
                                backgroundColor: "#f0f0f0",
                                gap: "8px",
                                borderTop: "1px solid #ddd",
                            }}
                        >
                            <SmileOutlined style={{ fontSize: "24px", color: "#8a8a8a" }} />
                            <Input
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onPressEnter={handleSendMessage}
                                style={{
                                    flex: 1,
                                    borderRadius: "20px",
                                    padding: "8px 12px",
                                    border: "none",
                                    backgroundColor: "#fff",
                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            {newMessage.trim() ? (
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SendOutlined />}
                                    onClick={handleSendMessage}
                                    style={{ backgroundColor: "#008069", borderColor: "#008069" }}
                                />
                            ) : (
                                <AudioOutlined style={{ fontSize: "24px", color: "#8a8a8a" }} />
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default AdminChat