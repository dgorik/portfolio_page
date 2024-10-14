
var google;

function initMap() {
    var myLatlng = new google.maps.LatLng(40.6965, -73.9934);

    var mapOptions = {
        zoom: 14,
        center: myLatlng,
        scrollwheel: false,
        styles: [{ "featureType": "all", /* ... Your map styles ... */ }]
    };

    var mapElement = document.getElementById('map');
    var map = new google.maps.Map(mapElement, mapOptions);

    var addresses = ['New York'];

    for (var x = 0; x < addresses.length; x++) {
        (function (index) {
            $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?key=YOUR_API_KEY&address=${addresses[index]}&sensor=false`, null, function (data) {
                var p = data.results[0].geometry.location;
                var latlng = new google.maps.LatLng(p.lat, p.lng);
                new google.maps.Marker({
                    position: latlng,
                    map: map,
                    icon: 'img/loc.png'
                });
            });
        })(x);
    }
}

// Ensure your API key is properly inserted in the following script tag
// and that jQuery is included before this script.
// Also, ensure that this script runs after the Google Maps API is loaded.
google.maps.event.addDomListener(window, 'load', initMap);