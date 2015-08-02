var map;

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
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    //info window
        map.infoWindowContentStr = '<div class="info-window">' +
            '<div class="wiki-container"><h4>Wikipedia</h4><div class="wiki-content">wikipedia articles...</div></div>' +
            '</div>';

        map.infoWindow = new google.maps.InfoWindow({
            content: map.infoWindowContentStr
        });

    ko.applyBindings(ViewModel);
};

$(window).load(loadMapAPI);





//Model
//array with locations
var initialLocations = [
    {
        name: 'Melbourne Zoo',
        address: 'Capital City Trail',
        lat: -37.780870,
        lng: 144.951499
    },
    {
        name: 'Melbourne Aquarium',
        address: 'Melbourne VIC',
        lat: -37.820894,
        lng: 144.958240
    },
    {
        name: 'Melbourne Royal Botanic Gardens',
        address: 'South Yarra VIC 3141',
        lat: -37.829695,
        lng: 144.982472
    },
    {
        name: 'Melbourne Luna Park',
        address: '14 Lower Esplanade St Kilda VIC 3182',
        lat: -37.867404,
        lng: 144.976872
    },
    {
        name: 'Melbourne Museum',
        address: 'Carlton VIC',
        lat: -37.803421,
        lng: 144.972905
    }
];

var Locations = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

var addMarker = function(data) {

    //var selectedLocation = null;
    //for (var i = 0; i < data.length; i++) {
        data.marker = new google.maps.Marker({
            position: {
                lat: data.lat(),
                lng: data.lng()
            },
            map: map,
            title: data.name()
        });
        //google.maps.event.addListener(marker, 'click', function() {
        //    selectedLocation = this;
        //    console.log(selectedLocation);
        //});
    //}


};

var initInfoWindow = function() {
        //info window
        var contentStr = '<div>This is my home</div>';
        var infoWindow = new google.maps.InfoWindow({
            content: contentStr
        });
        /*google.maps.event.addListener(marker, 'click', function() {
            console.log(this);
            //infoWindow.open(map, marker);
        });*/

}

var ViewModel = function() {
    var self = this;

    //holds all locations in onservable array
    self.locationsAll = ko.observableArray([]);
    self.selectedLocation = ko.observable(null);

    //populate locationsAll array with initialLocations
    initialLocations.forEach(function(location) {
        self.locationsAll.push(new Locations(location));
    });

    //add markers to each location
    locationsAll().forEach(function(location) {
        addMarker(location);
    });

    //add click event listeners to markers
    locationsAll().forEach(function(location) {
        google.maps.event.addListener(location.marker, 'click', function() {
            setCurrentLocation(location);
        });
    });

    //sets selectedLocation when click on list item or marker
    self.setCurrentLocation = function(location) {

        // clear previous marker animations
        if(selectedLocation() !== null && selectedLocation() !== location) {
            selectedLocation().marker.setAnimation(null);
        }

        selectedLocation(location);
        selectedLocation().marker.setAnimation(google.maps.Animation.BOUNCE);
        //infoWindow.open(map, marker);
        map.infoWindow.open(map, selectedLocation().marker);

        //selectedLocation().marker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');


        };

};

//ko.applyBindings(ViewModel);

