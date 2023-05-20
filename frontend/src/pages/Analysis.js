import { Link} from "react-router-dom"
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import { Chart } from "react-google-charts";
import Speedometer from "react-d3-speedometer";
import styled from 'styled-components'
import './AnalysisStyles.css';



const LeftSide = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
position: relative;
`;

const Totals = styled.div`
scale: 80%;
text-align: center;
position: relative;
right: 35px;
bottom: 50px;
`;

const Container = styled.div`
`;

const RightSide = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
position: relative;
bottom: 100px ;

`;

const Meals = styled.div`
position: relative;
scale: 80%;
text-align: center;
max-width: 500px;
left: 50px;
align-items: center;
bottom: 100px;

`;

const MainBody = styled.div`
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
overflow-y: hidden;
max-height: 1000px;

`;

const HealthMeter = styled.div`
text-align: center;
position: relative;
justify-content: center;
right: 100px;
`;

const PieChart = styled.div`
position: relative;
right: 75px;
`;


export default function Analysis(){
    const location = useLocation();
    const [items, setItems] = useState([]);

    const fetchData = useCallback(async (foods) => {
        foods.forEach(async (food) => {
            const response = await fetch(`http://localhost:3001/facts?foodId=${food.foodId}`)
            const data = await response.json();
            const thisFoodFacts = {
                name: data.name,
                calories: data.calories,
                carbs: data.carbs,
                fat: data.fat,
                protein: data.protein,
                ingredients: data.ingredients,
                recipeLables: data.recipeLables,
                healthfulness: data.healthfulness
            }
            if (items.some(item => item.name === thisFoodFacts.name) === false) {
                setItems(items => [...items, thisFoodFacts])
            }
        })
    }, [items])

    useEffect(() => {
        if (location.state !== null) {
            fetchData(location.state.foods);
        }
    }, [])

    if (location.state === null || location.state.foods.length === 0){
        return (
            <div className  = "overlay">
              <p className= "labelText">Select items to get started: </p>
              <Link to={{pathname: "/DiningHalls"}}>
                  <div>
                  <button className = "itemButton">Select Items</button>
                  </div>
              </Link>
            </div>
        )
    }

    return (
    <Container >
        {items && <TotalInfo foods={items}/>}
    </Container>
    )
}



export const data = () =>[
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  export const options = {
    title: "Nutrient Balance",
  };

const HealthScale = ({hScore}) =>
{
return (
<div>
        <Speedometer
          minValue={0}
          maxValue={70}
          width = {400}
          height = {400}
          customSegmentLabels={[
            {
              text: "Bad",
              position: "INSIDE",
              color: "#FFF",
              fontSize: "10px",


            },
            {
              text: "Ok",
              position: "INSIDE",
              color: "#FFF",
              fontSize: "10px",
            },
            {
              text: "Good",
              position: "INSIDE",
              color: "#FFF",
              fontSize: "10px",

            },
            {
              text: "Very Good",
              position: "INSIDE",
              color: "#FFF",
              fontSize: "10px",

            },
          ]}
          needleHeightRatio={0.8}
          ringWidth={25}
          segments = {4}
          value={hScore}
          segmentColors={[
            "#b81414",
            "#ec5555",
            "#f2db5b",
            "#7ab55c",
            "#385828"
          ]}
          needleColor="#000080"
        />
      </div>

)


}
const PChart = ({fat, protein, carbs}) => {
    return (
        <Chart
            chartType="PieChart"
            data={[
                ["Task", "Hours per Day"],
                ["carbs", carbs],
                ["protein", protein],
                ["fat", fat],
            ]}
            options={options}
            width={"600px"}
            height={"600px"}
        />
    );
}

function filterDuplicateObjects(array) {
  return array.filter((obj, index) => {
    // Use indexOf() or findIndex() to find the first occurrence of the object
    const firstIndex = array.findIndex(
      (item, idx) => JSON.stringify(item) === JSON.stringify(obj) && idx < index
    );

    // Keep only the objects that are not duplicate
    return firstIndex === -1;
  });
}

const TotalInfo = ({foods}) => {
    let tCalories = 0;
    let tFat = 0;
    let tProtein = 0;
    let tCarbs = 0;
    let healthScore = 0;
    const [tInfo, setTInfo] = useState({calories: 0, fat: 0, protein: 0, carbs: 0, healthScore: 0});
    const filteredFoods = filterDuplicateObjects(foods);

    useEffect(() => {
        filteredFoods.forEach(info => {
            console.log(info)
            tCalories += Number(info.calories);
            const calories = tInfo.calories + Number(info.calories);
            setTInfo({...tInfo, calories: calories});
            info.fat.replace('g', '');
            tFat += parseFloat(info.fat);
            setTInfo({...tInfo, fat: tFat});
            info.protein.replace('g','');
            tProtein += parseFloat(info.protein);
            setTInfo({...tInfo, protein: tProtein});
            info.carbs.replace('g', '');
            tCarbs += parseFloat(info.carbs);
            setTInfo({...tInfo, carbs: tCarbs});
            healthScore += parseInt(info.healthfulness);
            healthScore = healthScore / foods.length;
            setTInfo({...tInfo, healthScore: healthScore});
        });
        console.log(tCalories, tFat, tProtein, tCarbs, healthScore);
        console.log(tInfo);
    }, [foods]);

    return (
      <MainBody>
            <LeftSide >
              <PieChart>
        <PChart fat = {Number(tFat.toFixed(1))} protein ={Number(tProtein.toFixed(1))} carbs = {Number(tCarbs.toFixed(1))} />
              </PieChart>
            <Totals >
            <h1 align='center'>Nutrient Totals</h1>
            <h2>Total Calories: {tInfo.calories}</h2>
            <h2>Total Fat: {tFat.toFixed(1)}g</h2>
            <h2>Total Protein: {tProtein.toFixed(1)}g</h2>
            <h2>Total Carbohydrates: {tCarbs.toFixed(1)}g</h2>
            </Totals>
            </LeftSide>
        <RightSide>
          <HealthMeter>
            <h1>Health Score</h1>
            <HealthScale hScore = {Math.round(healthScore)} />
          </HealthMeter>
            </RightSide>

        </MainBody>

    );

}
