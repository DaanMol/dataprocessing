# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
"""

import json as j
import csv

INPUT = "data.csv"

def parse(reader):
    """
    parses a csv file into a dict
    """
    all_data = {}
    countries = []
    for row in reader:
        data = {}
        for i in row:
            data[i] = row[i]
        all_data[row['LOCATION']] = data

    # countries.append(row['LOCATION'])
    # data[row['LOCATION']] = row['Value']
    # cset = set(countries)

    print(all_data)

    return all_data

def json(parsed):
    """
    Converts a dictionary to a json file
    """

    with open("data.json", "w") as write_file:
        j.dump(parsed, write_file, indent=4)

if __name__ == '__main__':
    with open(INPUT) as file:
        reader = csv.DictReader(file)
        parsed = parse(reader)

        json(parsed)
