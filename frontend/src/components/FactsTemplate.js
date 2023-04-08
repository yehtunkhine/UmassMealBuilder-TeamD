import { useLocation } from "react-router-dom";

export default function FactsTemplate(props){
    const location = useLocation();
    console.log(location.state)


    
    return <h1>{location.name}</h1>
}