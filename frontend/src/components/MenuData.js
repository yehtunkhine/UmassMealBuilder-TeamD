import { Link} from "react-router-dom"
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'
import Modal from './Modal'
import { IoAdd, IoCloseOutline, IoInformationCircleOutline} from "react-icons/io5";

import {AuthenticationContext} from './../App'

// STYLED COMPONENTS
// CSS styling for each of these compenents

// Accordion Styling
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

// Chosen items list stying
const ChosenItemsContainer = styled.div`
    display: flex;
`
// Chosen items list styling
const ChosenItem = styled.div`
    padding: 10px;
    border: 1px solid black;
`

// Styling for the dropdown section in the accordion
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

// Unused Styled Components
const Menu = styled.div`

`;

const FCard = styled.div`
`;

const FContent= styled.div`
`;

const RecipeContent = styled.div`
`;

// Stlying for the plate
const Plate = styled.div`
text-align: center;
`;

// Styling for the list of meals inside the dropdown
const Recipe = styled.div`
display: flex;
justify-content: center;
align-items: center;
color: black;
margin:30px;
`;

// Styling for the add, delete, and infromation button
const ADButton = styled.button`
all: unset;

`;

// Styling for the categories in the accordion dropdown
const Category = styled.div`
padding: 25px;
background-color: lightgray;
text-align: center;
`;

const BUTTON_WRAPPER_STYLES={
    position: 'relative',
    zIndex: 1
}

// Used to get the current date in the proper format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
}


