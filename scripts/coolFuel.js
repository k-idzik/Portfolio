"use strict";

var map;
var infowindow; //Displays on map marker click

var gasLat = 39.8282;
var gasLong = -98.5795;
var gasRadius = 10;
var gasType = "reg";
var price = "price";

//Event Handlers
//document.querySelector("#worldZoomButton").onclick = function() {
//    map.setZoom(1);
//}
//document.querySelector("#defaultZoomButton").onclick = function() {
//    map.setZoom(16);
//}
//document.querySelector("#buildingZoomButton").onclick = function() {
//    map.setZoom(20);
//}
//document.querySelector("#isometricViewButton").onclick = function() {
//    map.setZoom(18);
//}

//Initialize the Google map
function initMap() {
    var mapOptions = {
        center: {lat: 39.8282, lng: -98.5795},
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Map tilt
    map.mapTypeId = 'satellite';
    map.setTilt(45);
    
    initGas();
}

//Initialize the gas data
function initGas() {
    var url = "http://api.mygasfeed.com/stations/radius/" + gasLat + "/" + gasLong + "/" + gasRadius + "/" + price + "/2oj0k9o8w2.json";
    
    $.ajax({
        cache: true,
        dataType: "jsonp",
        jsonpCallback: "returnData", //Assign custom callback
        url: url,
        data: null,
        success: returnData,
    });
    //var xhr = new XMLHttpRequest();
    //        
    //xhr.onload = function() {
    //    // JSON.parse() converts a string to JSON.
    //    var gasJSON = JSON.parse( xhr.responseText );
    //    var allGas = gasJSON.stations;
    //    var html = "";
//
//        for (var i = 0; i < allGas.length; i++) {
//            var gas = allGas[i];
//        }
//    }
//
//    var url = "http://api.mygasfeed.com/stations/radius/" + gasLat + "/" + gasLong + "/" + gasRadius + "/" + price + "/2oj0k9o8w2.json?callback=returnData";
//    xhr.open('GET', url, true);
//    // try to prevent browser caching by sending a header to the server
//    xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
//    xhr.send();
}

//Return the gas data
function returnData(data) {
    console.dir(data);
}

function addMarker(latitude, longitude, title) {
    var position = {lat: latitude,lng: longitude};
    var marker = new google.maps.Marker({position: position, map: map});
    marker.setTitle(title);

    //Add a listener for the click event
    google.maps.event.addListener(marker, 'click', function(e){
        makeInfoWindow(this.position, this.title);
    });
}

function makeInfoWindow(position, msg) {
    //Close old InfoWindow if it exists
    if(infowindow)
        infowindow.close();

    //Make a new InfoWindow
    infowindow = new google.maps.InfoWindow({
        map: map,
        position: position,
        content: "<b>" + msg + "</b>"
    });
}

//Draw a polygon over the desired area
function drawPolygon(paths, title) {
    //Google magic
    var poly = new google.maps.Polygon({
        path: paths,
        map: map,
        fillColor: "#FF6000",
        strokeColor: "#FF6000",
        title: title
    });

    //Add a listener to display title
    google.maps.event.addListener(poly, 'mouseover', function(e) {
        makeInfoWindow(paths[0], title);
    });
}