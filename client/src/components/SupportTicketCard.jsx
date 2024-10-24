import React from "react";
import { useNavigate } from "react-router-dom";

function SupportTicketCard({ 
    ticket, 
    onAccept, 
    onReject, 
    showButtons, 
    isPending 
}) {
    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate("/Admin-Chat", { state: { ticket } });
    };

    return (
        <div className="card p-2 cursor-pointer">
            <h5>Ticket ID: {ticket._id}</h5>
            <hr />
            <p className="card-text">
                <b>User ID:</b> {ticket.userId}
            </p>
            <p className="mb-2">
                <b>Title:</b> {ticket.title}
            </p>
            <p className="mb-2">
                <b>Reason:</b> {ticket.reason}
            </p>

            {!isPending && (
                <p className="mb-2">
                    <b>Response:</b> {ticket.response || "No response yet"}
                </p>
            )}

            <div className="button-group">
                <button className="primary-button" onClick={handleChatClick}>
                    Chat
                </button>

                {showButtons && (
                    <>
                        <button className="primary-button" onClick={onAccept}>
                            Accept
                        </button>
                        <button className="secondary-button" onClick={onReject}>
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SupportTicketCard;