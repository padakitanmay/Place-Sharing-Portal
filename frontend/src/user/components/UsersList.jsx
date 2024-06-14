import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UsersList = (props) => {
    if (!props.items.length) {
        return (
            <div className='center'>
                <Card>
                    <h2>No Users found</h2>
                </Card>
            </div>
        );
    } else {
        return (
            <ul className='users-list'>
                {props.items.map((item) => (
                    <UserItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        placeCount={item.places.length}
                    />
                ))}
            </ul>
        );
    }
};

export default UsersList;
