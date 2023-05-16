import { Link} from "react-router-dom"
import { useLocation } from "react-router-dom";
import React from "react";
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
    console.log(location.state);
    if (location.state === null || location.state.foods.length === 0){
        return (
            <div class  = "overlay">
              <text class= "labelText">Select items to get started: </text>
              <Link to={{pathname: "/DiningHalls"}}>
                  <div>
                  <button class = "itemButton">Select Items</button>
                  </div>
              </Link>
            </div>
        )
    }
    const {foods} = location.state;

    return (
    <Container >
        <h1>hello</h1>

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
const TotalInfo = ({foodlist, foods}) => {
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
      <MainBody>
            <LeftSide >
              <PieChart>
        <PChart fat = {Number(tFat.toFixed(1))} protein ={Number(tProtein.toFixed(1))} carbs = {Number(tCarbs.toFixed(1))} />
              </PieChart>
            <Totals >
            <h1 align='center'>Nutrient Totals</h1>
            <h2>Total Calories: {tCalories}</h2>
            <h2>Total Fat: {tFat.toFixed(1)}g</h2>
            <h2>Total Saturated Fat: {tSatFat.toFixed(1)}g</h2>
            <h2>Total Protein: {tProtein.toFixed(1)}g</h2>
            <h2>Total Carbohydrates: {tCarbs.toFixed(1)}g</h2>
            </Totals>
            </LeftSide>
        <RightSide>
          <HealthMeter>
            <h1>Health Score</h1>
            <HealthScale hScore = {Math.round(healthScore)} />
          </HealthMeter>
            <Meals>
            <h1 align='center'>Meals</h1>
            <h2>{foods.toString()}</h2>
            </Meals>
            </RightSide>

        </MainBody>

    );

}
