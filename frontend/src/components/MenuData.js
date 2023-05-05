import { Link} from "react-router-dom"
import React, {useState} from 'react'
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'
import Modal from './Modal'

let Data = require('./database.json');
// import { Data, FoodData } from './AccData'

const AccordionSection = styled.div`
display: flex;
flex-direction: column;
align-items: stretch;
justify-content: center;
position: relative;
height: 100vh;
background: #fff;
`;
const Container = styled.div`
top: 30%;
box-shadow: 2px 10px 35px 1px rgba(153,153,153,0.3);
`;
const Wrap = styled.div`
flex-direction: row;
background: maroon;
color: black;
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
cursor: pointer;
border-top : 2px solid;
border-bottom: 2px solid;
border-left: 2px solid;
border-right: 2px solid;
h1 {
    padding: 2rem;
    font-size: 2rem;
    color: white;
}
span {
    margin: 2em;
}
`;

const Dropdown = styled.div`
background: white;
color: black;
border-bottom: 1px solid black;
border-top: 1px solid black;
border-left: 1px solid;
border-right: 1px solid;
max-height: 300px;
overflow-y: scroll;
overflow-x: hidden;
align-items: start;
`;


const Menu = styled.div`


`;

const FCard = styled.div`
`;

const FContent= styled.div`
`;

const RecipeContent = styled.div`
`;

const Plate = styled.div`
text-align: center;
`;
const Recipe = styled.div`
display: flex;
justify-content: center;
align-items: center;
color: black;
margin:30px;
`;

const Category = styled.div`
padding: 25px;
background-color: lightgray;
`;
// var modal = document.getElementById("myModal");

// var Btn = document.getElementById("myBtn")

// var span = document.getElementsByClassName("close")[0];

/*
Btn.onclick = function () {
    modal.style.display = "block"
}
span.onclick = function() {
    modal.style.display = "none";
  }
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
*/

const BUTTON_WRAPPER_STYLES={
    position: 'relative',
    zIndex: 1
}

// export default function FactsTemplate(){
//     const location = useLocation()
//     const { name } = location.state
//     const mealItem = MealItems[name];
//     return (<div>
//         <ItemFacts item = {mealItem}/>
//         </div>)
// }


// const ItemFacts = (item) => {
//     return (
//         <ItemProps>
//             <h1>{item.name}</h1>
//             <h1>Ingredients : {item.ingredients}</h1>
//             <h1>Allerges: {item.allergens}</h1>
//             <h1>Recipe Lables : {item.recipeLables}</h1>
//             <h1>Healthfulness : {item.healthfulness}</h1>
//             <h1>Serving Size : {item.servingSize}</h1>
//         </ItemProps>
//     )
// };

const date = new Date();
const datestring = date.toLocaleDateString();
let currentItems = {};

const MealCard = ({mdata, afunc, dfunc}) => {
    // states
    const [isOpen, setIsOpen] = useState(false);

    return (

        <FContent >
    { mdata.map((_, i) => {
        return (
        <FCard key={i}>
            <Category><u>{_.category}</u></Category>

            <RecipeContent>
                {_.recipes.map((item,idx) => (
                    <Recipe key={idx}>
                            <h1>{item.name}</h1>
                            <button onClick = {() => afunc(idx,item)} >{'add'}</button>
                            <button onClick = {() => dfunc(idx,item)} >{'del'}</button>

                        <div style={BUTTON_WRAPPER_STYLES}>
                            <button
                                onClick={()=>{setIsOpen(true)}}
                                >
                                Info
                            </button>
                        </div>
                        {/* <div style={OTHER_CONTENT_STYLES}>Other content</div> */}
                    </Recipe>
                ))}
                <Modal open={isOpen} onClose={()=>setIsOpen(false)}>
                    <h1>Hi</h1>
                </Modal>
            </RecipeContent>
        </FCard>
      )})
    }
     </FContent>
    )
}


const MenuData = ({hall}) => {
    const [clicked, setClicked] = useState(false);
    // const [mclicked, msetClicked] = useState(false);


    const toggle = index => {
        if(clicked === index) {
            // if clicked question is already active, then close
            return setClicked(null)
        }
        setClicked(index);
    }
    const addItem = (item) => {
        currentItems[item.name] = null;
        // msetClicked()

    }
    const delItem = (item) => {
        delete currentItems[item.name];
    }
    // json navigation
    let times = Object.keys(Data[hall][0].meals);
    let mealtime = Data[hall][0].meals;
    Data[hall].forEach(x=>{
        if (x.date === datestring){
            times = Object.keys(x.meals)
            mealtime = x.meals
        }
    })

  return (
    <Menu>
        <Plate>
        {'' +Object.keys(currentItems)}
        <Link to={{pathname: "/Analysis"}} state={{foods : Object.keys(currentItems)}}>
        <button>Build Plate</button>
        </Link>
        </Plate>
      <IconContext.Provider value={{color: 'white', size: '30px'}}>
          <AccordionSection>
            <Container>
                {times.map((mealName, index) => {
                    return (
                        <>
                        <Wrap onClick={() => toggle(index)} key = {index}>
                        <h1>{mealName}</h1>
                        <span>{clicked === index? <BsChevronUp/> : <BsChevronDown/>}</span>
                        </Wrap>
                        {clicked === index ? (
                        <Dropdown>
                            <MealCard mdata = {mealtime[mealName]} afunc = {addItem} dfunc = {delItem}/>
                        </Dropdown>
                        ) : null}
                        </>
                    );
                })}
            </Container>
          </AccordionSection>
      </IconContext.Provider>
      </Menu>
  );
};

export default MenuData
