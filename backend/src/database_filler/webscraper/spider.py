import re
import requests
from bs4 import BeautifulSoup


def add_html(fn, content):
    with open(f"../html_content/{fn}.html", "wb+") as f:
        print(f"Downloading {fn}...")
        f.write(content)


def scrape_data():
    session = requests.Session()
    res = session.get("https://af-foodpro1.campus.ads.umass.edu/foodpro.net/location.aspx")
    soup = BeautifulSoup(res.text, "html.parser")
    links = soup.find_all("a", href=re.compile("shortmenu.aspx"))
    # for link in links:
    #     print(f"{link} -- {link.get('href')}")

    # First four links are four main dining halls
    for link in links[:4]:
        fn = link.text.strip().replace(" ", "_")
        res = session.get(
            f'https://af-foodpro1.campus.ads.umass.edu/foodpro.net/{link.get("href")}'
        )
        soup = BeautifulSoup(res.content, "html.parser")
        available_dates = soup.find_all("span", class_="dateselections")
        for date in available_dates:
            print(f'{fn}__{date.text.replace(" ", "_").replace(",", "")}')
            link = date.find("a").get("href")
            res_sub = session.get(f"https://af-foodpro1.campus.ads.umass.edu/foodpro.net/{link}")
            add_html(f'{fn}__{date.text.replace(" ", "_").replace(",", "")}', res_sub.content)
