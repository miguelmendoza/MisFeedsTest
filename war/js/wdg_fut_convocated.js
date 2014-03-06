;(function( $ ) {
    
    var objSettings = false;
    
    $.fn.convocados = function( params ) {

        objSettings = $.extend( {
            idTorneo: false,
            idTeam: false,
            title: 'Convocados',
            template: 'deportes',
            lblPlayer: 'JUGADOR',
            lblNum: '#',
            lblLoading: '<b>LOADING.....</b>'
        }, params);

        if ( !objSettings.idTorneo ) {
            return '';
        }
        
        var $objGlobal = $(this);
        urlToken = objSettings.idTorneo+'/clubes/'+objSettings.idTeam+'/convocatedbyteam.js';
        jsonpCallback = 'convocatedbyteam';
        
        token( $objGlobal );
        return this;

    };
    
    var token = function ( $objGlobal ) {

        $.ajax({
            type: 'GET',
            url: 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+urlToken,
            async: false,
            jsonpCallback: jsonpCallback,
            contentType: "application/json",
            dataType: 'jsonp',
            cache: false,
            success: function(data) { successData($objGlobal, data) },
            error: function(xhr, ajaxOptions, thrownError) {
                $objGlobal.html('');
            }
        });
    };
    
    var successData = function ( $objGlobal, data ) {
        var html = "";
        html = createHTML( $objGlobal, data );
        
        $objGlobal.delay( 8000 ).html( html );
        $objGlobal.children('div').fadeIn( 4000 );
    }
    
    var createHTML = function ( $objGlobal, data ) {
        var html = '';

        var htmlData = processData( data );
        
        if ( !htmlData ) {
            return '';
        }
        
        html += '<div class="wdg_fut_convocated_01" data-enhance="false">';

          html += '<div class="str_pleca_01">';
              html += '<div class="str_pleca_01_title">';
                  html += '<h3 class="background-color-pleca1">';
                      html += '<a href="http://stats.televisadeportes.esmas.com/futbol/torneo/'+data.nameTorneo+'/equipos/'+clearUrlString(data.nameTeam)+'/'+objSettings.idTeam+'/'+objSettings.idTorneo+'" title="'+objSettings.title+'" class="textcolor-title3">'+objSettings.title+'</a>';
                  html += '</h3>';
              html += '</div>';
          html += '</div>';

        
          html += '<table class="convocados">';
            html += '<tbody><tr>';
              html += '<th class="textcolor-title1">'+objSettings.lblNum+'</th>';
              html += '<th class="izq textcolor-title1">'+objSettings.lblPlayer+'</th>';
            html += '</tr>';

            html += '<tr><td colspan="2" class="line1"></td></tr>';
            
            html += htmlData;
            
          html += '</tbody></table>';
        html += '</div>';
        
        
        
        return html;
    };
    
    
    var processData = function ( data ) {
        var dataAux = "";
        var html = "";
        var lim = 0;
        
        lim = ( data.dataPlayers ) ? data.dataPlayers.length : 0;
        if ( lim === 0 ) {
          return false;
        }
        
        for( var i=0 ; i<lim ; i++ )  {
        
            dataAux = data.dataPlayers[i];
            
            html += '<tr><td class="textcolor-title2">'+dataAux.playera+'</td>';
            html += '<td class="dotted-left"><p class="up">'+dataAux.namePlayer+'</p><p class="down textcolor-title4">'+dataAux.position+'</p></td></tr>';
            
            html += '<tr><td colspan="2" class="line2 dotted-bottom"></td></tr>';
        }
        return html;
    };
    
    var clearUrlString = function(text){
        text = text.trim();
        text = text.toLowerCase();
        text = text.replace(" ","-");
        return text;
    };

})(jQuery);
