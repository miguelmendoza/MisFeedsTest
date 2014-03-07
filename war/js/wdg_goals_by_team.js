;(function($){
    
    $.fn.goalsbyteam = function( params ) {

        var objSettings = $.extend( {
            idTorneo: false,
            title: 'Goleo Por Equipo',
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
        $objGlobal.addClass("wdg_goals_by_team_01").children('div').fadeIn( 4000 );
        
        $(function(){
        	$('#goalsbyteams_dropdown').menuStats({
        		"idTorneo": objSettings.idTorneo
        	});
      	});
        
    };
    
    var token = function ( $objGlobal, objSettings ) {
        
        var test = true;
        var domain = ( test ) 
            ? 'http://feeds-miportal.appspot.com/data/stadisticgoalsbyteam.js'
                : 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+objSettings.idTorneo+'/stadisticgoalsbyteam.js';
        
        $.ajax({
            type: 'GET',
            url: domain,
            async: false,
            jsonpCallback: 'stadisticGoalsByTeam',
            contentType: "application/json",
            dataType: 'jsonp',
            cache: false,
            success: function(data) {
                successData( $objGlobal, objSettings, data);
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
        var tiposGoleo = ["goleo_ofensivo_mejores","goleo_ofensivo_peores","goleo_defensivo_mejores","goleo_defensivo_peores"];
        var tituloGoleo = ["Los 5 mejores de goleo ofensivo","Los 5 peores de goleo ofensivo",
                          "Los 5 mejores de goleo defensivo","Los 5 peores de goleo defensivo"];
        
        
    	html += '<div id="goalsbyteams_dropdown" style="z-index: 1000;"></div>';
    	

			html += '<div class="titulo_goal textcolor-title1" style="z-index: 950;">Goles por equipo</div>';
			html += '<div class="goal" style="z-index: 940;">';
			
			$.each( tiposGoleo, function(j , ind) {
				html += '<h2 class="titulo textcolor-title4">'+tituloGoleo[j]+'</h2>';
				html += '<ul class="head_team textcolor-title1">';
					html += '<li>PROMEDIO</li>';
					html += '<li>LOCAL</li>';
					html += '<li>VISITANTE</li>';
				html += '</ul>';
	   					   				
	   			html += processData( data[ind] );
			});
			
   			html += '</div>';
    		
   		html += '</div>';
        		
        		
        return html;
    };
    

    var processData = function ( data ) {
        var dataAux = "", html = "",  index = new Array(), lastClass = "dotted-bottom", html = "";
        var tiposGoleo = ["total","local","visitante"];

        var lim = ( data ) ? data.local.length : 0;
        
        if ( lim === 0 ) { return false; }
        
        $.each( tiposGoleo, function(j , ind) {
        	$.each( data[ind], function(i,item){
        		if( !index[i] ) {
	        		index[i] = new Array();
	        	}
	        	index[i].push( item );
	        });
        });
        
        $.each( index, function(i,item){
        	if( i == index.length-1 ) {
        		lastClass = "last_container";
        	}
    		html += '<div class="team_divisor '+lastClass+'" style="z-index: 930;">';
				html += '<ul class="team">';
   					html += '<li class="icon_team"><img src="'+item[0].urlLogoClud+'" alt=""></li>';
   					html += '<li class="name_team"><p>'+item[0].nameTeam+'</p></li>';
   					html += '<li class="stadistics_team textcolor-title2"><p class="dotted-right">'+item[0].GF+'</p></li>';
   				html += '</ul>';

   				html += '<ul class="team">';
   					html += '<li class="icon_team"><img src="'+item[1].urlLogoClud+'" alt=""></li>';
   					html += '<li class="name_team"><p>'+item[1].nameTeam+'</p></li>';
   					html += '<li class="stadistics_team textcolor-title2"><p class="dotted-right">'+item[1].GF+'</p></li>';
   				html += '</ul>';
   				
   				html += '<ul class="team">';
   					html += '<li class="icon_team"><img src="'+item[2].urlLogoClud+'" alt=""></li>';
   					html += '<li class="name_team"><p>'+item[2].nameTeam+'</p></li>';
   					html += '<li class="stadistics_team textcolor-title2 last_child"><p>'+item[2].GF+'</p></li>';
   				html += '</ul>';
			html += '</div>';
        	
    	});
        
        return html;
    }

})(jQuery);