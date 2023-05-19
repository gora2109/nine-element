(function ($) {
/*init Google Maps*/
    initMaps();
    function initMaps(){
        let geocoder = new google.maps.Geocoder(),
            // image = new google.maps.MarkerImage('/images/content/marker.png'),
            maping = $('.map');

        if (maping.length){
            for (let i = 0; i<maping.length; i++){
                let newMap,
                    markers = [],
                    mapID = maping[i].id;
                newMap = new google.maps.event.addDomListener(window, 'load', initialize(mapID));
            }
            function initialize(id) {
                let mapStyles = [
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#e9e9e9"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f5f5f5"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 17
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 29
                                },
                                {
                                    "weight": 0.2
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 18
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f5f5f5"
                                },
                                {
                                    "lightness": 21
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#dedede"
                                },
                                {
                                    "lightness": 21
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ffffff"
                                },
                                {
                                    "lightness": 16
                                }
                            ]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "saturation": 36
                                },
                                {
                                    "color": "#333333"
                                },
                                {
                                    "lightness": 40
                                }
                            ]
                        },
                        {
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "color": "#f2f2f2"
                                },
                                {
                                    "lightness": 19
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#fefefe"
                                },
                                {
                                    "lightness": 20
                                }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#fefefe"
                                },
                                {
                                    "lightness": 17
                                },
                                {
                                    "weight": 1.2
                                }
                            ]
                        }
                    ],
                    mapOptions = {
                        panControl: false,
                        zoomControl: false,
                        disableDefaultUI: true,
                        scaleControl: false,
                        zoom: 14,
                        styles: mapStyles
                    },
                    map = new google.maps.Map(document.getElementById(id), mapOptions);
                geocoder.geocode({
                    'address': $(`#${id}-address`).text()

                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            // icon: image,
                        });
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

        }
    }
/*init Google Maps*/
    initBtnMenu();
    function initBtnMenu() {
        $('.mob-menu .menu-bar').click(function (e) {
            e.preventDefault();
            $(this).toggleClass('active');
            $(this).closest('.header').toggleClass('show-menu');
            $(this).closest('body').toggleClass('show-mob')
        })
    }

    var onceFeedbackCounter = 0;

    /*function commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1");
        }
        return val;
    }*/

    function feedbackCounter() {
        let items = $('.about-count__item');
        if (items.length){
            console.log(items);
            var scroll = parseInt($(window).scrollTop()) + parseInt($(window).height());
            var offset = parseInt($('.about-count__list').offset().top) + parseInt($('.about-count__list').height());
            for(let i = 0; i < items.length; i++){
                if (scroll > offset && $(window).scrollTop() <= offset && onceFeedbackCounter == 0) {
                    if (items.eq(i).find('.count')){
                        $({someValue: 0}).animate({someValue: items.eq(i).find('.count').data('count')}, {
                            duration: 1500,
                            easing: 'swing',
                            step: function () {
                                // items.eq(i).find('.count').text(commaSeparateNumber(Math.round(this.someValue)));
                                items.eq(i).find('.count').text(Math.round(this.someValue));
                            }
                        });
                    }


                }
            }

            onceFeedbackCounter = 1;

            if ($(window).scrollTop() >= offset && onceFeedbackCounter != 0) {
                onceFeedbackCounter = 0;
            } else if (scroll < offset && onceFeedbackCounter != 0) {
                onceFeedbackCounter = 0;
            }
        }
    }

    function reviewRating(){
        let list = $('.rating-stars__list');
        if(list.length){
            let items = list.find('.rating-stars__item')
            for (let i = 0; i < items.length; i++){
                items.eq(i).find('input').on('click', function (e) {
                    console.log(this);
                    $(this).closest('.rating-stars__item').addClass('checked').siblings('.rating-stars__item').removeClass('checked')
                })
            }
        }
    }

    function clearReviewRating(){
        $('#cartModal').appendTo('footer')
        /*if ($('.checkout-heading-button')){

        }*/
    }

    function closePopupCheckout(){
        $('.close-popup').on('click', function (e) {
            e.preventDefault();
            $('#cartModal').modal('hide')
        })

    }

    $(document).ready(function(){
        // initInputChecked();
        feedbackCounter();
        reviewRating();
        clearReviewRating();
        closePopupCheckout();
    });
    $(window).scroll(function () {
        // Scrollable Nav Bar
        feedbackCounter();
    });
})(jQuery);