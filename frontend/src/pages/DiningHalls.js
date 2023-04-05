import { Link, useMatch, useResolvedPath} from "react-router-dom"

const DINING_HALLS = [
    {
        "name": "Worcester Dining Hall",
        "imgUrl": "assets/worcester_dining_hall.jpg",
        "link" : "/worcester",
    },
    {
        "name": "Franklin Dining Hall",
        "imgUrl": "assets/franklin_dining_hall.jpg",
        "link" : "/franklin",
    },
    {
        "name": "Berkshire Dining Hall",
        "imgUrl": "assets/berkshire_dining_hall.jpg",
        "link" : "/berkshire",
    },
    {
        "name": "Hampshire Dining Hall",
        "imgUrl": "assets/hampshire_dining_hall.png",
        "link" : "/hampshire",
    },
]

export default function DiningHalls(){
    return (
        <div className="container">
            <div className="row">
                {DINING_HALLS.map((dh) => (
                    <div className="col-12 col-md-6">
                        <DiningCard imgUrl={dh.imgUrl} name={dh.name} link={dh.link}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const DiningCard = ({imgUrl, name,link}) => {
    return (
        <div className="dining-card">
            <img src={imgUrl} className=""/>
            <div className="card-content">
                <h4>{name}</h4>
                <CustomLink to = {link}>{name}</CustomLink>
            </div>
        </div>
    )
}

function CustomLink({ to,children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end:true})
       return(
           <li className = {isActive ? "active":""}>
               <Link to = {to}{...props}>
                    {children}
               </Link>
           </li>
       )
   }
   
  
  
