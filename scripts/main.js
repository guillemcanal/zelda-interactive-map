

var osmLayer = L.tileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
);

var zeldaLayer = L.tileLayer(
    './tiles/{z}/{x}/{y}.png', 
    { tms: true, attribution : '&copy; Nintendo' }
);

var map = L.map('map', {
    center: [48.8501257431, 2.35703148226],
    zoom: 18,
    minZoom: 11,
    maxZoom: 18,
    layers: [osmLayer]
});


var regionsLayer = new L.GeoJSON.AJAX(
  'geojson/regions.geojson', 
  {
    weight: 1, 
    fillOpacity: 0,
    onEachFeature: (feature, layer) => {
      let area = (turf.area(feature) / 1000000).toFixed(2);
      feature.properties.area = `${area} km2`;
      if (feature.properties) {
          layer.bindPopup(tableify(feature.properties));
      }
    }
  }
);

var poiLayer = new L.GeoJSON.AJAX(
    'geojson/poi.geojson', 
    {
        pointToLayer: (feature, latlng) => {

            let iconCategory = feature.properties.category;

            let icon = L.divIcon({
              iconSize: [23, 23],
              iconAnchor: [Math.floor(23/2), Math.floor(23/2)],
              popupAnchor: [0,0],
              className: 'map-icon-svg', 
              html: `
                <div class='circle circleMap-medium' style='background-color: blue;'>
                  <span class='icon-${iconCategory} icnText-medium'></span>
                </div>
              `
            });

            return L.marker(latlng, {icon: icon});
        },

        onEachFeature: (feature, layer) => {
            if (feature.properties) {
                layer.bindPopup(tableify(feature.properties));
            }
        }
    }
);

// Contours de la commune de Paris
var parisLayer = new L.GeoJSON.AJAX(
  'geojson/paris.geojson',
  {
    onEachFeature: (feature, layer) => {
      let area = (turf.area(feature) / 1000000).toFixed(2);
      feature.properties.area = `${area} km2`;

      if (feature.properties) {
          layer.bindPopup(`<div class="scrollable">${tableify(feature.properties)}</div>`);
      }
    }
  }
);


var baseMaps = {
    "OpenStreetMap": osmLayer
}

var overlayMaps = {
    "Hyrule": zeldaLayer,
    "Régions" : regionsLayer,
    "Points d'intérêts" : poiLayer,
    "Paris" : parisLayer
}

// Add base layers
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

// Fit to overlay bounds (SW and NE points with (lat, lon))
map.fitBounds([[48.8075764862, 2.43459296452], [48.892675, 2.27947]]);