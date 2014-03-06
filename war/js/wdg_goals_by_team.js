;(function($){
    
    $.fn.goalsbyteam = function( params ) {

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
        
        $objGlobal.delay( 8000 ).html( html );
        $objGlobal.addClass("wdg_scroll_dropdown").children('div').fadeIn( 4000 );
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
        
        //html += '<div class="wdg_scroll_dropdown" >';
        	html += '<div class="wdg_tennisresult_01_pleca background-color-pleca1" style="display:none">';
        		html += '<p class="textcolor-title3">Resultados</p>';
        	html += '</div>';
        	html += '<div class="wdg_scroll_list background-gradient-content2">';
        		html += '<p class="wdg_scroll_value">ATP 1</p>';
        		html += '<div class="wdg_tennisresult_01_click background-color-pleca1">';
        			html += '<span class="tvsa-caret-down"></span>';
        		html += '</div>';
        		html += '<div class="wdg_scroll_events" style="visibility: hidden; height: 0px; overflow-y: scroll; overflow-x: hidden;">';
        			html += '<ul class="wdg_scroll_elements">';
        			html +=htmlData;
    				html += '</ul>';
				html += '</div>';
			html += '</div>';
		//html += '</div>';

    
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
            console.log( dataAux );
            html += '<li id="'+dataAux.controlador+'"><p>'+dataAux.nameEstadisticas+'</p></li>';
        }
        return html;
    }

})(jQuery);