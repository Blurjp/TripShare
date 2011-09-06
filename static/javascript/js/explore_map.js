var map = null;
var icon = null;
var shadow = null;
var Geocoder = null;
var bounds = null;
var sp = null;
var default_view = "best";
var event_timer = null;
var marker_coords = [];
var movestartListener = null;
var zoomendListener = null; 
var moveendListener = null;
var client_locator_timeout = null;
var per_page = 20;
var shift = new GSize(0,-80);

GMap2.prototype.setShiftedCenter = function (NW,z,sh) {
    var proj = this.getCurrentMapType().getProjection();
    var px = proj.fromLatLngToPixel(NW,z);
    var sePx = new GPoint(px.x + sh.width, px.y + sh.height);
    var seLatLng = proj.fromPixelToLatLng(sePx,z);
    this.setCenter(seLatLng,z);
}

FSMap = {
    submittable: true,
    location_prefix: "YOUR LOCATION:",
    qeury_prefix: "SEARCH BY:",
    total_pages: null,
    current_page: null,
    location_enabled: false,
    init: function() {
      if (GBrowserIsCompatible()) {
            $('discover-map').setStyle("height:300px"); // Trick the map into loading content into 300px
            this.location_enabled = navigator && navigator.geolocation ? true : false;
            
            Geocoder = new GClientGeocoder();
            bounds = new GLatLngBounds();
            
        map = new GMap2($('map'));
        map.addControl(new GLargeMapControl3D(), new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(30, 65)));
            map.enableContinuousZoom();
            set_default_icons();
            
            sections = FSMap.read_anchor_hash();
            FSMap.get_default_view();
            
            if(sections) {
                if(sections['desc']) FSMap.set_query_value(sections['desc']);
                if(sections['sort']) FSMap.set_sort_value(sections['sort']);
                if(sections['filter']) FSMap.set_filter_value(sections['filter']);
                if(sections['page']) FSMap.set_page_value(sections['page']);
            }
            if(sections && (sections['loc'] || sections['geo'])) {
                if(sections['loc']) FSMap.set_location_value(sections['loc']);
                if(sections['geo'] && !sections['loc']) {
                    geo = sections['geo'].split(":");
                    FSMap.set_bounds(geo[1], geo[0]);
                }
                FSMap.submit();
            } else if(recent_locations.length != 0) {
                FSMap.set_location_value(recent_locations[0]);
                FSMap.submit();
            } else if(Sightings) {
                add_markers();
                update_map();
            } else {
                FSMap.submit();
            }
          add_listeners();
            FSMap.add_locator_to_saved_locations();
            setTimeout(function() {
                $('discover-map').setStyle("height:400px"); // Reset map back to 400px
            }, 1);
      }
    },
    set_default_view: function(value) {
        Cookie.set("default_view", value, 100000);
    },
    get_default_view: function() {
        var dv_cookie = Cookie.get("default_view");
        if(!dv_cookie || dv_cookie == "best" || dv_cookie == "latest") {
            FSMap.set_sort_value(dv_cookie);
        } else if(dv_cookie == "wanted" || dv_cookie == "following" || dv_cookie == "guides") {
            FSMap.set_filter_value(dv_cookie);
        }
    },
  submit: function(force) {
        if(force) {
            this.force_submit = true;
        }
    $('map_search').onsubmit();
  },
    check_submittable: function() {
        // false if genius search has selected elements
        if (this.force_submit) {
            this.force_submit = false;
            return true;
        } else {
            genius_selected = $('genius_results').visible() && $$('#genius_results .selected').any();
            if(genius_selected) {
                return false;
            } else {
                return true;
            }
        }
    },
    ajaxify_pagination: function() {
        $$('.pagination a').each(function(el) {
            el.onclick = function() {
                query_params = el.href.toQueryParams();
                qp = query_params.page;
                FSMap.set_page_value(qp);
                FSMap.construct_anchor_hash();
                FSMap.submit();
                new Effect.ScrollTo('wrapper', {duration: 0});
                return false;
            }.bind(el);
        });
    },
    construct_anchor_hash: function() {
        var h = "/"
        // Location
        if($F('loc_hidden_field')) {
            h += ("loc/" + $F('loc_hidden_field') + "/");
            document.title = "Foodspotting | " + $F('loc_hidden_field')
        }
        // Location
        if($F('sw_hidden_field') && $F('ne_hidden_field')) {
            h += ("geo/" + $F('ne_hidden_field') + ":" + $F('sw_hidden_field') + "/");
            document.title = "Foodspotting"
        }
        // Query
        if($F('query_hidden_field')) {
            h += ("desc/" + $F('query_hidden_field') + "/");
        }
        // Sort
        if($F('sort_hidden_field')) {
            h += ("sort/" + $F('sort_hidden_field') + "/");
        }
        // Page
        if($F('page_hidden_field')) {
            h += ("page/" + $F('page_hidden_field') + "/");
        }
        
        window.location.hash = h;
    },
    read_anchor_hash: function() {
        h = unescape(window.location.hash)
        var c = h.split('/');
        var sections = {};
        var any = false;
        c.each(function(v, i) {
            if(v != "#" && v != "") {
                if((i-1)%2 == 0) {
                    str = c[i+1];
                    sections[v] = str.gsub("+", " ");
                    any = true;
                }
            }
        });
        return any ? sections : null;
    },
    set_location_labels: function(label) {
        $('loc_hidden_field').setValue(label);
        FSMap.construct_anchor_hash();
        $('set_location_label').update(FSMap.location_prefix + " <strong>" + label + "</strong>");
    },
  link_with_params: function(url) {
    params = $('map_search').serialize();
    FS.safe_redirect(url+"?"+params);
  },
    prepare_search: function() {
      $("track_search").setValue('');
      $("track_location").setValue('');
        FSMap.hide_message();
        FSMap.thinking();
        FSMap.update_fields();
        FSMap.construct_anchor_hash();
    },
    update_sorts_bar: function() {
        $$('#map-sorts a').invoke('removeClassName', 'on');
        var sort = $F('filter_hidden_field');
        sort = sort == "" ? $F('sort_hidden_field') : sort;
        sort = sort == "" ? "best" : sort;
        $('map-sort-'+sort).addClassName('on');
    },
    update_sort: function(sort) {
        FSMap.set_page_value("");
        FSMap.set_filter_value("");
        FSMap.set_sort_value(sort);
        $$('#map-sorts a').invoke('removeClassName', 'on');
        $('map-sort-'+sort).addClassName('on');
        FSMap.set_default_view(sort);
        this.submit();
    },
    update_filter: function(filter) {
        FSMap.set_sort_value("");
        FSMap.set_page_value("");
        $$('#map-sorts a').invoke('removeClassName', 'on');
        $('map-sort-'+filter).addClassName('on');
        FSMap.set_filter_value(filter);
        FSMap.set_default_view(filter);
        this.submit();
    },
    update_fields: function() {
        if($F('location') != '') {
            if($F('location') != $F('loc_hidden_field')) FSMap.clear_bounds();
            FSMap.set_location_value($F('location'));
      $("track_location").setValue("{\"Location\": \"" + $F("location") + "\"}");
        }
        if($F('query') != '') {
            FSMap.set_query_value($F('query'));
            $("track_search").setValue("{\"Term\": \"" + $F("query") + "\", \"Type\": \"Item\"}");
        }
        
        $('query').blur();
        $('query').clear();
        
        $('location').blur();
        $('location').clear();

      if(sl = $('saved_locations')) { sl.hide(); }
    
        $('map_fields').down('.text-box').removeClassName("focused");
    
        if(genius_search_object = $("genius-search").searcher) {            
            genius_search_object.blur();
        }
        if(this.current_page == parseInt($F('page_hidden_field'))) {
            FSMap.set_page_value("1");
        }
        
    },
    complete_search: function(redirect_url, search_type, query) {
        //$("track_search").setValue("{'Term': '" + query + "', 'Type': '" + search_type + "'}");
        FS.safe_redirect(redirect_url);
    },
    insert_timestamp: function() {
        var d = new Date();
        $('ajax_datetime').setValue(d.getTime());
    },
    select_item: function(item_name) {
        FSMap.set_query_value(item_name);
        FSMap.submit();
        new Effect.ScrollTo('wrapper');
    },
    set_location_value: function(value) {
        switch(value) {
            case "Map Area":
                form_value = "";
                form_label = "<strong class=\"location-color\">Map Area</strong>";
                break;
            case "Anywhere":
                form_value = "Anywhere";
                form_label = "<strong class=\"location-color\">Anywhere</strong>";
                break;
            case "":
                form_value = "";
                form_label = "<strong>neighborhoods, cities, countries</strong>";           
                break;
            default:
                form_value = value;
                form_label = "<strong>" + value + "</strong>";
        }
        $('set_location_label').show();
        $('loc_hidden_field').setValue(form_value);
        $('set_location_label').update(FSMap.location_prefix + " " + form_label);
        $('location_clear_button').show();
    },
    set_query_value: function(value) {
        $('genius-label').show();
        $('query_hidden_field').setValue(value);
        value = value == "" ? "food, place or person" : value;
        $('genius-label').update(FSMap.qeury_prefix + " <strong>" + value + "</strong>");
        $('query_clear_button').show();
    },
    set_sort_value: function(value) {
        $('sort_hidden_field').setValue(value);
    },
    set_filter_value: function(value) {
        $('filter_hidden_field').setValue(value);
    },
    set_page_value: function(value) {
        $('page_hidden_field').setValue(value);
    },
    set_bounds: function(sw, ne) {
        FSMap.set_location_value("Map Area");
        $('sw_hidden_field').setValue(sw);
        $('ne_hidden_field').setValue(ne);
    },
    clear_bounds: function() {
        $('sw_hidden_field').setValue("");
        $('ne_hidden_field').setValue("");
    },
    select_location: function(value) {
        FSMap.set_page_value('');
        $('sw_hidden_field').setValue("");
        $('ne_hidden_field').setValue("");
      $('location').setValue(value);
        FSMap.submit();
    },
    show_saved_locations: function() {
      sl = $('saved_locations');
      if(sl) {
        sl.show();
        $('map_fields').down('.text-box').addClassName("focused");
        sl.onMouseOutside($('location-input'), FSMap.hide_saved_locations);
      }
    },
    hide_saved_locations: function() {
      if(sl = $('saved_locations')) {
        sl.hide();
            $('location').blur();
        $('map_fields').down('.text-box').removeClassName("focused");
      }
    },
    get_client_location: function() {
        FSMap.clear_location_timeout();
        if (this.location_enabled) {
            navigator.geolocation.getCurrentPosition(FSMap.set_client_location, FSMap.client_location_error);
            FSMap.send_message("Locating...", {autohide: false});
            client_locator_timeout = setTimeout(function() {
                FSMap.client_location_error("<unknown>");
            }, 20000);
        } else {
            FSMap.send_message("We were unable to get your current location. Please use the form above.");
        }
        if(sl = $('saved_locations')) sl.hide();
    },
    clear_location: function() {
        this.set_location_value('Anywhere');
        $('lat_hidden_field').setValue('');
        $('lng_hidden_field').setValue('');
        $('ne_hidden_field').setValue('');
        $('sw_hidden_field').setValue('');
        $('page_hidden_field').setValue('');
        $('location_clear_button').hide();
        FSMap.submit();
    },
    clear_query: function() {
        this.set_query_value('');
        $('query_clear_button').hide();
        FSMap.submit(true);
    },
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
    },
    hide_message: function() {
        $('map-message-box').fade({delay: 0.3});
    },
    
    update_pagination: function() {
        if(this.current_page < this.total_pages && this.total_pages > 1) {
            $('page-right').addClassName('enabled');
            $('page-right').onclick = function() {
                FSMap.page(1);
                return false;
            }
        } else {
            $('page-right').removeClassName('enabled');
            $('page-right').onclick = function() {
                FSMap.page(0);
                return false;
            }
        }
        if(this.current_page > 1) {
            $('page-left').addClassName('enabled');
            $('page-left').onclick = function() {
                FSMap.page(-1);
                return false;
            }
        } else {
            $('page-left').removeClassName('enabled');
            $('page-left').onclick = function() {
                FSMap.page(0);
                return false;
            }
        }
    },
    
    add_locator_to_saved_locations: function() {
        if(this.location_enabled) {
            $('saved_location_ul').insert({top:"<li class=\"current-location\"><a href=\"\" onclick=\"FSMap.get_client_location();return false;\"><img src=\"/images/clear.png\" alt=\"\" border=\"0\" />Current Location</a></li>"})
        }
    },
    
    // Controls
    
    page: function(dir) {
        if(dir != 0) {
            this.current_page = parseInt($F('page_hidden_field'));
            this.current_page = isNaN(this.current_page) ? 1 : this.current_page;
            FSMap.set_page_value(this.current_page+dir);
            FSMap.submit();
        }
    },
    
    // Private Methods
    set_client_location: function(position) {
        FSMap.clear_location_timeout();
        if(position && position.address) { // Recent versions of gecko
            FSMap.set_location_value(position.address.city);
            FSMap.construct_anchor_hash();
            FSMap.submit();
        } else if(position && position.coords) { // All other clients that support navigator.geolocation
            $('lat_hidden_field').setValue(position.coords.latitude);
            $('lng_hidden_field').setValue(position.coords.longitude);
            $('loc_hidden_field').setValue('');
            FSMap.submit();
        } else {
            FSMap.client_location_error('<unknown>');
        }
        $('set_location_label').update(FSMap.location_prefix + " <strong class=\"location-color\">Current Location</strong>");
    },
    client_location_error: function(error) {
        FSMap.clear_location_timeout();
        FSMap.send_message("We were unable to get your current location. Please use the form above.");
    },
    thinking: function() {
        $('map-loading-box').appear({duration: 0.2, to: 0.75});
    },
    stop_thinking: function() {
        $('map-loading-box').fade({duration: 0.3});
    },
    clear_location_timeout: function() {
        if (client_locator_timeout) clearInterval(client_locator_timeout);
    }
}

