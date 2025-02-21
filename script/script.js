document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map with an initial view
    const map = L.map('map').setView([37.8, -96], 4);

    // Add Mapbox tiles
    L.tileLayer('https://api.mapbox.com/styles/v1/breezy69/cm7b3c3hc003101rg1kzba8i1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJlZXp5NjkiLCJhIjoiY2xvaXlwMWxpMHB2cjJxcHFyeTMwNzk0NCJ9.R18DLRCA9p_SNX-6dtZZZg', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.mapbox.com">Mapbox</a>'
    }).addTo(map);

    // Fetch and add the GeoJSON data from the local file
    fetch('https://cdn.glitch.global/87b30419-3507-442a-94ef-2030b24ceb5d/Bridges.geojson?v=1740010825904')
        .then(response => response.json())
        .then(data => {
            console.log('GeoJSON data loaded:', data);

            // Add GeoJSON layer to the map with custom markers
            var geoJsonLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: getColor(feature.properties.InstallYear),
                        color: '#000',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                onEachFeature: function (feature, layer) {
                    // Define the popup content for the selected attributes
                    var popupContent = `<strong>Bridge Name:</strong> ${feature.properties.Name}<br>
                                        <strong>Sufficiency Rating:</strong> ${feature.properties.SufficiencyRating}<br>
                                        <strong>Condition:</strong> ${feature.properties.Condition}<br>
                                        <strong>Year Installed:</strong> ${feature.properties.InstallYear}`;

                    layer.bindPopup(popupContent);
                }
            }).addTo(map);

            console.log('GeoJSON layer added to map:', geoJsonLayer);

            // Adjust map view to fit the GeoJSON layer
            map.fitBounds(geoJsonLayer.getBounds());

            // Add the legend to the map
            var legend = L.control({ position: 'bottomright' });

            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'legend');
                
                div.innerHTML += '<strong>Year Installed</strong><br>';
                div.innerHTML += '<i style="background:#FFEDA0"></i> 1900&ndash;1920<br>';
                div.innerHTML += '<i style="background:#FED976"></i> 1920&ndash;1960<br>';
                div.innerHTML += '<i style="background:#FEB24C"></i> 1960&ndash;2000<br>';
                div.innerHTML += '<i style="background:#FD8D3C"></i> 2000&ndash;2020<br>';
                div.innerHTML += '<i style="background:#CCCCCC"></i> No Data<br>'; // Null handler for legend

                return div;
            };

            legend.addTo(map);
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
        });

    // Color function based on YearInstalled
    function getColor(d) {
        if (d == null || d > 2020) {
            return '#CCCCCC'; // Color for null values or years > 2020
        }
        return d > 2000 ? '#FC4E2A' :
               d > 1960 ? '#FD8D3C' :
               d > 1920 ? '#FEB24C' :
               d >= 1900 ? '#FFEDA0' :
                          '#CCCCCC'; // Default color for any undefined values
    }
});

//Microsoft Copilot was used to help debug and structure this code