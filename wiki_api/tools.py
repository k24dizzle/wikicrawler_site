import requests
import bs4
from urllib import unquote


baseUrl = 'https://en.wikipedia.org/wiki/'
badLinks = (':', 'wikipedia', 'Wikipedia', 'wikimedia', 'Main_Page', 'wikisource', 'wiktionary')

def get_ten_links(page):
    soup = get_soup(page)
    return get_filtered_links(soup)

def get_filtered_links(soup):
    raw_hrefs = [a.get('href') for a in soup.select('#bodyContent a')]
    filtered_hrefs = filter(link_filter, raw_hrefs)
    pages = [link.split('/')[-1].replace('_', ' ').replace('%E2%80%93', '-') for link in filtered_hrefs]
    return list(set(pages))

def link_filter(href):
    if href is None:
        return False
    for s in badLinks:
        if s in href:
            return False
    return '/wiki/' in href

def get_soup(page):
    page.replace(' ', '_')
    text = requests.get(baseUrl + page).text
    soup = bs4.BeautifulSoup(text, "html.parser")
    return soup