marker_on = function(id, num) {
  img = "/images/spot-marker-" + num + "-on.png";
  $(id).setAttribute('src', img);
  $(id).setStyle({zIndex: $(id).getNextHighestDepth('map')});
}

marker_out = function(id, num) {
  img = "/images/spot-marker-" + num + ".png";
  $(id).setAttribute('src', img);
}

add_listeners = function() {
  movestartListener = GEvent.addListener(map, "movestart", map_move_start);
  moveendListener = GEvent.addListener(map, "moveend", activate_redo_saerch);
  mapPressListener = GEvent.addListener(map, "click", map_pressed);
}

map_pressed = function() {
    FSMap.hide_saved_locations();
    FS.hide_tooltip();
}

clear_listeners = function() {
    GEvent.removeListener(movestartListener);
    GEvent.removeListener(moveendListener);
    GEvent.removeListener(mapPressListener);
}

map_move_start = function() {
    clear_timeout();
    FS.hide_tooltip();
}

clear_timeout = function() {
  clearTimeout(event_timer);
    FSMap.insert_timestamp();
    FSMap.stop_thinking();
}

activate_redo_saerch = function() {
  clearTimeout(event_timer);
    FSMap.insert_timestamp();
    FSMap.stop_thinking();
    event_timer = setTimeout(redo_search_in_area, 700);
}

