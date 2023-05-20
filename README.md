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
## Releases

### 1.0

## Test Cases
#### 1. Integration tests to ensure that is possible to create a user account and sign in to it.
#### 2. Integration tests checking that the user is able to favorite items and access them later.
#### 3. Unit tests on all User API calls to ensure that all calls return something and do not result in a crash
#### 4. Test the creation, fetching ad deletion of user restrictions under all circumstances, valid, invalid and missing parameters, without any crashes
#### 5. Unit tests to ensure creation, fetching and deletion of no allergen restrictions works on all inputs and does not crash the system
#### 6. Unit tests favorite foods functions with all inputs to ensure proper returns and error handling to prevent system crashes
#### 7. Unit tests to ensure creating, fetching and deleting meals works on all inputs without any system crashes
#### 8. Unit tests to ensure basic find, create, delete operations function for locations
#### 9. Unit tests to ensure ability to find locations serving food items works as intended on all inputs without any crashes.
#### 10. Unit tests to ensure functions to find or modify a users favorite locations work as intended on all inputs without any crashes.
#### 11. Unit tests to ensure functions related to getting and setting a location's meal times and open/close times work as intended on all inputs without crashes.
#### 12. Unit tests to ensure basic find, create, and remove functions related to foods work properly.
#### 13. Unit tests to ensure that getting food nutritional information and analysis works properly.

## Build Process
- Install git, npm and python on local machine.
- Clone the repository
- Choose the main branch (or whatever branch you would like to update)
- Change into backend directory
- Run 'python -m pip install -r requirements.txt'
- Run NPM install and then run node server.js in git bash terminal
- Change into frontend directory in git bash terminal (cd frontend)
- Run npm start in git bash terminal


## Software Requirement Specifications (SRS)
- Continue to [SRS Doc](https://docs.google.com/document/d/1xARkV2M6CB3EhkK2Rf1cDI93MhJKZdLDTaTv2R8JQP0/edit)
## Software Design Specification (SDS)
- Contine to [SDS Doc](https://docs.google.com/document/d/1RPasyq5xxhvOO15QfFHecmJ8BU1d_DJ6zW3PnVy-DZA/edit)


## Scope


## Team Structure

- Full Stack Developer - 2 - Sivan, Jahkobee, Khiem
- Front - End Developers/UI - 2 - Lauren, Joseph
- Back-end Developers - 2 - Rishik, Chris
- Data Engineers - 2  - Omer, Lyle, Rishik
