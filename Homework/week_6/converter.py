# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
"""

import json as j
import csv

INPUT = "Week 32 - The World Series.csv"
INPUT2 = "teamstats.csv"

def parse(reader):
    """
    parses a csv file into a dict
    """
    winners = []
    losers = []
    for row in reader:
        winners.append(row["Winning Team Modern Franchise"])
        losers.append(row["Losing Team Modern Franchise"])

    winnercount = {}
    for winner in winners:
        if winner not in winnercount:
            winnercount[winner] = 1
        else:
            winnercount[winner] += 1

    losercount = {}
    for loser in losers:
        if loser not in losercount:
            losercount[loser] = 1
        else:
            losercount[loser] += 1

    # teamScores = {}
    # for team in winnercount:
    #     if team in losercount:
    #         teamScores[team] = {"wins": winnercount[team], "losses": losercount[team]}
    #     else:
    #         teamScores[team] = {"wins": winnercount[team], "losses": 0}

    teamScores = []
    for team in winnercount:
        if team in losercount:
            teamScores.append({"team": team, "wins": winnercount[team], "losses": losercount[team]})
        else:
            teamScores.append({"team": team, "wins": winnercount[team], "losses": 0})

    return teamScores

def parser2(reader):
    """
    parses csv into dict
    """

    teams = {}
    for row in reader:
        teams[row["TEAM"]] = {"runs": row["R"], "hits": row["H"], "2nd": row["2B"],
        "3rd": row["3B"], "homeruns": row["HR"], "totalbase": row["TB"]}

    return teams

def json(parsed, nr):
    """
    Converts a dictionary to a json file
    """

    with open(f"data{nr}.json", "w") as write_file:
        j.dump(parsed, write_file, indent=4)

if __name__ == '__main__':
    with open(INPUT) as file:
        reader = csv.DictReader(file)
        parsed = parse(reader)
        json(parsed, 1)

    with open(INPUT2) as file2:
        reader2 = csv.DictReader(file2)
        parsed2 = parser2(reader2)
        json(parsed2, 2)
