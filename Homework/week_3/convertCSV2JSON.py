# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
"""

import json as j
import csv

INPUT = "england.csv"

def parse(reader):
    """
    parses a csv file into a dict
    """

    all_data = {}

    for row in reader:
        data = {}
        for i in row:
            data[i] = row[i]
        if row["Area"] == "England":
            all_data[row['Area']] = data

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
