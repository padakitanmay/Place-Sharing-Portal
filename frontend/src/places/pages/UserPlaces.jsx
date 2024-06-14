import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/HttpHook";

const UserPlaces = () => {
    const [userPlaces, setUserPlaces] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BASE_URL}/places/user/${userId}`
                );
                setUserPlaces(responseData.places);
            } catch (error) {}
        };
        fetchPlaces();
    }, [sendRequest, userId, isDeleting]);

    const placeDeleteHandler = (deletedPlaceId) => {
        setUserPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== deletedPlaceId)
        );
        setIsDeleting((prevState) => !prevState); // Trigger re-fetch
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && userPlaces && (
                <PlaceList
                    items={userPlaces}
                    onDeletePlace={placeDeleteHandler}
                />
            )}
        </>
    );
};

export default UserPlaces;