validate_location_search = function() {
    return true;
}

redo_search_in_area = function() {
    FSMap.thinking();
  var b =  map.getBounds();
    var sw = b.getSouthWest()
    var ne = b.getNorthEast()
    FSMap.set_page_value('');
    FSMap.set_bounds(sw.lat() + ", " + sw.lng(), ne.lat() + ", " + ne.lng());
    FSMap.submit();
}

add_markers = function() {
    marker_coords = [];
    bounds = new GLatLngBounds();
    Sightings.each(function(sighting, index) {

        // Stack multiple sightings at the same location
        var marker_coord = sighting.lat+","+sighting.lng;
        var dups = $A(marker_coords).findAll(function(i) {
            return i == marker_coord;
            });
            
        if(dups.length > 0) {
            $$('.stacked'+lat_id(sighting.lat)).invoke("hide");
            $$('.shadow_stacked'+lat_id(sighting.lat)).invoke("hide");
            marker_icon = multi_icon;
            marker_shadow = multi_icon_shadow;
        } else {
            marker_icon = icon;
            marker_shadow = icon_shadow;
        }

        // Markers
    marker_icon.image = sighting.photo;
        var latlng = new GLatLng(sighting.lat, sighting.lng);
    var marker = new GMarker(
            latlng, {
              icon: marker_icon, 
              id: sighting.id
            }
        );
        
        var shadow_marker = new GMarker(latlng, {icon: marker_shadow, id: "shadow_"+sighting.id})
        
    map.addOverlay(shadow_marker);
    map.addOverlay(marker);
        bounds.extend(shadow_marker.getPoint());
        
        var marker_el = $("mtgt_"+sighting.id);
        var shadow_marker_el = $("mtgt_shadow_"+sighting.id);
        marker_el.sighting = sighting;
        marker_el.shadow = shadow_marker_el;
        
        // Style & Identifier
        class_name = dups.length > 0 ? 'marker-style-multi' : 'marker-style'
        marker_el.addClassName(class_name);
        marker_el.addClassName('stacked'+lat_id(sighting.lat));
        shadow_marker_el.addClassName('shadow_stacked'+lat_id(sighting.lat));
        
      Event.observe("mtgt_"+sighting.id, "click", function() {
            collection = $$("." + $A(this.className.split(' ')).last());
            top_item = collection.last();
            collection_length = collection.length;
            current_index = collection.indexOf(this);
            element = this;
            if(collection_length > 1 && top_item.activated) {
                next_index = current_index == 0 ? collection_length-1 : current_index-1;
                this.hide();
                next_el = collection[next_index];
                element = next_el.show();
            }
            top_item.activated = true;
            top_item.shadow.setStyle({zIndex: this.getNextHighestDepth('map')});
            element.setStyle({zIndex: element.getNextHighestDepth('map')});
            async(function() { FS.tooltip(element, map_tooltip(element.sighting), {width: "300px", hover: 0}) });
            $('tooltip').onMouseOutside($('tooltip'), FS.hide_tooltip);
      });
        marker_coords.push(marker_coord);
    });
}

