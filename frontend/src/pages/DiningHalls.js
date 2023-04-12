import React, { useState } from "react";
import { Link} from "react-router-dom"

export default function DiningHalls(){

    const [DINING_HALLS, setDiningHalls] = useState([
    {
        "name": "Worcester Dining Hall",
        "imgUrl": "assets/worcester_dining_hall.jpg",
        "time": "7:00 AM - 12:00 AM",
        "link" : "/worcester",
        "isFavorite": false,
    },
    {
        "name": "Franklin Dining Hall",
        "imgUrl": "assets/franklin_dining_hall.jpg",
        "time": "7:00 AM - 9:00 PM",
        "link" : "/franklin",
        "isFavorite": false,
    },
    {
        "name": "Berkshire Dining Hall",
        "imgUrl": "assets/berkshire_dining_hall.jpg",
        "time": "11:00 AM - 12:00 AM",
        "link" : "/berkshire",
        "isFavorite": false,
    },
    {
        "name": "Hampshire Dining Hall",
        "imgUrl": "assets/hampshire_dining_hall.png",
        "time": "7:00 AM - 9:00 PM",
        "link" : "/hampshire",
        "isFavorite": false,
    },
]);

    const chooseFavorite = (index) => {
        const newDiningHalls = [...DINING_HALLS];
        newDiningHalls[index].isFavorite = !newDiningHalls[index].isFavorite;
        setDiningHalls(newDiningHalls);
    }

    return (
        <div className="container">
            <div className="row">
                {DINING_HALLS.map((dh, index) => (
                    <div key={index} className="col-12 col-md-6">
                        <div className="dining-card">
                            <Link to={dh.link}>
                                <img src={dh.imgUrl} alt=""/>
                                <div className="card-content">
                                    <h4>{dh.name}</h4>
                                    <p className="card-description">{dh.time}</p>
                                </div>
                            </Link>
                            <div onClick={() => chooseFavorite(index)} className={`${dh.isFavorite ? "isFavorite" : ""} card-favorite`}>
                                <i className={`${dh.isFavorite ? "fa" : "far"} fa-star`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
