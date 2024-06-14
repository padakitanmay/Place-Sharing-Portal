import React from "react";

import "./Card.css";

const Card = (props) => {
    if (props.className !== "user-item__content") {
        return (
            <div className={`card ${props.className}`} style={props.style}>
                {props.children}
            </div>
        );
    } else {
      return (
        <div className={`card-special ${props.className}`} style={props.style}>
          {props.children}
        </div>
      );
    }
};

export default Card;
