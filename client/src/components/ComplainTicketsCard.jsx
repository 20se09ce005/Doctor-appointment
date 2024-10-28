import React from "react";
import { useNavigate } from "react-router-dom";

function ComplainTicketsCard({ ticket }) {
    const navigate = useNavigate();
    const handleApplyClick = () => {
        navigate('/Patient-Chat', { state: { ticket } });
    };

    return (
        <div className="card p-2 cursor-pointer">
            <h1 className="card-title">{ticket._id}</h1>
            <hr />
            <p className="mb-2"><b>Title: </b>{ticket.title}</p>
            <p className="mb-2"><b>Reason: </b>{ticket.reason}</p>

            {ticket.status === 1 && (
                <p className="mb-2" style={{ color: "green" }}>
                    <b>Status: </b>Accepted Tickets
                </p>
            )}
            {ticket.status === 2 && (
                <p className="mb-2" style={{ color: "red" }}>
                    <b>Status: </b>Rejected Tickets
                </p>
            )}
            {ticket.status === 0 && (
                <p className="mb-2" style={{ color: "red" }}>
                    <b>Status: </b>Pending Tickets
                </p>
            )}

            {(ticket.status === 1 || ticket.status === 2) && (
                <div className="response-field">
                    <p><b>Response:</b> {ticket.response || "No response provided."}</p>
                </div>
            )}

            <button className="primary-button px-3" onClick={handleApplyClick}>
                Chat
            </button>
        </div>
    );
}

export default ComplainTicketsCard;