function displayResponse() {
    response = JSON.parse(this.responseText)

    if (response.length === 0) {
        document.getElementById('error').style.visibility = 'visible'
        return
    }

    shape = JSON.parse(response[0]['shape'])
    points = response.map(x => {
        point = {
            type: 'feature',
            geometry: JSON.parse(x['point']),
            properties: {
                description: x['datetime'].toString() + ':   ' + x['description']
            }
        }

        return point
    })

    points.forEach(point => 
        document.getElementById('incident-list').innerHTML += '<li onclick="flyTo(' + point.geometry.coordinates[0] 
                                                                            + ',' + point.geometry.coordinates[1] + ')">' + point.properties.description 
                                                                            + '</li>')
    
    description = JSON.parse(this.responseText)[0]['description']

    countySource = {
        type: 'geojson',
        data: shape
    }

    pointSource = {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: points
        }
    }

    map.addSource('county', countySource)

    map.addLayer({
        'id': 'county-layer',
        'type': 'fill',
        'source': 'county',
        'paint': {
        'fill-color': '#888888',
        'fill-opacity': 0.2
        }
    });

    map.addSource('points', pointSource)

    map.addLayer({
        'id': 'point-layer',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'icon-image': 'map-marker',
            'icon-anchor': 'bottom',
            'icon-offset': [0, 5],
            'icon-allow-overlap': true
          }
    });

    map.on('click', 'point-layer', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
         
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });
    
    map.flyTo({
        center: [
        points[0].geometry.coordinates[0],
        points[0].geometry.coordinates[1]
        ],
        zoom: 8,
        essential: true 
    });
}

function flyTo(lat, lon) {
    map.flyTo({
        center: [
        lat,
        lon
        ],
        zoom: 14,
        essential: true 
    });
}

function formatParams( params ){
    return "?" + Object
          .keys(params)
          .map(function(key){
            return key+"="+encodeURIComponent(params[key])
          })
          .join("&")
  }

function makeAndDisplayGetRequest() {
    document.getElementById('incident-list').innerHTML = ''
    document.getElementById('error').style.visibility = 'hidden'
    if (map.getLayer('county-layer')) {
        map.removeLayer('county-layer');
      }
    if (map.getSource('county')) {
        map.removeSource('county');
    }

    if (map.getLayer('point-layer')) {
        map.removeLayer('point-layer');
      }
    if (map.getSource('points')) {
        map.removeSource('points');
    }
    var form = document.getElementById('query-form')

    var params = {
        county: form[0].value,
        date1: form[1].value
    }

    if (form[2].value !== '') {
        params['date2'] = form[2].value
    }

    var oReq = new XMLHttpRequest()
    oReq.onload = displayResponse
    oReq.open('get', 'http://127.0.0.1:5000/api/incidents' + formatParams(params), true)
    oReq.send()
}

function setCountySuggestions() {
    var datalist = document.getElementById('suggestions')

    JSON.parse(this.responseText).forEach(element => {
        datalist.innerHTML += '<option value="' + element + '" />'
    });
}

window.onload = function getCounties() {
    var oReq = new XMLHttpRequest()
    oReq.onload = setCountySuggestions
    oReq.open('get', 'http://127.0.0.1:5000/api/counties', true)
    oReq.send()
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYWpicmFkYmVycnk5NiIsImEiOiJja2lnOHdvNjgwNHNmMnhzODE1dGY3MnJnIn0.tv0okSu48VnH3B_p8lfD7w';
YOUR_API_KEY = 'pk.eyJ1IjoiYWpicmFkYmVycnk5NiIsImEiOiJja2lnOHdvNjgwNHNmMnhzODE1dGY3MnJnIn0.tv0okSu48VnH3B_p8lfD7w'
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-82.5, 27.6],
zoom: 6
});

map.loadImage(`https://upload.wikimedia.org/wikipedia/commons/f/f5/4_lmb.png`, function(error, image) {
  if (error) throw error;
  map.addImage('map-marker', image); //38x55px, shadow adds 5px
});