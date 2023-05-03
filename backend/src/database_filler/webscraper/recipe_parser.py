import json
from datetime import datetime, timedelta

from bs4 import BeautifulSoup
from requests import Session


API_ENDPOINT = "https://umassdining.com/foodpro-menu-ajax"
DINING_HALLS = ["Worcester", "Franklin", "Hampshire", "Berkshire"]

ITEMS = json.load(open("../json_files/items.json", "r"))


def add_to_database(item):
    """Add item to database."""
    global ITEMS
    if item.text not in ITEMS:
        print(f"Adding {item.text} to database...")
        obj = {
                "name": item.text,
                "nutrientInfo": {
                    "calories": item.get("data-calories"),
                    "fat": item.get("data-total-fat"),
                    "saturatedFat": item.get("data-sat-fat"),
                    "protein": item.get("data-protein"),
                    "carbohydrates": item.get("data-total-carb"),
                    },
                "ingredients": item.get("data-ingredient-list"),
                "allergens": item.get("data-allergens"),
                "recipeLabels": item.get("data-recipe-webcode"),
                "healthfulness": item.get("data-healthfulness"),
                "servingSize": item.get("data-serving-size"),
                }
        ITEMS[item.text] = obj


def create_items_json():
    session = Session()
    for i in range(len(DINING_HALLS)):
        # response = session.get(API_ENDPOINT, params={"date": datetime.now().strftime("%m/%d/%y"), "tid": DINING_HALLS.index("Berkshire") + 1})
        response = session.get(API_ENDPOINT, params={"date": (datetime.now() + timedelta(days=15)).strftime("%m/%d/%y"), "tid": i + 1})
        content = response.json()
        for meal in content.keys():
            print(f"{'=' * 10} {meal} {'=' * 10}")
            for category in content[meal].keys():
                print(f"{'-' * 10} {category} {'-' * 10}")
                soup = BeautifulSoup(content[meal][category], "html.parser")
                for item in soup.find_all("a"):
                    # add to database.
                    add_to_database(item)
                print()
            print()

        # write to file.
        with open("../json_files/items.json", "w") as f:
            json.dump(ITEMS, f, indent=4)
