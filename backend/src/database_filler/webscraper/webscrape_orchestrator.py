import os, shutil
from spider import scrape_data
from recipe_parser import create_items_json
from menu_compiler import create_database_json
import json

json_path = '../json_files'
html_path = '../html_content'
items_path = f'{json_path}/items.json'
database_path = f'{json_path}/database.json'

# ensure that html directory exists and is empty
if os.path.exists(html_path):
    shutil.rmtree(html_path)
os.mkdir(html_path)
    
# ensures json_files directory exists and database file is empty
if not os.path.exists(json_path):
    os.mkdir('../json_files')

    with open(items_path, "w+") as f:
        json.dump({}, f, indent=4, ensure_ascii=False)
else:
    try:
        os.remove(database_path)
        f = open(database_path, 'x+')
        f.close
    except FileNotFoundError:
        print()

with open(database_path, "w+") as f:
        json.dump({}, f, indent=4, ensure_ascii=False)

# scrape and create database.json
scrape_data()
create_items_json()
create_database_json()