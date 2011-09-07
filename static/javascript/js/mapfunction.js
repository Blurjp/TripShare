/* Copyright 2010 TripShare */

/* map function */
location_prefix: "YOUR LOCATION:";

show_saved_locations: function() {
      sl = $('saved_locations');
      if(sl) {
        sl.show();
        $('map_fields').down('.text-box').addClassName("focused");
        sl.onMouseOutside($('location-input'), hide_saved_locations);
      }
    };
    
hide_saved_locations: function() {
      if(sl = $('saved_locations')) {
        sl.hide();
            $('location').blur();
        $('map_fields').down('.text-box').removeClassName("focused");
      }
    };
    
get_client_location: function() {
        clear_location_timeout();
        if (this.location_enabled) {
            navigator.geolocation.getCurrentPosition(set_client_location, client_location_error);
            send_message("Locating...", {autohide: false});
            client_locator_timeout = setTimeout(function() {
                client_location_error("<unknown>");
            }, 20000);
        } else {
            send_message("We were unable to get your current location. Please use the form above.");
        }
        if(sl = $('saved_locations')) sl.hide();
    };
    
clear_location: function() {
        set_location_value('Anywhere');
        $('lat_hidden_field').setValue('');
        $('lng_hidden_field').setValue('');
        $('ne_hidden_field').setValue('');
        $('sw_hidden_field').setValue('');
        $('page_hidden_field').setValue('');
        $('location_clear_button').hide();
        submit();
    };
    
 set_client_location: function(position) {
        clear_location_timeout();
        if(position && position.address) { // Recent versions of gecko
            set_location_value(position.address.city);
            construct_anchor_hash();
            submit();
        } else if(position && position.coords) { // All other clients that support navigator.geolocation
            $('lat_hidden_field').setValue(position.coords.latitude);
            $('lng_hidden_field').setValue(position.coords.longitude);
            $('loc_hidden_field').setValue('');
            submit();
        } else {
            client_location_error('<unknown>');
        }
        $('set_location_label').update(location_prefix + " <strong class=\"location-color\">Current Location</strong>");
    };
    
send_message: function(message, options) {
        autohide = true;
        if (options) {
            autohide = options.autoude;
        }
        $('map-message-box').update(message);
        $('map-message-box').appear({duration: 0.2, to: 0.75, afterFinish: function() {
            if (autohide) {
                $('map-message-box').fade({delay: 3});
            }
        }});
    };

hide_message: function() {
        $('map-message-box').fade({delay: 0.3});
    };
    
client_location_error: function(error) {
        clear_location_timeout();
        send_message("We were unable to get your current location. Please use the form above.");
    };
    
thinking: function() {
        $('map-loading-box').appear({duration: 0.2, to: 0.75});
    };
    
stop_thinking: function() {
        $('map-loading-box').fade({duration: 0.3});
    };
    
clear_location_timeout: function() {
        if (client_locator_timeout) clearInterval(client_locator_timeout);
    };
    
submit: function(force) {
        if(force) {
            this.force_submit = true;
        }
    $('map_search').onsubmit();
  };
