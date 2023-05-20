import { Link} from "react-router-dom"
import MenuData from "../components/MenuData"
import { useLocation } from "react-router-dom";
import React from "react";
import { Chart } from "react-google-charts";
import Speedometer from "react-d3-speedometer";
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import './AnalysisStyles.css';

// STYLED COMPONENTS

// Styling for the components on the left side of the page
// Should include the chart and speedometer
const LeftSide = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
align-items: center;
position: relative;
`;

// Styling for the nutrient totals
const Totals = styled.div`
scale: 80%;
text-align: center;
position: relative;
right: 35px;
bottom: 50px;
`;

// Not used
const Container = styled.div`
`;


// Styling for components on the right side of the page
// Should include the meal list and nutrient totals
const RightSide = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
position: relative;
bottom: 100px ;

`;

// Styling for the list of meals
const Meals = styled.div`
position: relative;
scale: 80%;
text-align: center;
max-width: 500px;
left: 50px;
align-items: center;
bottom: 100px;

`;

// Styling for the main body which contains all components
const MainBody = styled.div`
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
overflow-y: hidden;
max-height: 1000px;

`;

// Styling for the health speedometer
const HealthMeter = styled.div`
text-align: center;
position: relative;
justify-content: center;
right: 100px;
`;

// Styling for the pie chart
const PieChart = styled.div`
position: relative;
right: 75px;
`;



// Main Function
// This is what displays on the page
export default function Analysis(){
    const location = useLocation(); // Grabs the list of items from the available items page (MenuData)
    if (location.state === null){ // Returns this if there is no current plate built. This will occur if the analysis page is visited before the available items page.
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
    const {foods} = location.state; // Food information retrieved from the MenuData page
    let foodlist = [];

    let items = require('./items.json');

    foods.forEach(x=> foodlist.push(items[x])); // Populates the foodlist with the proper object corresponding to the name in the database
    // Returns the components built in TotalInfo
    return (
    <Container >
        <TotalInfo foodlist = {foodlist} foods = {foods}/>

    </Container>
    )
        
}



export const data = (fat, protein, carbs) =>[
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
 
const root = ReactDOM.createRoot(document.getElementById('root'));


// Creates the health speedometer 
// Takes in the health score value of an item as a parameter
// The meter will read differently depending on how high the health score is
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

// Creates the pie chart
// Takes in the fat, protein, and carbs as input
// Uses the parameters to create a pie chart with each parameter being a section
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

// Builds the components displayed in the page
const TotalInfo = ({foodlist, foods}) => {
  // Initalizes all of the nutrient variables as 0 
    let tCalories = 0;
    let tFat = 0;
    let tSatFat = 0;
    let tProtein = 0;
    let tCarbs = 0;
    let healthScore = 0;

    // Loops through the list of food items and calculates the total of each
    // Healthscore is calculated as an average of all of the health scores of each item in the meal list
    // Since the information is stored as strings they need to be converted to numbers
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

    // HTML section
    // Contains the pie chart, speedomeeter, meal list, and totals
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