# Andrew Bradberry Implementation Notes

All source for the API can be found in ./api/

You can run the Flask API by entering the command:

```
docker run -p 5000:5000 ajbradberry96/homework_urban_sdk:flaskapp
```

The demo front end can be found in ./demo_front_end.

You can run the demo front end by opening ./demo_front_end/demo.html in a web browser. (Disclaimer: front end is for demonstration purposes only and the source code is not indicative of my actual front end coding capabilities; it's very messy.)

# Example RestAPI

Frameworks: Flask or Tornado
Database: Postgres with PostGIS extension

Project Structure
  - app.py
  - config (yaml, json, text is fine)
  - requirments.txt
  - /project (for everything else)

Data: data.zip
Using the provided data create a rest API that allows the user to query incidents by county and datetime

Extra Point:
Create a front end display to show the incidents using mapbox https://www.mapbox.com/
Docker File to build project in a container

