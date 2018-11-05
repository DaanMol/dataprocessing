#!/usr/bin/env python
# Name: Daan Molleman
# Student number: 11275820
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # find the title and year
    titles = []
    years = []

    # titles are listed under the h3 tag
    title_finder = dom.find_all('h3')
    for t in title_finder:
        a = t.find('a')
        if not a or a.text == ' \n':
            continue
        titles.append(a.text)

        # years are listed under the span tag as "lister-item-year"
        y = t.find_all('span')
        if not y:
            continue
        for year in y:
            if year.attrs['class'][0] == "lister-item-year":
                years.append(year.text.strip(' ()I'))

    # find the rate
    rates = []

    # rates are listed under the meta tag as 'ratingValue'
    rate_finder = dom.find_all('meta')
    for r in rate_finder:
        if 'itemprop' in r.attrs and r.attrs['itemprop'] == 'ratingValue':
            rates.append(r.attrs['content'])

    # find names
    names = []
    name_finder = dom.find_all('p')
    for p in name_finder:

        # actors are listed in a paragraph with an empty attribute
        if 'class' in p.attrs and p.attrs['class'][0] == '':
            name_find = p.find_all('a')
            actors = ''

            # if the movie has no actors listed, add an entry anyway
            if not name_find:
                names.append('')
            for name in name_find:
                if 'href' in name.attrs and 'li_st_' in name.attrs['href']:
                    actors += name.text
                    actors += ', '
            if actors != '':
                names.append(actors)

    # find runtime
    runtimes = []

    # runtimes are listed under span as 'runtime'
    run_finder = dom.find_all('span')
    for r in run_finder:
        if 'class' in r.attrs and r.attrs['class'][0] == 'runtime':
            time = r.text.split()
            runtimes.append(time[0])

    return [titles, rates, years, names, runtimes]

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK
    for i in range(len(movies[0])):
        writer.writerow([movies[0][i], movies[1][i], movies[2][i],
                        movies[3][i], movies[4][i]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
