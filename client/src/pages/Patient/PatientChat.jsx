import { Row, Col, Card, Input, Button, Typography, Modal, Upload, Checkbox, Popover, Space } from "antd";
import { CloseOutlined, PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../utils/socket";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../services/config";
import { get, post, Delete } from "../../services/axios";
import { showLoading, hideLoading } from "../../redux/alertsSlice";

const { Paragraph, Title } = Typography;

function PatientChat() {

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
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const dispatch = useDispatch();
    const ticketId = selectedTicket?._id;
    const userId = localStorage.getItem("id");
    const id = location.state.ticket._id;

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
            const response = await get(`${API_URL}/api/patient/get-Messages?ticketId=${id}&userId=${userId}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

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

    socket.on("response", (message) => {
        fetchMessages();
    });

    useEffect(() => {
        const initializeChat = async () => {
            await fetchData();
            fetchMessages();
        };
        initializeChat();
    }, []);

    const handleError = (error) => {
        console.error("Error:", error.response?.data || error.message);
        alert("An error occurred. Please try again.");
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await Delete(`${API_URL}/api/admin/delete-message?id=${messageId}`);
            console.log("Delete response:", response);
            if (response.status === 200) {
                alert("Message deleted successfully.");
                fetchMessages();
            } else {
                handleError(new Error("Failed to delete message"));
            }
            console.log("Deleting message with ID:", messageId);
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteMessageForUser = async (messageId) => {
        try {
            const response = await Delete(`${API_URL}/api/admin/delete-message-for-me?id=${messageId}`, { userId });
            if (response.status === 200) {
                alert("Message deleted for you.");
                fetchMessages();
            } else {
                handleError(new Error("Failed to delete message for you"));
            }
            console.log("User ID for delete-message-for-me:", userId);
        } catch (error) {
            handleError(error);
        }
    };

    const openImageModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsImageModalVisible(true);
    };
    const closeImageModal = () => {
        setIsImageModalVisible(false);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedMessages([]);
    };

    const handleSelectMessage = (messageId) => {
        setSelectedMessages((prevSelected) =>
            prevSelected.includes(messageId)
                ? prevSelected.filter((id) => id !== messageId) : [...prevSelected, messageId]);
    };

    const handleDeleteSelectedMessages = async () => {
        for (const messageId of selectedMessages) {
            await handleDeleteMessageForUser(messageId);
        }
        setIsSelectionMode(false);
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
                                    onClick={() => openImageModal(`${API_URL}/uploads/images/${selectedTicket.photo[0]}`)}
                                />
                            </div>
                        </>
                    ) : (
                        <Paragraph>No ticket selected</Paragraph>
                    )}
                </Card>
            </Col>

            <Col span={16} style={{ padding: "8px" }}>
                <Card title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Chat</span>
                        <div>
                            <Button type="primary" style={{ marginRight: "8px" }}
                                onClick={() => setIsSelectionMode(!isSelectionMode)}>
                                {isSelectionMode ? "Cancel" : "Select Messages"}
                            </Button>
                        </div>
                    </div>
                } bordered>
                    {isSelectionMode && selectedMessages.length > 0 && (
                        <Button
                            type="danger"
                            style={{ marginBottom: "8px" }}
                            onClick={() => handleDeleteSelectedMessages()}
                        >
                            Delete Selected Messages
                        </Button>
                    )}
                    <div
                        ref={chatContainerRef}
                        className="chat-container"
                        style={{ maxHeight: "295px", overflowY: "auto" }}
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
                                    position: "relative",
                                }}
                            >
                                {isSelectionMode && (
                                    <Checkbox
                                        checked={selectedMessages.includes(msg._id)}
                                        onChange={() => handleSelectMessage(msg._id)}
                                        style={{
                                            marginRight: "8px",
                                            color: "green",
                                        }}
                                    />
                                )}
                                <div
                                    style={{
                                        position: "relative",
                                        background: msg.senderId === userId ? "#1890ff" : "#f0f0f0",
                                        color: msg.senderId === userId ? "white" : "black",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {msg.status === 2 ? (
                                        <p style={{ fontStyle: "italic", color: "black" }}>This message deleted</p>
                                    ) : (
                                        <>
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
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => openImageModal(`${API_URL}/uploads/images/${msg.image}`)}
                                                />
                                            )}
                                        </>
                                    )}

                                    <Popover
                                        trigger="click"
                                        content={
                                            <Space direction="vertical">
                                                <Button type="text" danger onClick={() => handleDeleteMessage(msg._id)}>
                                                    Delete Message
                                                </Button>
                                                <Button type="text" onClick={() => handleDeleteMessageForUser(msg._id)}>
                                                    Delete Message for Me
                                                </Button>
                                            </Space>
                                        }
                                    >
                                        <EllipsisOutlined
                                            style={{
                                                fontSize: "16px", cursor: "pointer", position: "absolute",
                                                top: "50%", right: "-20px", transform: "translateY(-50%)",
                                            }}
                                        />
                                    </Popover>
                                </div>

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "lightgray",
                                        marginTop: "4px",
                                        alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
                                    }}
                                >
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isSelectionMode && selectedTicket?.status === 0 && (
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
                    )}
                    <Modal
                        visible={isImageModalVisible}
                        footer={null}
                        onCancel={closeImageModal}
                        centered
                        bodyStyle={{ padding: 0 }}
                    >
                        <img
                            src={modalImageSrc}
                            alt="Modal View"
                            style={{ width: "100%", height: "auto" }}
                        />
                        <Button
                            icon={<CloseOutlined />}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                zIndex: 1000,
                                border: "none",
                                backgroundColor: "transparent",
                                color: "white",
                                fontSize: "18px",
                            }}
                            onClick={closeImageModal}
                        />
                    </Modal>
                </Card>
            </Col>
        </Row>
    );
}

export default PatientChat;