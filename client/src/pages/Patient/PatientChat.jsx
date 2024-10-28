import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Input, Button, Typography, Modal, Upload } from "antd";
import { get, post } from "../../services/axios";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/config";
import { socket } from "../../utils/socket";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useLocation } from "react-router-dom";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

function PatientChat() {
    const chatContainerRef = useRef(null);
    const location = useLocation();
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const dispatch = useDispatch();
    const ticketId = selectedTicket?._id;
    const userId = localStorage.getItem("id");

    const fetchData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(`${API_URL}/api/admin/get-All-User-Apply-Ticket`);
            dispatch(hideLoading());
            if (response.data && response.data.data) {
                console.log(response);
                
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
            console.log(newMessage);
            try {
                await post(`${API_URL}/api/patient/send-message`, messageData);
                socket.emit("sendMessage", messageData);
                console.log("sending message via socket:", messageData);
                setNewMessage("");
                setUploadedImage(null);
                fetchMessages();
            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to send message. Please try again.");
            }
        }
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages])

    const fetchMessages = async () => {
        try {
            const response = await get(`${API_URL}/api/patient/get-Messages?ticketId=${location.state.ticket._id}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleImageUpload = (info) => {
        if (info.file.status === "done") {
            setUploadedImage(info.file.response.url);
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes}`;
    };

    socket.on("response", (message) => {
        fetchMessages();
    });

    useEffect(() => {
        fetchData();
        fetchMessages();
    }, []);

    const isEditable = selectedTicket?.status === 0;
    const openImageModal = () => setIsImageModalVisible(true);
    const closeImageModal = () => setIsImageModalVisible(false);

    return (
        <Row>
            <Col span={8} style={{ padding: "8px" }}>
                <Card title="Complaint Ticket Info" bordered>
                    {selectedTicket ? (
                        <>
                            <Paragraph><b>Ticket ID:</b> {selectedTicket._id}</Paragraph>
                            <Paragraph><b>Title:</b> {selectedTicket.title}</Paragraph>
                            <Paragraph><b>Details:</b> {selectedTicket.reason}</Paragraph>
                            <div style={{ marginTop: "16px" }}>
                                <Title level={5}>Attached Images</Title>
                                <img
                                    src={`${API_URL}/uploads/images/${selectedTicket.photo[0]}`}
                                    alt="Ticket"
                                    style={{ width: "275px", height: "156px", cursor: "pointer" }}
                                    onClick={openImageModal}
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
                    <div
                        ref={chatContainerRef}
                        className="chat-container"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: msg.senderId === userId ? "flex-end" : "flex-start",
                                    margin: "8px 0",
                                    paddingRight: "8px",
                                }}
                            >
                                <div
                                    style={{
                                        background: msg.senderId === userId ? "#1890ff" : "#f0f0f0",
                                        color: msg.senderId === userId ? "white" : "black",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {msg.messages}
                                </div>

                                <div style={{ fontSize: "12px", color: "darkgray", marginTop: "4px", }}>
                                    {formatTime(msg.time)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {isEditable && (
                        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                            <Upload action={`${API_URL}/api/upload`} showUploadList={false} onChange={handleImageUpload}>
                                <Button icon={<PlusOutlined />} style={{ marginRight: "8px" }} />
                            </Upload>

                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onPressEnter={handleSendMessage}
                                placeholder="Type a message"
                                style={{ flex: 1 }}
                            />

                            <Button type="primary" onClick={handleSendMessage} style={{ marginLeft: "8px" }}>
                                Send
                            </Button>
                        </div>
                    )}
                </Card>
            </Col>

            <Modal
                visible={isImageModalVisible}
                footer={null}
                closable={false}
                onCancel={closeImageModal}
                centered
                bodyStyle={{ padding: 0, textAlign: "center" }}
            >
                <div style={{ position: "relative" }}>
                    <CloseOutlined
                        onClick={closeImageModal}
                        style={{
                            position: "absolute", top: 10, right: 10, fontSize: "15px", color: "white",
                            cursor: "pointer", background: "rgba(0, 0, 0, 0.6)", borderRadius: "50%", padding: "4px",
                        }} />

                    <img src={`${API_URL}/uploads/images/${selectedTicket?.photo}`}
                        alt="Ticket" style={{ width: "100%", height: "auto" }} />
                </div>
            </Modal>
        </Row>
    );
}

export default PatientChat;