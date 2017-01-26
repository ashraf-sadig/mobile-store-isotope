jQuery(document).ready( function($) {

    // init Isotope
    //var $container = $('.products-list').isotope({
      //itemSelector: '.product',
      //layoutMode: 'masonry',
    //});

    var $container = $('.products-list');

    // layout Isotope again after all images have loaded
    //$container.imagesLoaded( function() {
    //$container.isotope('layout');
    //});

    var filters = {};
  // do stuff when checkbox change
  $('#form-ui').on( 'change', function( jQEvent ) {
    // Current hash value
    //var hashFilter = getHashFilter();

    // Set filters to current values (important for first run)
    //filters["manufacturer"] = hashFilter["manufacturer"];
    //filters["storage"] = hashFilter["storage"];
    //filters["os"] = hashFilter["os"];
    //filters["camera"] = hashFilter["camera"];

    // Create new hash
    //var newHash = "manufacturer=" + encodeURIComponent( filters["manufacturer"] ) + "&storage=" + encodeURIComponent( filters["storage"] );
    //newHash += "&os=" + encodeURIComponent( filters["os"] ) + "&camera=" + encodeURIComponent( filters["camera"] );
    //location.hash = newHash;

    var $checkbox = $( jQEvent.target );
    manageCheckbox( $checkbox );

    var comboFilter = getComboFilter( filters );
    $container.isotope({ filter: comboFilter });

    location.hash = 'filter=' + encodeURIComponent( comboFilter );

  });

  function getComboFilter( filters ) {
  var i = 0;
  var comboFilters = [];
  var message = [];

  for ( var prop in filters ) {
    message.push( filters[ prop ].join(' ') );
    var filterGroup = filters[ prop ];
    // skip to next filter group if it doesn't have any values
    if ( !filterGroup.length ) {
      continue;
    }
    if ( i === 0 ) {
      // copy to new array
      comboFilters = filterGroup.slice(0);
    } else {
      var filterSelectors = [];
      // copy to fresh array
      var groupCombo = comboFilters.slice(0); // [ A, B ]
      // merge filter Groups
      for (var k=0, len3 = filterGroup.length; k < len3; k++) {
        for (var j=0, len2 = groupCombo.length; j < len2; j++) {
          filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
        }

      }
      // apply filter selectors to combo filters for next group
      comboFilters = filterSelectors;
    }
    i++;
  }

  var comboFilter = comboFilters.join(', ');
  return comboFilter;
}

function manageCheckbox( $checkbox ) {
  var checkbox = $checkbox[0];

  var group = $checkbox.parents('.filter-criteria').attr('data-filter-group');
  // create array for filter group, if not there yet
  var filterGroup = filters[ group ];
  if ( !filterGroup ) {
    filterGroup = filters[ group ] = [];
  }

  // index of
  var index = $.inArray( checkbox.value, filterGroup );

  if ( checkbox.checked ) {
    
    if ( index === -1 ) {
      // add filter to group
      filters[ group ].push( checkbox.value );
    }
  } else {
    // remove filter from group
    filters[ group ].splice( index, 1 );
  }

}

/*
    function onHashChange() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate subject and author for Isotope filtering
        var theFilter = hashFilter["manufacturer"] + hashFilter["storage"] + hashFilter["os"] + hashFilter["camera"];
        
        if ( hashFilter ) {
            // Repaint Isotope container with current filters
            $container.isotope( {
                itemSelector: '.product',
                layoutMode: 'masonry',
                filter:  decodeURIComponent( theFilter ),
            } );

            // Toggle checked status of filter buttons
           //$('input:checkbox[value="' + hashFilter + '"]').prop('checked', true);


            //$( ".filter-list" ).find("[data-filter='" + hashFilter["subject"] + "'],[data-filter='" + hashFilter["author"] + "']").addClass("checked");
        }
    } // onHahschange



    function getHashFilter() {
        // Get filters (matches) and sort order (sorts)
        var manufacturer = location.hash.match( /manufacturer=([^&]+)/i );
        var storage = location.hash.match( /storage=([^&]+)/i );
        var optSys = location.hash.match( /os=([^&]+)/i );
        var camera = location.hash.match( /camera=([^&]+)/i );


        // Set up a hashFilter array
        var hashFilter = {};
        // Populate array with matches using ternary logic
        hashFilter["manufacturer"] = manufacturer ? manufacturer[1] : "*";
        hashFilter["storage"] = storage ? storage[1] : "*";
        hashFilter["os"] = optSys ? optSys[1] : "*";
        hashFilter["camera"] = camera ? camera[1] : "*";
        

        return hashFilter;
    } // getHashFilter

*/

    // celar filters
    $('#form-ui button').on('click', function(e) {
        e.preventDefault();
        var $checkboxes = $('.filter-criteria label input');
        if($checkboxes.is(":checked")) {
            $checkboxes.prop('checked', false);
            filters = {};
            $container.isotope({ filter: '*' });
            location.hash = 'filter=*';
        }
    });



  var isIsotopeInit = false;

  function onHashChange() {
    var hashFilter = getHashFilter();
    if ( !hashFilter && isIsotopeInit ) {
      return;
    }
    isIsotopeInit = true;
    // filter isotope
    $container.isotope({
      itemSelector: '.product',
      filter: hashFilter
    });
    // set selected class on button
    if ( hashFilter ) {
      //$filters.find('.is-checked').removeClass('is-checked');
      //var $filterGroup = $('.filter-criteria');
      var hashFilterList = hashFilter.split(', ');
      var newHashFilter = hashFilterList.join('');
      var filterItems = newHashFilter.split('.');
      filterItems.forEach(function (item) { 
          $('input:checkbox[value=".' + item + '"]').prop('checked', true);
      });
    }
  }




function getHashFilter() {
  var hash = location.hash;
  // get filter=filterName
  var matches = location.hash.match( /filter=([^&]+)/i );
  var hashFilter = matches && matches[1];
  return hashFilter && decodeURIComponent( hashFilter );
}


  $(window).on( 'hashchange', onHashChange );
  
  // trigger event handler to init Isotope
  onHashChange();

});
