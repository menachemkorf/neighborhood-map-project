//Model
//array with locations
var initialLocations = [
    {
        name: 'Caulfield Park',
        address: 'Caulfield North VIC 3161',
        lat: -37.872625,
        lng: 145.031354
    },
    {
        name: 'Greenmeadows Gardens',
        address: 'St Kilda East VIC 3183',
        lat: -37.872972,
        lng: 145.003894
    },
    {
        name: 'Royal Botanic Gardens',
        address: 'South Yarra VIC 3141',
        lat: -37.829695,
        lng: 144.982472
    }
];

//load google maps script after window loads
var loadMapAPI = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?callback=initializeMap';
    script.onerror = function(event){
        document.write("Sorry, we can't load google maps, please try again later.");
    };
    document.body.appendChild(script);
};

//Initialize Map after google maps script loads
var initializeMap = function() {

    //lat lng
    var myLatlng = new google.maps.LatLng(-37.868775, 145.017224);

    //options object sent alonh with request for map
    var mapOptions = {
        center: myLatlng,
        zoom: 12
    };

    //creating the map object
    //two param: DOM element, options object
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
};

$(window).load(loadMapAPI);