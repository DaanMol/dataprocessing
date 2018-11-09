#!/usr/bin/env python
# Name: Daan Molleman
# Student number: 11275820
"""
This script parses a csv file of countries and their statistics.
It then creates a Pandas DataFrame of this data and calculates
stats for the gdp and creates a histogram. Then it creates a
boxplot of the infant mortality rate and gives its stats.
Lastly it converts the parsed data into a JSON file
"""

import csv
import pandas as pd
import matplotlib.pyplot as plt
import json as j

INPUT = 'input.csv'
# the highgest gdp per capita is that of Luxembourg
GDPMAX = 107708.22


def parse(reader):
    """
    Collects data from a csv file
    """

    # create dictionary to fill with countries and their stats
    data = {}

    # read the file, if a country has missing or invalid data,
    # do not include the country in the dictionary
    for row in reader:
        country = row['Country'].strip(' ')
        region = row['Region'].strip(' ')

        pop = row['Pop. Density (per sq. mi.)']
        if pop == 'unknown':
            continue
        else:
            pop = float(pop.replace(',', '.'))

        mort = row['Infant mortality (per 1000 births)']
        if mort:
            mort = float(mort.replace(',', '.'))
        else:
            continue

        gdp = row['GDP ($ per capita) dollars']
        if gdp == 'unknown' or gdp == '' \
           or int(gdp.strip(' dollars')) > GDPMAX:
            continue
        else:
            gdp = int(gdp.strip(' dollars'))

        # create dictionary input for each country
        data[country] = {'Region': region, "Pop. Density (per sq. mi.)": pop,
                         "Infant mortality (per 1000 births)": mort,
                         "GDP ($ per capita) dollars": gdp}

    return data


def histo(frame, column):
    """
    Plots a histogram for the specified column
    """
    # print the stats for the GDP per capita
    print(column, 'stats:')
    print("Mean =", frame[column].mean())
    print("Median =", frame[column].median())
    print("Mode =", frame[column].mode())

    gdplist = []
    for product in frame[column]:
        gdplist.append(product)
    plt.hist(x=gdplist, bins=60)
    plt.title(column)
    plt.xlabel(column)
    plt.ylabel('Frequency')
    plt.show()


def boxplot(frame, column):
    """
    Plots a boxplot of the given column
    and prints the statistics
    """
    values = []
    for value in frame[column]:
        values.append(value)

    # create a series of the values in the column to make it
    # suitabel for describe function
    stats = pd.Series(values).describe()
    median = frame[column].median()

    print(column, 'stats:')
    print('Min =', stats["min"])
    print('25% =', stats["25%"])
    print('Median =', median)
    print('75% = ', stats['75%'])
    print('Max = ', stats['max'])
    plt.title(column)
    plt.ylabel(column)
    plt.boxplot(values)
    plt.show()


def json(parsed):
    """
    Converts a dictionary to a json file
    """

    with open("output.json", "w") as write_file:
        j.dump(parsed, write_file, indent=4)


if __name__ == '__main__':

    # read the input file and parse it
    with open(INPUT) as rf:
        reader = csv.DictReader(rf)
        parsed = parse(reader)

    # create dataframe of parsed data
    frame = pd.DataFrame(parsed)

    # flip the rows and columns
    frame = frame.transpose()

    # create a histogram, a boxplot and a json file
    histo(frame, 'GDP ($ per capita) dollars')
    boxplot(frame, 'Infant mortality (per 1000 births)')
    json(parsed)
