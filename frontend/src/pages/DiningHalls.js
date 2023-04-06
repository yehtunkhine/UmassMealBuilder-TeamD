import { Link} from "react-router-dom"

const DINING_HALLS = [
    {
        "name": "Worcester Dining Hall",
        "imgUrl": "assets/worcester_dining_hall.jpg",
        "time": "7:00 AM - 12:00 AM",
        "link" : "/worcester",
    },
    {
        "name": "Franklin Dining Hall",
        "imgUrl": "assets/franklin_dining_hall.jpg",
        "time": "7:00 AM - 9:00 PM",
        "link" : "/franklin",
    },
    {
        "name": "Berkshire Dining Hall",
        "imgUrl": "assets/berkshire_dining_hall.jpg",
        "time": "11:00 AM - 12:00 AM",
        "link" : "/berkshire",
    },
    {
        "name": "Hampshire Dining Hall",
        "imgUrl": "assets/hampshire_dining_hall.png",
        "time": "7:00 AM - 9:00 PM",
        "link" : "/hampshire",
    },
]

export default function DiningHalls(){
    return (
        <div className="container">
            <div className="row">
                {DINING_HALLS.map((dh) => (
                    <div className="col-12 col-md-6">
                        <DiningCard imgUrl={dh.imgUrl} name={dh.name} link={dh.link} time={dh.time}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const DiningCard = ({imgUrl, name,link, time}) => {
    return (
        <div className="dining-card">
            <Link to={link}>
                <img src={imgUrl} alt=""/>
                <div className="card-content">
                    <h4>{name}</h4>
                    <p className="card-description">{time}</p>
                </div>
            </Link>
        </div>
    )
}
