# Team D
UMass Meal Builder App

## Description

A nutrition-based web app designed to provide University of Massachusetts Amherst students with personalized dietary options and nutritional information for meals served in the dining commons. The app allows users to select food based on their dietary preferences and restrictions and provides access to comprehensive nutritional information, including calorie counts, macronutrient breakdowns, and allergen warnings. Users can also set alerts for their favorite meals and track their nutrition to make informed decisions about their dietary choices. With this app, UMass students can easily navigate the dining commons and create a more inclusive dining experience for all.

## Tech Stack

- Backend
    - Node.js
        - Communicates with Firebase for User Authentication/Data storage and retrieval
    - Express JS
    -  REST API
- Frontend / UI
    - React
- Database / API’s
    - Firestore
    - postGresSQL
    - Firebase Authentication
    - UMass Dining
        - Source of menu/food information

## Challenges and Risks
- Integrating between frontend and backend
    - Displaying the data from UMass Dining Nutritional website onto the correct places on the client side
- Updating the different meals available for different days.
- Locations open and close at different times based on the day of the week, weekends and holidays. This must be accounted for.

## Backlogged Features
- Add favorite items
    - Be able to favorite items from the analysis/dining halls food and save them to user
- See upcoming favorites
    - In the user page add a calendar that will show upcoming favorite foods and the dining hall they are in.
- Analyze future foods
    - Be able to select the date when analyzing food in order to be able to plan future meals
- Off campus dining
    - Add off campus dining places/Blue Wall to the available foods, and being able to analyze them
- Flag items
    - Add a feature where the user can flag items in the current day’s dining hall in order to tell other users that it may not be there.
- Search feature
    - Add a feature to search foods, so you don’t have to scroll through every food
- Popular items
    - By using all user’s favorites or analyzed food, add a section where users can see popular food

## Releases

### 1.0

## Test Cases
- Integration tests to ensure that is possible to create a user account and sign in to it.
- Integration tests checking that the user is able to favorite items and access them later.
- Unit tests on all User API calls to ensure that all calls return something and do not result in a crash
- Test the creation, fetching ad deletion of user restrictions under all circumstances, valid, invalid and missing parameters, without any crashes
- Unit tests to ensure creation, fetching and deletion of no allergen restrictions works on all inputs and does not crash the system
- Unit tests favorite foods functions with all inputs to ensure proper returns and error handling to prevent system crashes
- Unit tests to ensure creating, fetching and deleting meals works on all inputs without any system crashes
- Unit tests to ensure basic find, create, delete operations function for locations
- Unit tests to ensure ability to find locations serving food items works as intended on all inputs without any crashes.
- Unit tests to ensure functions to find or modify a users favorite locations work as intended on all inputs without any crashes.
- Unit tests to ensure functions related to getting and setting a location's meal times and open/close times work as intended on all inputs without crashes.
- Unit tests to ensure basic find, create, and remove functions related to foods work properly.
- Unit tests to ensure that getting food nutritional information and analysis works properly.

## Build Process
- Install git, npm and python on local machine.
- Clone the repository
- Choose the main branch (or whatever branch you would like to update)
- Run 'npm install' to get dependencies
- Change into backend directory(cd backend) and run 'python -m pip install -r requirements.txt'
- Run 'node server.js' in git bash terminal ('server.js' file is located in '/backend/src/server/' directory)
- Change into frontend directory in a seperate git bash terminal (cd frontend)
- Run 'npm start' in git bash terminal


## Software Requirement Specifications (SRS)
- Continue to [SRS Doc](https://docs.google.com/document/d/1xARkV2M6CB3EhkK2Rf1cDI93MhJKZdLDTaTv2R8JQP0/edit)
## Software Design Specification (SDS)
- Contine to [SDS Doc](https://docs.google.com/document/d/1RPasyq5xxhvOO15QfFHecmJ8BU1d_DJ6zW3PnVy-DZA/edit)
## Test Plan Documentation
- Continue to [Test_Doc](https://docs.google.com/document/d/10I2CrcpcRK6KH5of0NHJlbkwWZKUcQg38x7Yp3QMQwo/edit?usp=sharing)


## Team Structure
- Full Stack Developer - 2 - Sivan, Jahkobee, Khiem
- Front - End Developers/UI - 2 - Lauren, Joseph
- Back-end Developers - 2 - Rishik, Chris
- Data Engineers - 2  - Omer, Lyle, Rishik
