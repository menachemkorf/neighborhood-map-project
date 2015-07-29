/*var locations = [
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
];*/

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

/*var Locations = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
}*/


function initializeMap() {

    //lat lng
    var myLatlng = new google.maps.LatLng(-37.868775, 145.017224)

    //options object sent alonh with request for map
    var mapOptions = {
        center: myLatlng,
        zoom: 12
    };

    //creating the map object
    //two param: DOM element, options object
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    //add marker
    /*var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Home'
    });*/

    //add multiple markers
    var selectedLocation = null;
    for (var i = 0; i < initialLocations.length; i++) {
        var marker = new google.maps.Marker({
            position: {
                lat: initialLocations[i].lat,
                lng: initialLocations[i].lng
            },
            map: map,
            title: initialLocations[i].name
        });
        google.maps.event.addListener(marker, 'click', function() {
            selectedLocation = this;
            console.log(selectedLocation);
        });
    }


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
google.maps.event.addDomListener(window, 'load', initializeMap);

var ViewModel = function() {
    var self = this;

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
};

ko.applyBindings(new ViewModel());