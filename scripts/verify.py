import json
states = json.load(open('../metadata/states.json'))
years = json.load(open('../metadata/years.json'))

for state in states:
    for year in years:
        f = open('../data/votes-' + str(year) + '-' + str(state) + '.csv', 'r')
        if state not in f.read().decode('utf-8'):
            print year, state, "not found!"
print 'done'