lat_id = function(lat) {
    l = new String(lat);
    l = l.replace('.', '');
    return l;
}

map_tooltip = function(sighting) {
    var content = "<img src='" + sighting.photo + "' style='margin: -3px 0 -3px -5px; float: left;padding-right:10px' />";
  content += "<div class='title'>" + sighting.title + "</div>";
    content += "<addr>" + sighting.address + "</addr>";
    content += "<a a href='javascript:void()' onclick='move_to_sighting("+sighting.id+")'>More details...</a>";
    content = "<div class='clearfix'>" + content + "</div>";
  return content;
}

move_to_sighting = function(id) {
    new Effect.ScrollTo("sighting_"+id, {offset: -5, afterFinish: function() {
        FS.show_back_to_map();
    }});
}

update_map = function() {
    if(Bounds) {
    var sw = Bounds['sw_point'];
    var ne = Bounds['ne_point'];
    var b = new GLatLngBounds(new GLatLng(sw[0],sw[1]), new GLatLng(ne[0],ne[1]));
    map.setCenter(b.getCenter(), map.getBoundsZoomLevel(b, new GSize(960,400)));
    } else {
    map.setCenter(new GLatLng(0, 0), 0);
        center_and_zoom();
    }
    $('discover-map').setStyle("height:400px");
}

