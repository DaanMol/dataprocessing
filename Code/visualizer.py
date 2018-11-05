#!/usr/bin/env python
# Name: Daan Molleman
# Student number: 11275820
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

with open("movies.csv") as movies:
    reader = csv.DictReader(movies)

    # gather data from the csv
    for row in reader:
        data_dict[row['Year']].append(float(row['Rating']))

    # calculate averages
    years = []
    averages = []
    for year in data_dict:
        total = sum(data_dict[year])
        avg = total / len(data_dict[year])
        years.append(year)
        averages.append(avg)

if __name__ == "__main__":
    plt.plot(years, averages)
    plt.ylim(8,9)
    plt.ylabel("Average movie rating")
    plt.xlabel("Year")
    plt.title("Average rating of movies in the top 50 from 2008 to 2017")

    plt.show()
