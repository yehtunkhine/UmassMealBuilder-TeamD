import { Link} from "react-router-dom"
import MenuData from "../components/MenuData"
import { useLocation } from "react-router-dom";











export default function Analysis(){
    const location = useLocation();
    if (location.state === null){
        return (
            <div>
            <h1>No items currently selected</h1>
            <Link to={{pathname: "/DiningHalls"}}> 
                <button>Select Items</button>
            </Link>
            </div>
        )

    }
    const {foods} = location.state;
    let foodlist = [];

    let items = require('./items.json');

    foods.forEach(x=> foodlist.push(items[x]));

    return (
    <div>
        <TotalInfo foodlist = {foodlist}/>
        <h1>Meals: {foods.toString()}</h1>
    </div>
    )
        
}


const pChart = ({chart}) => {
    return (
        0
    );
}
const TotalInfo = ({foodlist}) => {
    let tCalories = 0;
    let tFat = 0;
    let tSatFat = 0;
    let tProtein = 0;
    let tCarbs = 0;
    let healthScore = 0;
    foodlist.forEach(x => {
        let info = x.nutrientInfo;
        tCalories += Number(info.calories);
        info.fat.replace('g', '');
        tFat += parseFloat(info.fat);
        info.saturatedFat.replace('g', '');
        tSatFat += parseFloat(info.saturatedFat);
        info.protein.replace('g','');
        tProtein += parseFloat(info.protein);
        info.carbohydrates.replace('g', '');
        tCarbs += parseFloat(info.carbohydrates);
        healthScore += parseInt(x.healthfulness);
        healthScore = healthScore / foodlist.length;
    });

    return (
        <div>
            <h1>Total Calories: {tCalories}</h1>
            <h1>Total Fat: {tFat.toFixed(1)}g</h1>
            <h1>Total Saturated Fat: {tSatFat.toFixed(1)}g</h1>
            <h1>Total Protein: {tProtein.toFixed(1)}g</h1>
            <h1>Total Carbohydrates: {tCarbs.toFixed(1)}g</h1>
            <h1>Health Score: {healthScore.toFixed(2)} </h1>
            
        </div>

    );

}