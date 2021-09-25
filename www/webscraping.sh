# script to download server data
mkdir disciplinas

# download webscraper
git clone git@gitlab.com:disciplinas1/mc426/backend.git scraper
cd scraper
git checkout backend/main

# then download the data with it
cd scraping
python3 scrape.py ../../disciplinas
