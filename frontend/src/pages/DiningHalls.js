const DINING_HALLS = [
    {
        "name": "Worcester Dining Hall",
        "imgUrl": "assets/worcester_dining_hall.jpg",
    },
    {
        "name": "Franklin Dining Hall",
        "imgUrl": "assets/franklin_dining_hall.jpg",
    },
    {
        "name": "Berkshire Dining Hall",
        "imgUrl": "assets/berkshire_dining_hall.jpg",
    },
    {
        "name": "Hampshire Dining Hall",
        "imgUrl": "assets/hampshire_dining_hall.png",
    },
]

export default function DiningHalls(){
    return (
        <div className="container">
            <div className="row">
                {DINING_HALLS.map((dh) => (
                    <div className="col-12 col-md-6">
                        <DiningCard imgUrl={dh.imgUrl} name={dh.name}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const DiningCard = ({imgUrl, name}) => {
    return (
        <div className="dining-card">
            <img src={imgUrl} className=""/>
            <div className="card-content">
                <h4>{name}</h4>
            </div>
        </div>
    )
}
