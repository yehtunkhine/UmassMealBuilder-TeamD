import { Link, useNavigate} from "react-router-dom"
import React, {useState} from 'react'
import { Data, MealData } from './AccData'
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'


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
background: lightgray;
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
margin: 25px;
scale: 300%;
background-color: lightgray;
`;



const MealCard = () => {
    const navigate = useNavigate();


    return (
        <FContent >
    { MealData.map((_, i) => (
        <FCard key={i}>
            <Category><u>{_.category}</u></Category>
            <RecipeContent>
                {_.recipes.map((item,i) => (
                    
                    <Recipe>
                        
                        <Link to={{pathname: "/FactsTemplate"}} state={{name: item.name}} style={{ textDecoration: 'none',color: 'black'}} >
                        <h1>{item.name}</h1>
                        </Link>
                    </Recipe>
                ))}
            </RecipeContent>
        </FCard>
      ))
    }
     </FContent>
    )
}

const MenuData = () => {

    const [clicked, setClicked] = useState(false);
    const toggle = index => {
        if(clicked === index) {
            // if clicked question is already active, then close
            return setClicked(null)
        }
        setClicked(index);
    }
  return (
    <Menu>
      <IconContext.Provider value={{color: 'black', size: '30px'}}>
          <AccordionSection>
            <Container>
                {Data.map((item, index) => {  
                    return (
                        <>
                        <Wrap onClick={() => toggle(index)} key = {index}>
                        <h1>{item.category}</h1>
                        <span>{clicked === index? <BsChevronUp/> : <BsChevronDown/>}</span>
                        </Wrap>
                        {clicked === index ? (
                        <Dropdown>
                            <MealCard/>
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
