import React from "react";

const FloatingChatButton = ({ onClick }) => {

    return (
        <button
            onClick={onClick}
            className="btn btn-primary rounded-circle shadow"
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "60px",
                height: "60px",
                zIndex: 9999
            }}
        >
            🤖
        </button>
    );
};

export default FloatingChatButton;