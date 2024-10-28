import React, { useState } from 'react';
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";
import { useLocation } from 'react-router-dom';

function TicketForm() {
    const location = useLocation();
    console.log(location.state.ticket._id);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [fileList, setFileList] = useState([]);

    const handleUploadChange = ({ fileList: newFileList }) => {
        console.log("Updated File List:", newFileList);
        setFileList(newFileList);
    };

    const onSubmit = async (data) => {
        if (fileList.length === 0) {
            toastMessage('error', 'Please upload at least one image');
            return;
        }

        const formData = new FormData();
        fileList.forEach((file) => {
            
            formData.append('image', file.originFileObj);
        });

        dispatch(showLoading());

        await post(`${API_URL}/api/admin/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((uploadRes) => {
                console.log(uploadRes,'-------------------------------------------');
                
                toastMessage('success', uploadRes.data.messages || 'Images uploaded successfully');
                console.log('Uploaded Images:', uploadRes.data.imagePaths);

                return post(`${API_URL}/api/admin/apply-ticket`, {
                    ...data,
                    userId: user._id,
                    ticketid: location.state.ticket._id,
                    photo: uploadRes.data,
                });
            })
            .then((ticketRes) => {
                toastMessage('success', ticketRes.data.messages || 'Ticket applied successfully');
                setFileList([]);
            })
            .catch((err) => {
                const errorMessage = Object.values(err.response?.data || {}).toString();
                toastMessage('error', errorMessage);
                console.error('Error:', err);
            })
            .finally(() => {
                dispatch(hideLoading());
            });
    };

    return (
        <div className="authentication">
            <div className="authentication-form card p-3">
                <h1 className="card-title">Apply for Ticket</h1>
                <Form layout="vertical" onFinish={onSubmit}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Title is required' }]}
                    >
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[{ required: true, message: 'Reason is required' }]}
                    >
                        <Input placeholder="Enter reason" />
                    </Form.Item>

                    <Form.Item label="Upload Photo" name="photo">
                        <Upload
                            multiple
                            listType="picture"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Button className="primary-button my-2 full-width-button" htmlType="submit">
                        Apply Ticket
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default TicketForm;