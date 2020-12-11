from project import app, conn
from flask import request, abort
from project.queries import single_date_incident_query, date_range_incident_query, incident_response_type, get_counties_query
import psycopg2 as pg
import json

@app.route("/api/incidents", methods=['GET'])
def incidents():
    """
    Retrieves list of incidents in a county that occurred either between two datetimes or at one datetime
    ---
    parameters:
        - name: county
          in: path
          type: string
          required: true
          description: The county the incident(s) occurred in.
        - name: date1
          in: path
          type: datetime
          required: true
          description: If alone, the datetime of the incident. If paired with date2, the beginning of the date range the incidents occurred during.
        - name: date2
          in: path
          type: datetime
          required: false
          description: The end of the date range the incidents occurred during.
    responses:
        200:
            description: List of incidents in given county during correct timeframe
            type: array
            items: 
                {'datetime': datetime, 'description': string, 'point': GeoJSON, 'shape': GeoJSON}
        400:
            description: Bad or missing required parameters
    """
    try:
        date_range = 'date2' in request.args.keys()

        date_1 = request.args['date1']

        if date_range:
            date2 = request.args['date2']
        
        county = request.args['county']
    except:
        abort(400, 'Missing parameters on request.')
    
    with conn.cursor() as cur:
        try:
            if date_range:
                cur.execute(date_range_incident_query, (county, date_1, date2))
            else:
                cur.execute(single_date_incident_query, (county, date_1))
            raw_response = cur.fetchall()
        except pg.errors.lookup("22007"):
            cur.execute('rollback')
            abort(400, 'Incorrect Datetime Format')
        except Exception as e:
            print(e)
            cur.execute('rollback')
            abort(500, 'Internal Server Error.')

    response = [{key: r[i] for i, key in enumerate(incident_response_type)} for r in raw_response]
    return json.dumps(response, default=lambda o: o.__str__())

@app.route("/api/counties", methods=['GET'])
def counties():
    """
    Retrieves list of county names.
    ---
    responses:
        200:
            description: List of counties with incidents
            type: array
            items: 
                string
    """
    
    with conn.cursor() as cur:
        try:
            cur.execute(get_counties_query)

            raw_response = cur.fetchall()

        except:
            cur.execute('rollback')
            abort(500, 'Internal Server Error.')

        response = [raw_response[i][0] for i in range(len(raw_response))]
    return json.dumps(response)