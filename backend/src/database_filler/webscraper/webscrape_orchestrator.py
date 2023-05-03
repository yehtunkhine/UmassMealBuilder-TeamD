import os, shutil
from spider import scrape_data
# from recipe_parser import create_items_json
from menu_compiler import create_database_json

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
    f = open(items_path, "x+")
    f.close()
os.remove(database_path)
f = open(database_path, 'x+')
f.close

# scrape and create database.json
scrape_data()
create_database_json()