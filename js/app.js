//global declaration of variables
        var markers = [];
        var window;
        var map;

        //initialization of marker info window and latlong bounds
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 27.1750,
                    lng: 78.0422
                },
                zoom: 8
            });
            var multipleInfoWindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();
            model.myMap = ko.computed(function() {
                showMap(null);
                markers = [];
                model.wonderList.removeAll()
                ko.utils.arrayForEach(model.filteredWonders(), function(wonder) {
                    this.position = wonder.location;
                    this.title = wonder.title;
                    this.street = '';
                    this.city = '';
                    this.country = '';
                    //marker creation
                    this.marker = new google.maps.Marker({
                        position: this.position,
                        title: this.title,
                        street: this.treet,
                        city: this.city,
                        animation: google.maps.Animation.DROP,
                    });
                    markers.push(this.marker);
                    window = multipleInfoWindow;
                    this.marker.addListener('click', function() {
                        toggleBounce(this);
                        map.panTo(this.getPosition());
                        createInfoWindow(this, multipleInfoWindow);
                        //createInfoWindow(this, multipleInfoWindow);

                    });
                    //elements on click to make markers visible and hide
                    document.getElementById('markersVisible').addEventListener('click', showMarkers);
                    document.getElementById('markersHide').addEventListener('click', hideMarkers);

                    model.wonderList.push({
                        marked: marker
                    });
                    displayListed();
                });
            }, model);
        }
        
        //to create a info window and display the content 
        function createInfoWindow(marker, infowindow) {
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                var lat = marker.position.lat;
                var lng = marker.position.lng;
                //console.log(lat())
                var city, street, country;
                var clientID = 'QTTZJK5ZAWJ0VY5J44FT3KTD2ZW525XQ1FJVASNGLQJXXNZS';
                var clientSecret = '5CFT3OSZLPRJEFKH1324RHP4BTWBZNRMLFU3YEIX1ZOXVOH5';

                var URL = 'https://api.foursquare.com/v2/venues/search?ll=' + lat() + ',' + lng() + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180605' + '&query=' + this.title;

                $.getJSON(URL).done(function(locationsData) {
                    var results = locationsData.response.venues[0];
                    street = results.location.formattedAddress[0] ? results.location.formattedAddress[0] : 'N/A';
                    city = results.location.formattedAddress[1] ? results.location.formattedAddress[1] : 'N/A';
                    country = results.location.country ? results.location.country : 'N/A';
                    //console.log(street);
                    console.log(city);

                }).fail(function() {
                    //alert if something went wrong with foursquare
                    alert('Something went wrong with foursquare');
                }).then(function() {
                    infowindow.setContent('');
                    console.log(city);
                    infowindow.addListener('closeclick', function() {
                        marker.setAnimation(null);
                    });
                    var windowContent = '<h3 class="name">' + marker.title + '</h3>' +
                        '<p>' + street + "<br>" + city + '<br>' + country + "</p>";
                    infowindow.setContent(windowContent);
                    // Open the infowindow on the correct marker.
                    infowindow.open(map, marker);

                });



            }
        }
        
        //displays the listed elements in observable array
        function displayListed() {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        }

        //function to display markers
        function showMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // show item info when selected from list
        this.showLocation = function(location) {
            google.maps.event.trigger(self.marker, 'click');
            console.log(self.marker)
        };

        //toggle bounce function to make an element bounce on click
        function toggleBounce(marker) {
            if (marker.getAnimation() != null) {
                marker.setAnimation(null);
            } else {
                //setallAnimationNull();
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1000);
            }

        }

        //function to hide markers
        function hideMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }

        }

        function showMap(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        //view model function to work with knockout js
        function ViewModel() {
            this.items = ko.observableArray([{
                title: 'Petra',
                location: {
                    lat: 30.3285,
                    lng: 35.4444
                }
            }, {
                title: 'Great Wall of China',
                location: {
                    lat: 40.4319,
                    lng: 116.5704
                }
            }, {
                title: 'Christ The Redeemer Statue',
                location: {
                    lat: -22.9519,
                    lng: -43.2105
                }
            }, {
                title: 'Manchu Picchu',
                location: {
                    lat: -13.165712293434677,
                    lng: -72.54310524967316
                }
            }, {
                title: 'Chichen Itza',
                location: {
                    lat: 20.6829,
                    lng: -88.5686
                }
            }, {
                title: 'Colosseum',
                location: {
                    lat: 41.8902,
                    lng: 12.4922
                }
            }, {
                title: 'Taj Mahal',
                location: {
                    lat: 27.1740969,
                    lng: 78.0421778
                }
            }]);
            this.wonderList = ko.observableArray([]);
            this.title = ko.observable('');
            this.filteredWonders = ko.computed(function() {
                var filter = this.title().toLowerCase();
                return ko.utils.arrayFilter(this.items(), function(item) {
                    return stringStartsWith(item.title.toLowerCase(), filter);
                });
            }, this);
        }
        
        //matching starting letter of input with the elements in observable array
        var stringStartsWith = function(string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        };

        var model = new ViewModel();
        ko.applyBindings(model);