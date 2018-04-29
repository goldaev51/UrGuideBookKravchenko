//global variables
var map;
//var circle;
var markers = [];//array of markers
var searchBox;
var userLocation;

//init map and services
function initMap(){
    //create a map, default centered in the middle of Kyiv
    //shuld be later overridden by real user's position
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 50.45466, lng: 30.5238},
        zoom: 11,
        mapTypeControl: false,
        fullscreenControl: false
    });

    //marker for user's position
    var marker = new google.maps.Marker({
       animation: google.maps.Animation.DROP,
       title: "You are here!"
    });

    var infoWindow = new google.maps.InfoWindow({
       content: 'You are here!'
    });
    marker.addListener('click', function () {
       infoWindow.open(map, marker);
    });
    /*
    //circle for radius options setting
    circle = new google.maps.Circle({
        strokeColor: '#326d9f',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#326d9f',
        fillOpacity: 0.2,
        radius: 1000,
        editable: false
    });

    //method to know if the spot is inside a circle
    google.maps.Circle.prototype.contains = function(latLng) {
        return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
    */

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);
    //set the searchBox to the top
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    //execute this function when user enters something new into the searchBox
    searchBox.addListener('places_changed', function() {
        //get set of places user requested
        var places = searchBox.getPlaces();

        //break if no places were found
        if (places.length === 0) {
            return;
        }

        markers.forEach(function(marker){
           marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            /*
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                //scaledSize: new google.maps.Size(25, 25)
            };
            */

            var icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        var placeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < markers.length; i++){
            markers[i].addListener('click', function(){
                populateInfoWindow(this, placeInfoWindow);
            });
        }
        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(userLocation);
            map.setCenter(userLocation);
            //circle.setCenter(userLocation);
            map.setZoom(13);
            marker.setMap(map);
            //$("#filter").css("display","inline-block");
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>' + '<a href="#">Add to favorites</a>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}
/*
function selectRadius() {
    var button = $("#filter");
    if (button.hasClass("unclicked")){
        circle.setMap(map);
        circle.setEditable(true);
        button.html('Save');
        button.removeClass('btn-primary');
        button.addClass('btn-success');
        $("#remove_filter").css("display", "inline-block");
    }
    else{
        circle.setEditable(false);
        button.html('Change options');
        button.removeClass('btn-success');
        button.addClass('btn-primary');
        redrawMarkers();
    }
    button.toggleClass("unclicked");
}
function removeRadius(){
    var button = $("#filter");
    if (!button.hasClass("unclicked")){
        button.removeClass('btn-success');
        button.addClass('btn-primary');
        button.addClass("unclicked");
        circle.setCenter(userLocation);
    }
    removeMarkers();
    circle.setMap(null);
    button.html('Set radius options');
    $("#remove_filter").css("display", "none");
}

//if radius options were changed
function redrawMarkers(){
    searchWithinCircle();
}
//check whether some markers belong to the selected area
function searchWithinCircle(){
    for (var i = 0; i < markers.length; i++){
        if (!circle.contains(markers[i].position)){
            markers[i].setMap(null);
        }
        else{
            markers[i].setMap(map);
        }
    }
}
//for delete button call
function removeMarkers(){
    for (var i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
}
*/