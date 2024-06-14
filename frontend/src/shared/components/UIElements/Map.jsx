import React from "react";
import "./Map.css";

// Dosent work
// const Map = (props) => {
//     const mapRef = useRef();

//     const { center, zoom } = props;

//     useEffect(() => {
//         new window.ol.Map({
//             target: mapRef.current.id,
//             layers: [
//                 new window.ol.layer.Tile({
//                     source: new window.ol.source.OSM(),
//                 }),
//             ],
//             view: new window.ol.View({
//                 center: window.ol.proj.fromLonLat([center.lng, center.lat]),
//                 zoom: zoom,
//             }),
//         });
//     }, [center, zoom]);

//     return (
//         <div
//             ref={mapRef}
//             className={`map ${props.className}`}
//             style={props.style}
//             id='map'
//         ></div>
//     );
// };

const Map = (props) => {
    return (
        <div className='map-container'>
            <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d152!2d${props.center.lng}!3d${props.center.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1717675413021!5m2!1sen!2sin`}
                className='map-iframe'
                allowFullScreen=''
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title="Maps"
            ></iframe>
        </div>
    );
};

export default Map;
