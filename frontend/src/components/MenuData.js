import React, {useState} from 'react'
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'
let Data = require('./database.json');

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

const Recipe = styled.div`
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

const Popup = ({closeModal}) => {
    return (
        <div>
            <button id="myBtn">modal</button>
            <div id="myModal" className="modal">
                <button onClick = {() =>closeModal(false)}> X </button>
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
        </div>
    )
}

const date = new Date();
const datestring = date.toLocaleDateString();

const MealCard = ({mdata}) => {
    // states
    const [openModal, setOpenModal] = useState(false)

    return (
        <FContent >
            {mdata.map((mealContent, i) => (
                <FCard key={i}>
                    <Category>{mealContent.category}</Category>
                    <RecipeContent>
                        {mealContent.recipes.map((item, index) => (
                            <Recipe key={index}>
                            {/* When the button is clicked, a popup will appear with nutrients
                                and ingredients from the backend*/}
                                <button onClick = {() =>setOpenModal(true)}>{item.name}</button>
                            </Recipe>
                        ))}
                        {openModal && <Popup closeModal={setOpenModal}/>}
                    </RecipeContent>
                </FCard>
              ))
            }
     </FContent>
    )
}


const MenuData = ({hall}) => {
    const [clicked, setClicked] = useState(false);
    const toggle = index => {
        if(clicked === index) {
            // if clicked question is already active, then close
            return setClicked(null)
        }
        setClicked(index);
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
      <IconContext.Provider value={{color: 'white', size: '30px'}}>
          <AccordionSection>
            <Container>
                {times.map((mealName, index) => {
                    return (
                        <div key={index}>
                            <Wrap onClick={() => toggle(index)} key = {index}>
                                <h1>{mealName}</h1>
                                <span>{clicked === index? <BsChevronUp/> : <BsChevronDown/>}</span>
                            </Wrap>
                            {clicked === index ? (
                                <Dropdown>
                                    <MealCard mdata = {mealtime[mealName]} hall = {hall}/>
                                </Dropdown>
                            ) : null}
                        </div>
                    );
                })}
            </Container>
          </AccordionSection>
      </IconContext.Provider>
      </Menu>
  );
};

export default MenuData
