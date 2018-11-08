#!/usr/bin/env python
# Name: Daan Molleman
# Student number: 11275820
"""
This script...
"""

import csv
import pandas as pd
import matplotlib.pyplot as plt

INPUT = 'input.csv'

def parse(reader):
    """
    Collects data from a csv file
    """

    # get needed data from file
    country_dict = {}
    # countries = []
    # regions = []
    # pop_dens = []
    # inf_mort = []
    # gdp = []
    for row in reader:
        # countries.append(row['Country'])
        country = row['Country'].strip(' ')
        # regions.append(row['Region'].strip(' '))
        region = row['Region'].strip(' ')

        pop = row['Pop. Density (per sq. mi.)']
        # print(pop)
        if pop == 'unknown':
            # pop_dens.append(0)
            pop = 0
        else:
            # pop_dens.append(float(pop.replace(',', '.')))
            pop = float(pop.replace(',', '.'))

        mort = row['Infant mortality (per 1000 births)']
        if mort:
            # inf_mort.append(float(mort.replace(',', '.')))
            mort = float(mort.replace(',', '.'))
        else:
            # inf_mort.append(0)
            mort = 0

        curr_gdp = row['GDP ($ per capita) dollars']
        if curr_gdp == 'unknown' or curr_gdp == '' or int(curr_gdp.strip(' dollars')) > 399999:
            # gdp.append(0)
            curr_gdp = 0
        else:
            # gdp.append(int(curr_gdp.strip(' dollars')))
            curr_gdp = int(curr_gdp.strip(' dollars'))

        country_dict[country] = [region, pop, mort, curr_gdp]
        # print(country_dict)

    # return[countries, regions, pop_dens, inf_mort, gdp]
    return country_dict

def histo(frame, column):
    """
    Plots a histogram for the specified column
    """
    gdplist = []
    for product in frame[column]:
        gdplist.append(product)
    plt.hist(x=gdplist, bins=60)
    plt.title(f'{column}')
    plt.xlabel(column)
    plt.ylabel('Number of countries')
    plt.show()


def boxplot(frame, column):
    """
    Plots a boxplot of the given column
    """
    values = []
    for value in frame[column]:
        values.append(value)
    numbers = pd.Series(values)
    stats = numbers.describe()
    print('Min =', stats["min"])
    print('Mean =', stats['mean'])
    plt.boxplot(values)
    plt.show()

if __name__ == '__main__':

    # read the input file and parse it
    with open(INPUT) as rf:
        reader = csv.DictReader(rf)
        parsed = parse(reader)

    # create dataframe of parsed data
    frame = pd.DataFrame(parsed, index=['Region', 'Population density',
                                        'Infant mortality rate', 'GDP'])
    # flip the rows and columns
    frame = frame.transpose()

    print("Mean =", frame['GDP'].mean())
    print("Median =", frame['GDP'].median())
    print("Mode =", frame['GDP'].mode())

    # histo(frame, 'Infant mortality rate')
    boxplot(frame, 'Infant mortality rate')
