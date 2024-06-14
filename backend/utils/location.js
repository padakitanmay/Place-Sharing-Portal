export const getCoordinates = async (address) => {
    const apiKey = process.env.OPENCAGE_API_KEY;
    return await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            address
        )}&key=${apiKey}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            return response.json();
        })
        .then((data) => {
            if (data.results.length === 0) {
                throw new Error("No valid address");
            }
            const { lat, lng } = data.results[0].geometry;
            return { lat, lng };
        });
};
