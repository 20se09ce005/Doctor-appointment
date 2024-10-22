import React from "react";
import { useNavigate } from "react-router-dom";

function Ticket({ ticket }) {
    const navigate = useNavigate();

    const handleApplyClick = () => {
        navigate('/apply-ticket-form', { state: { ticket } });
    };

    return (
        <div className="card p-2 cursor-pointer">
            <h3 className="card-title">{ticket.title}</h3>
            <hr />
            <p className="mb-2"><b>Details: </b>{ticket.message}</p>

            <button 
                className="primary-button px-3"
                onClick={handleApplyClick}
            >
                Apply Ticket
            </button>
        </div>
    );
}

export default Ticket;