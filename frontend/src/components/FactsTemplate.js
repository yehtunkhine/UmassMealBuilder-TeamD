import { useLocation } from "react-router-dom";
import { MealItems } from "./AccData";
import styled from 'styled-components'







export default function FactsTemplate(){
    const location = useLocation()
    const { name } = location.state
    const mealItem = MealItems[name];
    return (<div>
        <ItemFacts item = {mealItem}/>
        </div>)
}

const ItemProps = styled.div`




`;


const ItemFacts = ({item}) => {
    return (
        <ItemProps>
            <h1>{item.name}</h1>
            <h1>Ingredients : {item.ingredients}</h1>
            <h1>Allerges: {item.allergens}</h1>
            <h1>Recipe Lables : {item.recipeLables}</h1>
            <h1>Healthfulness : {item.healthfulness}</h1>
            <h1>Serving Size : {item.servingSize}</h1>
            
        </ItemProps>



    )
};