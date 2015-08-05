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
                                        '<h4 class="name-header"></h4>' +
                                        '<div class="wiki-container">' +
                                        '<h5 class="wiki-header">Wikipedia</h5>' +
                                        '<div class="wiki-content">wikipedia articles...</div>' +
                                        '</div>' +
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
        wiki: 'Melbourne%20Zoo',
        lat: -37.780870,
        lng: 144.951499
    },
    {
        name: 'Sea Life Melbourne Aquarium',
        address: 'Melbourne VIC',
        wiki: 'Sea%20Life%20Melbourne%20Aquarium',
        lat: -37.820894,
        lng: 144.958240
    },
    {
        name: 'Melbourne Royal Botanic Gardens',
        address: 'South Yarra VIC 3141',
        wiki: 'Royal%20Botanic%20Gardens,%20Melbourne',
        lat: -37.829695,
        lng: 144.982472
    },
    {
        name: 'Melbourne Luna Park',
        address: '14 Lower Esplanade St Kilda VIC 3182',
        wiki: 'Luna%20Park,%20Melbourne',
        lat: -37.867404,
        lng: 144.976872
    },
    {
        name: 'Melbourne Museum',
        address: 'Carlton VIC',
        wiki: 'Melbourne',
        //wiki: 'Melbourne%20Museum',
        lat: -37.803421,
        lng: 144.972905

    }
];

var Locations = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.wiki = ko.observable(data.wiki);
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
        title: data.name()
    });
};

var customInfoWindowHeader = function(data) {
    //info window
    console.log(data);
    //console.log(map.infoWindowContentStr);
    var str = data.name();
    $('.name-header').text(str);
};

var loadWikiAPI = function(data) {
    //wikipedia ajax request
    //var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=query&titles='+data+'&prop=extracts&exintro=&explaintext&format=json';

    //query url
    //var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles='+data+'&rvprop=content&rvsection=0&rvparse&format=json';

    //search url with extracts
    //var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+data+'&prop=extracts&exintro=&explaintext&format=json';

    //search url without extracts
    //var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+data+'&format=json';

    //search url without extracts limit 1
    var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+data+'&limit=1&format=json';


    console.log(wikipediaUrl);
    //console.log(data);

    //error handling
    var wikiRequestTimeout = setTimeout(function(){
        return null;
    }, 8000);

    $.ajax({
        url: wikipediaUrl,
        dataType: "jsonp",
        success: function(response) {
            console.log(response);
            //return response;

            var parsedResponse = {};
            parsedResponse.name = response[1][0];
            parsedResponse.description = response[2][0];
            parsedResponse.url = response[3][0];

            console.log(parsedResponse);
            //return parsedResponse;
            $('.wiki-content').html('<p>' + parsedResponse.description + '<br>' +
                    '<a href="' + parsedResponse.url + '">Read more</a>' +
                    '</p>');
            clearTimeout(wikiRequestTimeout);
        }
    });
};

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

        map.infoWindow.open(map, selectedLocation().marker);
        customInfoWindowHeader(selectedLocation());

        console.log(selectedLocation());

            var a = loadWikiAPI(selectedLocation().wiki());



        /******
        * TODO promise
        *
        *******/


        //console.log(selectedLocation().wiki);
    };

};

//ko.applyBindings(ViewModel);

