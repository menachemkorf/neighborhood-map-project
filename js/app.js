//global variables for access in various functions
var map, infoWindow;

//load google maps script after window loads
var loadMapAPI = function() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?callback=initializeMap';
    script.onerror = function(event){
        document.write("Sorry, we can't load google maps, please try again later.");
    };
    document.body.appendChild(script);
};

//Initialize Map after google maps script loads
function initializeMap () {

    //lat lng
    var myLatlng = new google.maps.LatLng(-37.824137, 144.966985);

    //options object sent alonh with request for map
    var mapOptions = {
        center: myLatlng,
        zoom: 12
    };

    //creating the map object
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    initializeInfoWindow();

    ko.applyBindings(new ViewModel());
}

function initializeInfoWindow() {
    var infoWindowContentStr = '<div class="info-window">' +
                                    '<h4 class="name-header"></h4>' +
                                    '<div class="wiki-container">' +
                                    '<h5 class="wiki-header">Wikipedia</h5>' +
                                    '<div class="wiki-content"></div>' +
                                    '</div>' +
                                '</div>';

    infoWindow = new google.maps.InfoWindow({
        content: infoWindowContentStr,
        maxWidth: 200
    });
}

$(window).load(loadMapAPI);

//Model
//array with locations
var model = {
    initialLocations : [
        {
            title: 'Melbourne Zoo',
            wikiSearch: 'Melbourne%20Zoo',
            lat: -37.780870,
            lng: 144.951499
        },
        {
            title: 'Sea Life Melbourne Aquarium',
            wikiSearch: 'Sea%20Life%20Melbourne%20Aquarium',
            lat: -37.820894,
            lng: 144.958240
        },
        {
            title: 'Melbourne Royal Botanic Gardens',
            wikiSearch: 'Royal%20Botanic%20Gardens,%20Melbourne',
            lat: -37.829695,
            lng: 144.982472
        },
        {
            title: 'Melbourne Luna Park',
            wikiSearch: 'Luna%20Park,%20Melbourne',
            lat: -37.867404,
            lng: 144.976872
        },
        {
            title: 'Melbourne Museum',
            wikiSearch: 'Melbourne%20Museum',
            lat: -37.803421,
            lng: 144.972905

        }
    ],
    wikiAPI: {
        isLoaded: ko.observable(""),
        urlTemp: ko.observable("http://en.wikipedia.org/w/api.php?action=opensearch&search=" + "data" + "&limit=1&format=json"),
        title: ko.observable(""),
        description: ko.observable(""),
        link: ko.observable(""),
        parseResponse: function(response) {
            model.wikiAPI.title(response[1][0]);
            model.wikiAPI.description(response[2][0]);
            model.wikiAPI.link(response[3][0]);
        }
    }
};

var Locations = function(data) {
    this.title = ko.observable(data.title);
    this.address = ko.observable(data.address);
    this.wikiSearch = ko.observable(data.wikiSearch);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

var addMarker = function(data) {
    data.marker = new google.maps.Marker({
        position: {
            lat: data.lat(),
            lng: data.lng()
        },
        map: map,
        title: data.title()
    });
};

var loadWikiAPI = function(data) {

    var u = model.wikiAPI.urlTemp().replace('data', data);

    //error handling
    var wikiRequestTimeout = setTimeout(function(){
        model.wikiAPI.isLoaded("error");
    }, 8000);

    //clear previous request
    model.wikiAPI.isLoaded("");

    $.ajax({
        url: u,
        dataType: "jsonp",
        success: function(response) {
            if (response[1][0]) {
                model.wikiAPI.isLoaded("success");
                model.wikiAPI.parseResponse(response);
            } else {
                model.wikiAPI.isLoaded("error");
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
};

var ViewModel = function() {
    var self = this;

    //holds all locations in onservable array

    //all locations in app
    self.locationsAll = ko.observableArray();

    //clicked location
    self.selectedLocation = ko.observable(null);

    //search query
    self.searchQuery = ko.observable("");

    //failed search
    self.errerMessage = ko.observable("no data.");

    //locations to display, initially all, after search only what matches
    self.displayLocations = ko.observableArray();


    //populate locationsAll array with initialLocations
    model.initialLocations.forEach(function(location) {
        self.locationsAll.push(new Locations(location));
    });

    //display all locations
    self.locationsAll().forEach(function(location) {
        self.displayLocations.push(location);
    });

    //add markers to each location
    self.displayLocations().forEach(function(location) {
        addMarker(location);
    });

    //add click event listeners to markers
    self.locationsAll().forEach(function(location) {
        google.maps.event.addListener(location.marker, 'click', function() {
            self.setCurrentLocation(location);
        });
    });

    //when search form submitted, filters through all locations with search query
    self.filter = function() {
        var filteredLocations = [];
        //loop through all locations
        self.locationsAll().forEach(function(location) {
            //check which match query
            if(location.title().toLowerCase().indexOf(self.searchQuery().toLowerCase()) > -1) {
                //store matched in array
                filteredLocations.push(location);
            }
        });
        //hide all markers
        self.displayLocations().forEach(function(location){
            location.marker.setMap(null);
        });
        //display filteredLocations
        if (filteredLocations.length > 0) {
            self.displayLocations(filteredLocations);
            //show marker for specified locations
            self.displayLocations().forEach(function(location){
                location.marker.setMap(map);
            });
        } else {
            self.displayLocations([]);
            self.errerMessage("Nothing matches your search.");
        }
    };

    //when click on location in list
    self.liClick = function(location) {
        //if mobile mode move list offcanvas
        self.offCanvas();
        self.setCurrentLocation(location);
    };

    //sets selectedLocation when click on list item or marker
    self.setCurrentLocation = function(location) {
        self.previousLocation = self.selectedLocation();
        self.selectedLocation(location);
    };

    //handle current location when changed
    self.handleCurrentLocation = ko.computed(function() {
        //check if selectedLocation was set
        if(self.selectedLocation() !== null) {
            //check if selectedLocation was changed
            if (self.selectedLocation() !== self.previousLocation) {
                if (self.previousLocation !== null) {
                    //stop animation from previous marker
                    self.previousLocation.marker.setAnimation(null);
                }
                //animate marker on selectedLocation
                self.selectedLocation().marker.setAnimation(google.maps.Animation.BOUNCE);
                //open infowindow with default html
                infoWindow.open(map, self.selectedLocation().marker);
                //place ajax request to wikipedia api for selected location info
                loadWikiAPI(self.selectedLocation().wikiSearch());
            }
        }
    });

    //add content to infowindow from wikipedia api
    self.updateInfoWindow = ko.computed(function(){
        //append title to infowindow header
        if(self.selectedLocation() !== null) {
            var str = self.selectedLocation().title();
            $('.name-header').text(str);
        }
        //if api not yet loaded, append loading message to infoindow
        if (!model.wikiAPI.isLoaded()) {
            $('.wiki-content').html('<p>' + 'loading...' + '</p>');
        //if api loaded successfully, append parsed response to infowindow
        } else if (model.wikiAPI.isLoaded() === 'success') {
            $('.wiki-content').html('<p>' + model.wikiAPI.description() + '<br>' +
                '<a href="' + model.wikiAPI.link() + '">Read more</a>' +
                '</p>');
        //if error loding, append error message to infowindow
        } else if (model.wikiAPI.isLoaded() === 'error') {
            $('.wiki-content').html('<p>' + 'There was an error loading wikipedia.' + '</p>');
        }
    });

    self.offCanvas = function() {
        $('.right-panel').toggleClass('active');
        $('.menu-button').toggleClass('menu-button-open');
    };
};