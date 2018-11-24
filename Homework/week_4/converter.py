# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
KTOE = kilo tonne oil equivalent
PRYENG = primary energy growth
Total over period 1960 - 2016
"""

import json as j
import csv

INPUT = "data.csv"

def parse(reader):
    """
    parses a csv file into a dict
    """
    KTOE = {}
    PRYENG = {}
    countries = []
    prev_country = None
    for row in reader:
        print(row["MEASURE"])
        data = row["Value"]
        if data == "":
            continue
        if row["MEASURE"] == "KTOE":
            data = row["Value"]
            if data == "":
                continue
            if row["LOCATION"] is not prev_country:
                KTOE[row['LOCATION']] = float(data)
                prev_country = row["LOCATION"]
            else:
                KTOE[row['LOCATION']] += float(data)
        elif row["MEASURE"] == "PC_PRYENRGSUPPLY":
            if row["LOCATION"] is not prev_country:
                PRYENG[row['LOCATION']] = float(data)
                prev_country = row["LOCATION"]
            else:
                PRYENG[row['LOCATION']] += float(data)

    return [KTOE, PRYENG]

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
