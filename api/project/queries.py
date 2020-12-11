date_range_incident_query = '''
select datetime, description, ST_AsGeoJSON(ST_MakePoint(longitude, latitude)), ST_AsGeoJSON(shape) 
    from incidents where county_name = upper(%s) and datetime between %s and %s order by datetime
'''

single_date_incident_query = '''
select datetime, description, ST_AsGeoJSON(ST_MakePoint(longitude, latitude)), ST_AsGeoJSON(shape) 
    from incidents where county_name = upper(%s) and datetime = %s order by datetime
'''

incident_response_type = ('datetime', 'description', 'point', 'shape')

get_counties_query = '''
select distinct county_name from incidents
'''