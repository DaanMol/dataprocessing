#!/usr/bin/env python
# Name: Daan Molleman
# Student number: 11275820
"""
This script...
"""

import csv
import pandas

INPUT = 'input.csv'

def parse(reader):
    """
    Collects data from a csv file
    """

    # get needed data from file
    countries = []
    regions = []
    inf_mort = []
    gdp = []
    for row in reader:
        countries.append(row['Country'])
        regions.append(row['Region'].strip(' '))
        inf_mort.append(row['Infant mortality (per 1000 births)'])
        gdp.append(row['GDP ($ per capita) dollars'])
    print(gdp)

if __name__ == '__main__':

    file = INPUT

    with open(file) as rf:
        reader = csv.DictReader(rf)
        parse(reader)
