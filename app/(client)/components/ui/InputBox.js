import React from "react";

const InputBox = ({ name, type, id, value, placeholder, icon, disabled }) => {
    return (
        <div className="relative w-full mb-4">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box placeholder:text-dark-grey"
                disabled={disabled}
            />
            <i className={`fi ${icon} input-icon`}></i>
        </div>
    );
};

export default InputBox;
