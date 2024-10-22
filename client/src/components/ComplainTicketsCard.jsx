import React from "react";
import { useNavigate } from "react-router-dom";

function ComplainTicketsCard({ ticket }) {
    const navigate = useNavigate();
    const handleApplyClick = () => {
        navigate('/Chat', { state: { ticket } });
    };

    return (
        <div className="card p-2 cursor-pointer">
            <h1 className="card-title">{ticket._id}</h1>
            <hr />
            <p className="mb-2"><b>Title: </b>{ticket.title}</p>
            <p className="mb-2"><b>Reason: </b>{ticket.reason}</p>

            <button className="primary-button px-3" onClick={handleApplyClick}>Chat</button>
        </div>
    )
}

export default ComplainTicketsCard