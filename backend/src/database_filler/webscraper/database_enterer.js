import {Food, FoodRestriction, Location, LocationFoodBridge, FoodNonAllergenRestriction} from '../../models.js';
import * as fs from 'fs';
import { spawn } from 'child_process'
import * as process from 'process';
import {exit} from 'process';
import moment from 'moment';
import * as path from 'path'

let items_path = '../json_files/items.json'
let database_path = '../json_files/database.json'
let unfound_food_items_path = '../json_files/unfoundFoodItems.json'
let SERVER_JS_CWD = '';
async function fill_database(){
    // change working directory so paths work correctly
    if(path.basename(process.cwd()) == 'server'){
        SERVER_JS_CWD = process.cwd();
        process.chdir('../database_filler/webscraper');
    }
    else{
        throw new Error("Do not know file directory structure.");
    }

    // calls python scripts to gather data from UMass
    async function scrape_data(){
        let finished = false;
        let err = false;
        const python = spawn('python', ['webscrape_orchestrator.py']);

        python.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        python.stderr.on('data', (data) => {
            console.log("Error");
            console.error(`Error: ${data}`);
            err = true;
        });

        python.on('exit', (code) => {
            finished = true;
        })

        while(!finished){
            console.log("waiting");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        if(err){
            console.log("Python Failed");
            exit;
        }
    }

    async function create_food_entries(){
        let recipeLabelMap = {
            SUS: "Sustainable",
            LPR: "Locally Produced",
            VGT: "Vegetarian",
            VGN: "Vegan",
            H: "Halal",
            CR1: "A Carbon Rating",
            CR2: "B Carbon Rating",
            CR3: "C Carbon Rating",
            CR4: "D Carbon Rating",
            CR5: "E Carbon Rating",
            AF: "Antiobiotic Free",
            H0: "Healthfulness 0",
            H1: "Healthfulness 1",
            H2: "Healthfulness 2",
            H3: "Healthfulness 3",
            H4: "Healthfulness 4",
            H5: "Healthfulness 5",
            H6: "Healthfulness 6",
            H7: "Healthfulness 7",
            WG: "Whole Grain"
        };

        const foodItems = JSON.parse(fs.readFileSync(items_path, 'utf-8'));
        const foodAllergyBulk = [];
        const foodNonAllergyRestrictionBulk = [];
        let errorMsg = "";
        for(const entry of Object.entries(foodItems)){
            let food = entry[1];
            
            let nutrientInfo = food["nutrientInfo"];
            let foodItemName = food["name"];
            let foodIngredients = food["ingredients"];
            let foodCalories = nutrientInfo["calories"];
            let foodFat = nutrientInfo["fat"].replace("g", "");
            let foodSaturatedFat = nutrientInfo["saturatedFat"].replace("g", "");
            let foodProtein = nutrientInfo["protein"].replace("g", "");
            let foodCarbs = nutrientInfo["carbohydrates"].replace("g", "");
            let foodHealthfulness = food["healthfulness"];
            let foodServingSize = food["servingSize"];

            if(foodCalories == "" || foodCalories == null){
                foodCalories = 0;
            }
            if(foodFat == "" || foodFat == null){
                foodFat = 0;
            }
            if(foodSaturatedFat == "" || foodSaturatedFat == null){
                foodSaturatedFat = 0;
            }
            if(foodProtein == "" || foodProtein == null){
                foodProtein = 0;
            }
            if(foodCarbs == "" || foodCarbs == null){
                foodCarbs = 0;
            }
            if(foodHealthfulness == "" || foodHealthfulness == null){
                foodHealthfulness = 0;
            }
            
            let foodItem = {
                name: foodItemName,
                ingredients: foodIngredients,
                calories: foodCalories,
                fat: foodFat,
                saturated_fat: foodSaturatedFat,
                protein: foodProtein,
                carbs: foodCarbs,
                healthfulness: foodHealthfulness,
                servingSize: foodServingSize
            };

            let dbFoodItem = null;
            try{
                dbFoodItem = await Food.create(foodItem);
            }catch(e){
                errorMsg += e.message + "\n" + JSON.stringify(foodItem) + 
                "==============================================================\n\n\n";
                continue;
            }

            if(dbFoodItem == null){
                continue;
            }
            
            let allergens = food["allergens"].trim().replace("\n", " ").split(",").map((s) => s.trim())
            .filter((s) => s != null && s != undefined && s.trim() != "");
            
            let restrictions = food["recipeLabels"].trim().replace("\n", " ").split(" ")
            .map((s) => s.trim()).map((s) => recipeLabelMap[s]).filter((s) => s != null && s != undefined && s.trim() != "");

            for(const allergen of allergens){
                foodAllergyBulk.push({foodId: dbFoodItem.foodId, restriction: allergen});
            }
            for(const rest of restrictions){
                foodNonAllergyRestrictionBulk.push({foodId: dbFoodItem.foodId, restriction: rest});
            }

            console.log('Found food item: ' + foodItemName);
        }

        await FoodRestriction.bulkCreate(foodAllergyBulk, {ignoreDuplicates: true});
        await FoodNonAllergenRestriction.bulkCreate(foodNonAllergyRestrictionBulk, {ignoreDuplicates: true});

        console.log(errorMsg);
    }



    // database.json is of structure
    /*
    {
        Dining_Hall_Name: [
            {
                date,
                meals: {
                    Meal_Time: {
                        {
                            category,
                            recipes: [{name}]
                        },
                    }
                }
            }
        ]
    }
    */
    async function create_food_location_relations(){
        const failedToFindFoodItem = new Set();
        const FoodLocationEntryBulk = [];
        const database = JSON.parse(fs.readFileSync(database_path, 'utf-8'));
        for(const entry of Object.entries(database)){
            const diningHallName = entry[0].replaceAll('_', ' ').trim();

            let location = await Location.findOne({
                where: {locationName: diningHallName} 
            });

            if(location == null){
                location = await Location.create({locationName: diningHallName});
            }

            const diningHall = location;
            const diningHallDailyMenu = entry[1];
            for(const day of diningHallDailyMenu){
                const date = moment(day['date'], 'MM-DD-YYYY').format('YYYY-MM-DD');
                
                for(const mealEntry of Object.entries(day['meals'])){
                    const mealTime = mealEntry[0];
                    const meals = mealEntry[1];

                    for(const meal of meals){
                        const mealCategory = meal['category'];
                        const foodItemsOfCategory = meal['recipes'];

                        for(const foodItem of foodItemsOfCategory){
                            const foodItemName = foodItem['name'];

                            const dbFoodEntry = await Food.findOne({
                                where: {name: foodItemName}
                            });

                            if(dbFoodEntry == null){
                                failedToFindFoodItem.add(foodItemName);
                                continue;
                            }

                            FoodLocationEntryBulk.push({
                                foodId: dbFoodEntry.foodId,
                                locationId: diningHall.locationId,
                                Time: mealTime,
                                Date: date,
                                category: mealCategory
                            });

                            console.log('Found "' + foodItemName + '" being served at "' + diningHall.locationName + '" during "' + mealTime + '" on "' + date + '"');
                        }
                    }
                }
            }
        }
        
        fs.writeFileSync(unfound_food_items_path, JSON.stringify(Array.from(failedToFindFoodItem), undefined, 2));
        console.log(failedToFindFoodItem.size)
        await LocationFoodBridge.bulkCreate(FoodLocationEntryBulk, {ignoreDuplicates: true});
    }

    console.log('Scraping web data')
    await scrape_data();
    console.log("Entering food items into db...");
    await create_food_entries();
    console.log("Entering food location relationship entries into db");
    await create_food_location_relations();

    // change back to the correct working directory of server.js
    process.chdir(SERVER_JS_CWD);
}

export default fill_database