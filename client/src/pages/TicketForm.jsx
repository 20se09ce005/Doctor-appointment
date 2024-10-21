// import React, { useState, useEffect } from 'react';
// import { Button, Form, Input, Upload } from "antd";
// import { UploadOutlined } from '@ant-design/icons';
// import { useLocation, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { showLoading, hideLoading } from "../redux/alertsSlice";
// import { API_URL } from "../services/config";
// import { post } from "../services/axios";
// import toastMessage from "../utils/toast";

// function TicketForm() {
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const params = useParams();
//     const { user } = useSelector((state) => state.user);
//     const ticket = location.state?.ticket || {};
//     const onFinish = (values) => {
//         console.log('Received values:', values);
//     };

//     const applyTicket = async () => {
//         dispatch(showLoading());
//         const response = await post(API_URL + "/api/admin/apply-ticket",
//             { ...data, ticketId: selectedTicket._id },
//         ).then((response) => {
//             dispatch(hideLoading());
//             if (response.data) {
//                 toastMessage('success', response.data.messages);
//             } else {
//                 toastMessage('error', response?.data?.messages);
//             }
//         }).catch((error) => {
//             if (error.response && error.response.data) {
//                 toastMessage('error', Object.values(error.response.data).toString());
//             } else {
//                 toastMessage('error', 'An unexpected error occurred. Please try again.');
//             }
//             dispatch(hideLoading());
//         })
//     };

//     return (
//         <div className="authentication">
//             <div className="authentication-form card p-3">
//                 <h1 className="card-title">Apply for Ticket</h1>
//                 <Form
//                     layout="vertical"
//                     onFinish={onFinish}
//                     initialValues={{ title: ticket.title }}
//                 >
//                     <Form.Item label="Title" name="title">
//                         <Input placeholder="Title" />
//                     </Form.Item>
//                     <Form.Item label="Reason" name="reason">
//                         <Input placeholder="Reason" />
//                     </Form.Item>
//                     <Form.Item label="Upload Photo" name="photo">
//                         <Upload beforeUpload={() => false} accept="image/*">
//                             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                         </Upload>
//                     </Form.Item>

//                     <Button
//                         className="primary-button my-2 full-width-button"
//                         htmlType="submit"
//                     >
//                         Apply Ticket
//                     </Button>
//                 </Form>
//             </div>
//         </div>
//     );
// }

// export default TicketForm;

import React, { useState } from 'react';
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_URL } from "../services/config";
import { post } from "../services/axios";
import toastMessage from "../utils/toast";

function TicketForm() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [fileList, setFileList] = useState([]);

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onSubmit = async (data) => {
        try {
            dispatch(showLoading());

            const ticketRes = await post(`${API_URL}/api/admin/apply-ticket`, {...data,userId: user._id,});
            toastMessage('success', ticketRes.data.messages);

            if (fileList.length > 0) {
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('images', file.originFileObj);
                });
                formData.append('ticketId', ticketRes.data.data._id); 

                const uploadRes = await post(`${API_URL}/api/admin/uploadMultipleImage`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toastMessage('success', uploadRes.data.messages);
            }
            setFileList([]);
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            toastMessage('error', Object.values(err.response?.data || {}).toString());
            console.error(err);
        }
    };

    return (
        <div className="authentication">
            <div className="authentication-form card p-3">
                <h1 className="card-title">Apply for Ticket</h1>
                <Form layout="vertical" onFinish={onSubmit}>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Reason is required' }]}>
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