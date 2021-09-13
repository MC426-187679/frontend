# script to download server data
mkdir disciplinas

# download webscraper
git clone git@gitlab.com:disciplinas1/mc426/projeto.git scraper
cd scraper
git checkout develop

# then download the data with it
cd scraping
python3 scrape.py ../../disciplinas
