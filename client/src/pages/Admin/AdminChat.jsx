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

function AdminChat() {
    const chatContainerRef = useRef(null);
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [modalImageSrc, setModalImageSrc] = useState("");
    const dispatch = useDispatch();
    const ticketId = selectedTicket?._id;
    const userId = localStorage.getItem("id");

    const handleImageUpload = async ({ file, onSuccess, onError }) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await post(`${API_URL}/api/admin/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                const data = response.data;
                setUploadedImage(data);
                onSuccess("Image uploaded successfully");
            } else {
                onError(new Error("Upload failed"));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            onError(error);
        } finally {
            setIsUploading(false);
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
            const response = await get(
                `${API_URL}/api/admin/get-Messages?ticketId=${location.state.ticket._id}`
            );
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    socket.on("response", () => { fetchMessages(); });

    useEffect(() => {
        const initializeChat = async () => {
            await fetchData();
            fetchMessages();
        };
        initializeChat();
    }, []);

    // const formatTime = (time) => {
    //     const [hours, minutes] = time.split(':');
    //     const formattedHours = hours % 12 || 12;
    //     return `${formattedHours}:${minutes}`;
    // };
    // const isEditable = selectedTicket?.status === 0;

    const handleError = (error) => {
        console.error(error);
        alert("An error occurred. Please try again.");
    };

    const fetchData = async () => {
        dispatch(showLoading());
        try {
            const response = await get(
                `${API_URL}/api/admin/get-One-Apply-Ticket?ticketId=${location.state.ticket._id}`
            );
            dispatch(hideLoading());
            if (response.data && response.data.data) {
                setSelectedTicket(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            handleError(error);
        }
    };


    const handleSendMessage = async () => {
        if (isUploading) {
            alert("Please wait, image is still uploading...");
            return;
        }
        if ((newMessage.trim() || uploadedImage) && ticketId) {
            const messageData = {
                userId: "adminId",
                ticketId,
                message: newMessage,
                image: uploadedImage,
            };

            console.log("Sending Message Data:", messageData);

            try {
                const response = await post(`${API_URL}/api/admin/send-message`, messageData);

                if (response.status === 200) {
                    socket.emit("sendMessage", messageData);
                    setNewMessage("");
                    setUploadedImage(null);
                    setFileList([]);
                    fetchMessages();
                } else {
                    handleError(new Error("Failed to send message"));
                }
            } catch (error) {
                handleError(error);
            }
        }
    };

    const openImageModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsImageModalVisible(true);
    };

    const closeImageModal = () => {
        setIsImageModalVisible(false);
    };

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
                                    {msg.image && (
                                        <img
                                            src={`${API_URL}/uploads/images/${msg.image}`}
                                            alt="chat-img"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                marginTop: "8px",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    )}
                                </div>

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "darkgray",
                                        marginTop: "4px",
                                    }}
                                >
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                        <Upload
                            name="image"
                            listType="picture"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            customRequest={handleImageUpload}
                        >
                            <Button icon={<PlusOutlined />} style={{ marginRight: "8px" }} />
                        </Upload>

                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onPressEnter={handleSendMessage}
                            placeholder="Type a message"
                            style={{ flex: 1 }}
                        />

                        <Button
                            type="primary"
                            onClick={handleSendMessage}
                            style={{ marginLeft: "8px" }}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Send"}
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}

export default AdminChat;