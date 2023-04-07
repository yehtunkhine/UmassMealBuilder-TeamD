import React, {useState} from 'react'
import { Data, FoodData } from './AccData'
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
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border-bottom: 1px solid black;
border-top: 1px solid black;
border-left: 1px solid;
border-right: 1px solid;
max-height: 300px;
overflow-y: scroll;



`;

const Menu = styled.div`

`;

const FCard = styled.div`
align-items: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
    display: flex;
    max-width: 50px;
    max-height: 50px;
    justify-content: center;
    scale: 20%;

`;

const FContent= styled.div`
display: grid;
  grid-gap: 2rem;
  padding: 1.5rem 2rem;
  
  grid-template-columns: repeat(auto-fit, 0px);
  justify-content: space-evenly;
`;


const FoodCard = () => {
    return (
        <FContent>
    { FoodData.map((_, i) => (
        <FCard key={i}>
            <img src = {_.image} style={{ width: 400, height: 400 }}></img>
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
                            <FoodCard/>
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