// Function for mapping the recipes and categories for each meal time
// Takes in a function for adding and deleting items from the meal plate list
// Takes in the meal data from one of the meal times on the current date (breakfast, lunch, dinner, latenight)
const MealCard = ({mdata, afunc, dfunc}) => {
    // states
    const [isOpen, setIsOpen] = useState(false);
    const [modelContent, setModelContent] = useState({});

    // Function for returning the information displayed in the popup
    // Should be called with modelContent after it is given data by setModelContent
    const itemFacts = (item) => {
        return (
            <itemProps>
                <h2>Macros: </h2>
                <p>Calories: {item.calories}</p>
                <p>Carbs: {item.carbs}</p>
                <p>Fat: {item.fat}</p>
                <p>Protein: {item.protein}</p>
                <h2>Ingredients: </h2>
                <p>ingredients: {item.ingredients}</p>
                <h2>Recipe Lables : {item.recipeLables}</h2>
                <h2>Healthfulness : {item.healthfulness}</h2>
                <h2>Serving Size : {item.servingSize}</h2>
            </itemProps>
        )
    }

    // Populates modelContent with data specific to the inputted item
    // Takes in an object containing the name of the related item as input
    const setModalContent = async (item) => {
        try {
            let name = item.name;
            console.log(name);
            let response = await fetch(`http://localhost:3001/getFoodIdFromName?name=${name}`); // Fetches the item information from the backend using the name
            console.log("response is", response);
            let data = await response.json();
            response = await fetch(`http://localhost:3001/facts?foodId=${data}`);
            data = await response.json();
            let facts = {"calories" : data.calories, "carbs" : data.carbs, "fat" : data.fat, "protein" : data.protein,
            "ingredients" : data.ingredients, "recipeLables" : data.recipeLables, "healthfulness" : data.healthfulness}; // Creates formatted object containing the item information
            console.log(facts);
            setModelContent(facts); // sets modelContent to the item so it can be used in other functions
            return facts;
          } catch (error) {
            console.error(error);
          }
        };
    // Everything here is what appears after the dropdowns are clicked

    return (
        <FContent >
            { mdata.map((_, i) => { // meal data specific to a meal time and date
                return (
                <FCard key={i}>
                    <Category><u>{_.category}</u></Category>
                    <RecipeContent>
                        {_.recipes.map((item,idx) => ( // Recipe Data specific to a category
                            <Recipe key={idx}>
                                    <h1>{item.name}</h1>
                                    <IconContext.Provider value = {{color: 'black', size: '25px'}}>
                                    <ADButton onClick = {() => afunc(item)} ><IoAdd/></ADButton>
                                    <ADButton onClick = {() => dfunc(item)} ><IoCloseOutline/></ADButton>

                                <div style={BUTTON_WRAPPER_STYLES}>
                                    <ADButton
                                        onClick={()=>{setIsOpen(true); setModalContent(item)}}>
                                        <IoInformationCircleOutline/>
                                    </ADButton>
                                </div>
                                    </IconContext.Provider>
                            </Recipe>
                        ))}
                        <Modal open={isOpen} onClose={()=>setIsOpen(false)}>
                            {itemFacts(modelContent)}
                        </Modal>
                    </RecipeContent>
                </FCard>
              )})
            }
     </FContent>
    )
}
// The main function that gets called for this page
// Takes in a string containing the dining hall name as input.
const MenuData = ({hall}) => {
    let auth = useContext(AuthenticationContext);
    let user = auth.currentUser;
    const [clicked, setClicked] = useState(false);
    const [todayMeals, setTodayMeals] = useState({});
    const [chosenItems, setChosenItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Used to control dropdown visuals
    const toggle = index => {
        if(clicked === index) {
            return setClicked(null)
        }
        setClicked(index);
    }

    // Adds item to plate list
    const addItem = (item) => {
        if (chosenItems.includes(item)) {
            chosenItems.filter((i) => i === item)[0]["count"] += 1;
            let temp = [...chosenItems];
            setChosenItems(temp);
        } else {
            item.count = 1;
            setChosenItems([...chosenItems, item]);
        }
    }
    // Deletes item from plate list
    const delItem = (item) => {
        if (chosenItems.includes(item)) {
            if (chosenItems.filter((i) => i === item)[0]["count"] === 1) {
                setChosenItems(chosenItems.filter((i) => i !== item));
            } else {
                chosenItems.filter((i) => i === item)[0]["count"] -= 1;
            }
        }
    }

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3001/getUserRestrictions?userId=${user?.uid}`)
            .then(response => response.json())
            .then(data => {
                const restrictions = data.map((r) => r.restriction);
                fetch(`http://localhost:3001/analysis?diningHall=${hall}&date=${getTodayDate()}&allergenRestrictions=${restrictions.join(", ")}&nonAllergenRestrictions=`)
                .then(res => res.json())
                .then(data => {
                    setTodayMeals(data);
                    setLoading(false);
                })
                .catch(err => console.error(err))
            })
        } else {
            fetch(`http://localhost:3001/analysis?diningHall=${hall}&date=${getTodayDate()}&allergenRestrictions=&nonAllergenRestrictions=`)
            .then(res => res.json())
            .then(data => {
                setTodayMeals(data);
                setLoading(false);
            })
            .catch(err => console.error(err))

        }
    }, [user, hall]);

    // Code below builds the page
    // Creates an accordion containing up to 4 categories (breakfast,lunch,dinner,late night) inside of AccordionSection
    // The current list of choseon items is displayed inside of the Plate div and is mapped inside of the ChosenItemsContainer div
    return (
        <Menu>
            <Plate>
                <h1>{hall}</h1>
                <ChosenItemsContainer>
                    {chosenItems.map((item, index) => { // Builds the list of chosen items
                        return (
                            <ChosenItem key={index}>
                                <p>{item.name}</p>
                                <p>{item.count}</p>
                            </ChosenItem>
                        )
                    })}
                </ChosenItemsContainer>
                <Link to={{pathname: "/analysis"}} state={{foods : chosenItems}}>
                    <button>Build Plate</button>
                </Link>
            </Plate>
            <IconContext.Provider value={{color: 'white', size: '30px'}}>
              <AccordionSection>
                <Container>
                    {loading && <h1>Loading...</h1>}
                    {todayMeals && Object.keys(todayMeals).map((mealName, index) => { //
                        return (
                            <div key={index}>
                                <Wrap onClick={() => toggle(index)}>
                                    <h1>{mealName}</h1>
                                    <span>{clicked === index? <BsChevronUp/> : <BsChevronDown/>}</span>
                                </Wrap>
                                {clicked === index ? (
                                <Dropdown>
                                    <MealCard mdata={todayMeals[mealName]} afunc={addItem} dfunc={delItem}/>
                                </Dropdown>
                                ) : null}
                            </div>
                        );
                    })}
                </Container>
              </AccordionSection>
            </IconContext.Provider>
        </Menu>
    )
};

export default MenuData