center_and_zoom = function() {
    zoom = map.getBoundsZoomLevel(bounds), new GSize(960,400)
  map.setZoom(zoom);
  //map.setCenter(bounds.getCenter());
    map.setShiftedCenter(bounds.getCenter(), zoom, shift);
}

reset_map = function() {
    $('discover-map').setStyle("height:300px");
    
    if (Sightings) {
        map.clearOverlays();
        clear_listeners();
        add_markers();
        update_map();
    }
    FSMap.update_pagination();
    FSMap.update_sorts_bar();
    add_listeners();
    FSMap.stop_thinking();
    FSMap.add_locator_to_saved_locations();
}

set_default_icons = function() {
  icon = new GIcon();
  icon.iconSize = new GSize(40, 40);
  icon.iconAnchor = new GPoint(23, 55);

  icon_shadow = new GIcon();
  icon_shadow.iconSize = new GSize(46, 55);
  icon_shadow.image = "/images/map-shadow.png";
  icon_shadow.iconAnchor = new GPoint(23, 55);

  multi_icon = new GIcon();
  multi_icon.iconSize = new GSize(40, 40);
  multi_icon.iconAnchor = new GPoint(27, 58);

  multi_icon_shadow = new GIcon();
  multi_icon_shadow.iconSize = new GSize(54, 58);
  multi_icon_shadow.image = "/images/map-shadow-multi.png";
  multi_icon_shadow.iconAnchor = new GPoint(27, 58);
}

document.observe("dom:loaded", function() { FSMap.init(); });