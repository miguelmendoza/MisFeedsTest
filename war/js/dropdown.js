;(function($){
    
    $.fn.menuStats = function( params ) {

        var objSettings = $.extend( {
            idTorneo: false,
            title: 'Estadisticas',
            test: false
        }, params);

        if ( !objSettings.idTorneo ) {
            return '';
        }

        var $objGlobal = $(this);
        
        $objGlobal.html( objSettings.lblLoading );
        token( $objGlobal, objSettings);
        return this;

    };
    
    
    var successData = function ( $objGlobal, objSettings, data_teams ) {
        var html = "";
        
        html = createHTML_Deportes( objSettings, data_teams );

        $objGlobal.delay( 1000 )
        		.html( html )
        		.addClass("wdg_scroll_dropdown")
        		.css("display","none")
        		.fadeIn( 1000 );
        funciones($); 
    };
    
    var token = function ( $objGlobal, objSettings ) {
        
        var test = true;
        var domain = ( test ) 
            ? 'http://feeds-miportal.appspot.com/data/statisticsmenu.js'
                : 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+objSettings.idTorneo+'/statisticsmenu.js';
        
        $.ajax({
            type: 'GET',
            url: domain,
            async: false,
            jsonpCallback: 'menuDropdown',
            contentType: "application/json",
            dataType: 'jsonp',
            cache: false,
            success: function(data_teams) {
                successData( $objGlobal, objSettings, data_teams);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $objGlobal.html('');
            }
        });
    };
    
    var clearUrlString = function(text){
        text = text.trim();
        text = text.toLowerCase();
        text = text.replace(" ","-");
        return text;
    }
    
    /* ################################################################################################################################################## */
    
    // Layout Deportes
    var createHTML_Deportes = function ( objSettings, data ) {
        var html = '';
        htmlData = processData( data );
        if ( !htmlData ) {
            return '';
        }

    	html += '<div class="wdg_tennisresult_01_pleca background-color-pleca1">';
    		html += '<p class="textcolor-title3">Resultados</p>';
    	html += '</div>';
    	html += '<div class="wdg_scroll_list background-gradient-content2">';
    		html += '<p class="wdg_scroll_value">'+data.dataEstadistica[0].nameEstadisticas+'</p>';
    		html += '<div class="wdg_tennisresult_01_click background-color-pleca1">';
    			html += '<span class="tvsa-caret-down"></span>';
    		html += '</div>';
    		html += '<div class="wdg_scroll_events" style="visibility: hidden; height: 0px; overflow-y: scroll; overflow-x: hidden;">';
    			html += '<ul class="wdg_scroll_elements">';
    			html +=htmlData;
				html += '</ul>';
			html += '</div>';
		html += '</div>';
    
        return html;
    };
    
    // Procesa Data para el Template de Deportes
    var processData = function ( data ) {
        var dataAux = "";
        var html = "";
        var lim = 0;
        lim = ( data.dataEstadistica ) ? data.dataEstadistica.length : 0;
        if ( lim === 0 ) {
          return false;
        }
        
        for( var i=0 ; i<lim ; i++ )  {
            dataAux = data.dataEstadistica[i];
            html += '<li id="'+dataAux.controlador+'"><p>'+dataAux.nameEstadisticas+'</p></li>';
        }
        return html;
    }

    
    
  //START -- Funcionalidad Widget
    var funciones = function($){
        (function($,T) {
    	    	var onDocumentReady = function() {
    	            var $element = $('.wdg_scroll_dropdown');
    	            $element.each(function() {
    	                var $dropdownAnchor = $(this).find('.wdg_scroll_list');
    	                var $firstItem = $(this).find('.wdg_scroll_elements li:first-child');
    	                var $dropdownItems = $(this).find('.wdg_scroll_elements li');
    	                
    	                $(this).find('.wdg_scroll_value').html($firstItem.find('p').html());
    	                
    	                $dropdownAnchor.on('click', function(evt) {
    	                    evt.preventDefault();
    	                    var $listItems = $(this).find('.wdg_scroll_events');
    	                    var visibilidad = $listItems.css('visibility'); 
    	                    if ( visibilidad == 'hidden' ) {
    	                        $listItems.css({
    	                            visibility: 'visible',
    	                            height: '192px',
    	                            'overflow-y': 'scroll',
    	                            'overflow-x': 'hidden'         
    	                        });     
    	                    } else {
    	                        $listItems.css({
    	                            visibility: 'hidden',
    	                            height: '0px'
    	                        });
    	                    }
    	                });
    	                
    	                $dropdownItems.bind('click', function(evt) {
    	                    evt.preventDefault()
    	                    var $html = $(this).find('p').html();
    	                    $(this).closest('.wdg_scroll_list').find('.wdg_scroll_value').html($html);
    	                });
    	
    	            });
    	        };
    	        $(onDocumentReady);
    	

        })($,Televisa);
    };
    // END -- Funcionalidad Widget

    
    
})(jQuery);