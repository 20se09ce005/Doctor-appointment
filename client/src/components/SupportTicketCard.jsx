import React from "react";
import { useNavigate } from "react-router-dom";

function SupportTicketCard({ ticket, onAccept, onReject, showButtons, isPending }) {
    const navigate = useNavigate();

    const handleApplyClick = () => {
        navigate("/Admin-Chat", { state: { ticket } });
    };

    return (
        <div className="card p-2 cursor-pointer">
            <h5>{ticket._id}</h5>
            <hr />
            <p className="card-text">
                <b>UserId: </b>
                {ticket.userId}
            </p>
            <p className="mb-2">
                <b>Title: </b>
                {ticket.title}
            </p>
            <p className="mb-2">
                <b>Reason: </b>
                {ticket.reason}
            </p>

            {isPending && (
                <div className="button-group">
                    <button className="primary-button" onClick={handleApplyClick}>
                        Chat
                    </button>
                    <button className="primary-button" onClick={onAccept}>
                        Accept
                    </button>
                    <button className="secondary-button" onClick={onReject}>
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}

export default SupportTicketCard;