import csv, json
from sys import argv

in_csv = argv[1]
out_json = argv[2]

TEAM_CITY = 'Philadelphia'
ARENA_NAME = 'Wells Fargo Center'

raw_schedule = csv.reader(open(in_csv, 'r'), delimiter=',')
schedule = []

name_lookup = { 'Boston'        : 'Celtics',
                'Brooklyn'      : 'Nets',
                'New York'      : 'Knicks',
                'Philadelphia'  : '76ers',
                'Toronto'       : 'Raptors',
                'Dallas'        : 'Mavericks',
                'Houston'       : 'Rockets',
                'Memphis'       : 'Grizzlies',
                'New Orleans'   : 'Hornets',
                'San Antonio'   : 'Spurs',
                'Chicago'       : 'Bulls',
                'Cleveland'     : 'Cavaliers',
                'Detroit'       : 'Pistons',
                'Indiana'       : 'Pacers',
                'Milwaukee'     : 'Bucks',
                'Denver'        : 'Nuggets',
                'Minnesota'     : 'Timberwolves',
                'Portland'      : 'Trail Blazers',
                'Oklahoma City' : 'Thunder',
                'Utah'          : 'Jazz',
                'Atlanta'       : 'Hawks',
                'Charlotte'     : 'Bucks',
                'Miami'         : 'Heat',
                'Orlando'       : 'Magic',
                'Washington'    : 'Wizards',
                'Golden State'  : 'Warriors',
                'Phoenix'       : 'Suns',
                'Sacramento'    : 'Kings' }

for row in raw_schedule:
    if row[2] != ARENA_NAME:
        home_game = False
    else: 
        home_game = True

    if row[3].strip() == 'L.A.Clippers':
        print 'Playing the Clips'
        opponent_city = 'Los Angeles'
        opponent_name = 'Clippers'
    elif row[3].strip() == 'L.A.Lakers':
        print 'Playing the Lakers'
        opponent_city = 'Los Angeles'
        opponent_name = 'Lakers'
    else: 
        opponent_city = row[3].strip()
        opponent_name = name_lookup[opponent_city]

    json_data = { 'date' :          row[0],
                  'time' :          row[1],
                  'location' :      row[2].title(),
                  'opponent_city' : opponent_city,
                  'opponent_name' : opponent_name,
                  'home_game' :     home_game } 
    schedule.append(json_data)

full_contents = { 'title' : " ".join([TEAM_CITY, name_lookup[TEAM_CITY], '2012-2013 Regular Season Schedule']),
                  'games' : schedule }

f = open(out_json, 'w')
f.write(json.dumps(full_contents, indent=4))
