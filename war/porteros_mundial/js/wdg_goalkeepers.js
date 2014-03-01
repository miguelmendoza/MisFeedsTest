  ;(function($){
    
    $.fn.goalkeepers = function( params ) {

        var objSettings = $.extend( {
            idTorneo: false,
            title: 'Porteros',
            urlWidget: 'http://televisadeportes.esmas.com/',
            lblNUM: '<i class="tvsa-hash"></i>',
            lblEQUIPO: 'EQUIPO',
            lblPJ: 'MIN',
            lblPG: 'GR', 
            lblPTS: 'PROM',
            lblNext: 'Siguiente',
            lblPrev: 'Anterior',
            lblViewMore: 'Ver todos',
            lblLoading: '<b>LOADING.....</b>',
            template: 'deportes',
            upperCase: true,
            test: false
        }, params);

        if ( !objSettings.idTorneo ) {
            return '';
        }

        var $objGlobal = $(this);
        
        $objGlobal.html( objSettings.lblLoading );
        token_teams( $objGlobal, objSettings);
        return this;

    };
    
    
    var successData = function ( $objGlobal, objSettings, data_teams ) {
        var html = "";
        
        switch( objSettings.template ) {
            case 'deportes': html = createHTML_Deportes( objSettings, data_teams ); break;
            // case 'mundial': html = createHTML_Mundial( data_groups, data_teams ); break;
        }
        $objGlobal.delay( 8000 ).html( html );
        $(".g_A").show();
        $objGlobal.children('div').fadeIn( 4000 );
        funciones($);
    };
    
    var token_teams = function ( $objGlobal, objSettings ) {
        
        var test = true;
        var domain = ( test ) 
            ? 'http://feeds-miportal.appspot.com/goalkeepers.js'
                : 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+objSettings.idTorneo+'/goalkeepers.js';
        
        $.ajax({
            type: 'GET',
            url: domain,
            async: false,
            jsonpCallback: 'stdisticPorteros',
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
        
        html += '<div class="wdg_teams_classification_01" data-enhance="false" style="display:none">';
        
        html += '<!-- BEGIN: str_pleca_01 -->';
        html += '<div class="str_pleca_01">';
          html += '<div class="str_pleca_01_title">';
            html += '<h3 class="background-color-pleca1">';
              html += '<a href="'+objSettings.urlWidget+'" title="'+objSettings.urlWidget+'" class="textcolor-title3">'+objSettings.title;
                html += '<span class="str_pleca_01_arrowa selected"></span><span class="str_pleca_01_arrowb"></span></a>';
            html += '</h3></div></div><!-- END: str_pleca_01 -->';

        html += '<table class="titulo"><tbody><tr><th class="izq textcolor-title1">'+objSettings.lblNUM+'</th>';
        html += '<th class="der_img textcolor-title1">&nbsp;</th><th class="team1 textcolor-title1">'+objSettings.lblEQUIPO+'</th>';
        html += '<th class="der textcolor-title1">'+objSettings.lblPJ+'</th><th class="der textcolor-title1">'+objSettings.lblPG;
        html += '</th><th class="der textcolor-title1">'+objSettings.lblPTS+'</th>';
        html += '</tr></tbody></table>';
        
        html += '<div class="scroll" id="navigation_list"><table class="datos"><tbody>';
        
        html += htmlData;
        
        html += '</tbody></table></div> <!-- END SCROLL -->';
        
        html += '<div class="wdg_teams_classification_01_cnt"><div class="carousel_nav">';
        html += '<a class="prev bginactive" title="'+objSettings.lblPrev+'" href="#"><i class="tvsa-caret-up"></i></a>';
        html += '<a class="next bgactive" title="'+objSettings.lblNext+'" href="#"><i class="tvsa-caret-down"></i></a>';
        html += '<table class="ver_todos"><tbody><tr><td><a href="'+objSettings.urlWidget+'">'+objSettings.lblViewMore+'</a></td></tr></tbody></table></div>';
        html += '<div class="wdg_stadistics_01_clear"></div></div><div class="degraded"></div>';
        html += '<div class="seemore"><a href="'+objSettings.urlWidget+'">'+objSettings.lblViewMore+'</a></div></div>';

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
            html += '<tr>';
            html += '<td class="fondo izq textcolor-title2">'+(i+1)+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.namePlayer+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.estadisticasPlayer.MINUTOS+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.estadisticasPlayer.GOLES+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.estadisticasPlayer.PROMEDIO+'</td>';
            html += '</tr>';
        }
        return html;
    }
    
    /* ################################################################################################################################################## */
    
    // START -- Funcionalidad Widget
    var funciones = function($){
        (function($,T){
            var $parent = $('.wdg_teams_classification_01');
            var $dropdownAnchor = $parent.find('.wdg_teams_classification_01_grupos .filter');
            $dropdownAnchor.on('click', function(evt) {
                var $listItems = $(this).find('.wdg_teams_classification_01_grupos_dropdownlist');
                var $visibility = $listItems.css('visibility');
                var padre =$(this);
                if ( $visibility == 'hidden' )
                    $listItems.css({
                        visibility: 'visible',
                        height: 'auto',
                        'max-height' : '156px',
                        'overflow-y': 'scroll',
                        'overflow-x': 'hidden'         
                    });
                 else 
                     $listItems.css({
                        visibility: 'hidden',
                        height: '0px'
                });
                  var $dropdownItems2 = $(this).find('.wdg_teams_classification_01_grupos_dropdownlist li');
                $dropdownItems2.bind('click', function(evt) {
                    evt.preventDefault();
                    $( ".datos" ).find("tr").hide();
                    padre.find('.wdg_teams_classification_01_grupos_dropdowncontent p').html($(this).find('p').html());
                    $( ".g_"+this.id.split('_')[1] ).show('slow');
                });
               
                $listItems.bind('mouseleave', function(evt) {
                    evt.preventDefault();
                    var visibilidad = $(this).css('visibility');
                    if ( visibilidad == 'visible' ) {
                         $(this).css({
                            visibility: 'hidden',
                            height: '0px'       
                        });
                    } 
                });
            });


            $('.wdg_teams_classification_01').each(function(ix,element){
                var $this = $(this), 
                    Pointer = {
                        UP: (T.getIsTouchDevice()) ? 'touchend' : 'mouseup',
                        DOWN: (T.getIsTouchDevice()) ? 'touchstart' : 'mousedown'
                    }, 
                    $theUl = $('.wdg_teams_classification_01 .scroll');
                
                $this.find('a.prev, a.next').click(function(event){
                    event.preventDefault();
                });
                
                $this.find('a.prev').bind(Pointer.DOWN,function(){
            $(this).parent().parent().siblings('.scroll').animate({
                        'scrollTop': $theUl.scrollTop() - $theUl.height() - 2
                    }, 500);
                });
                
                $this.find('a.next').bind(Pointer.DOWN,function(){
                    $(this).parent().parent().siblings('.scroll').animate({
                        'scrollTop': $theUl.scrollTop() + $theUl.height() + 2
                    }, 500);
                });
          });
        
        /*Swipe*/
        $(document).ready(function(){
        $wtc =  164;
          $('.wdg_teams_classification_01 .scroll').bind('swipeup',function(){
            $(this).animate({
                'scrollTop': $(this).scrollTop() + $wtc
              }, 500);
          });
          $('.wdg_teams_classification_01 .scroll').bind('swipedown',function(){
            $(this).animate({
                'scrollTop': $(this).scrollTop() - $wtc
              }, 500);
          });	
        });
        
        
        /*Monitoreo scroll*/
        var $wtc_altura = $('.wdg_teams_classification_01 .datos').height();
        $('.wdg_teams_classification_01 .scroll').scroll(function() {
            
            
            
            if($(this).scrollTop() + $(this).height() == $wtc_altura) {
                   $(this).siblings('.degraded').css("visibility","hidden");
             //$(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings().children('.tvsa-caret-down').css('color','#000');
              $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').addClass('bginactive');
              $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').removeClass('bgactive');
                }
            else if ($.browser.msie && parseInt($.browser.version, 10) <= 8 && $(this).scrollTop() >= 475){
              
              $(this).siblings('.degraded').css("visibility","hidden");
              
                $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').addClass('bginactive');
                $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').removeClass('bgactive');
            }
            else{
             $(this).siblings('.degraded').css("visibility","visible");
             //$(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings().children('.tvsa-caret-down').css('color','#FFF');
             $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').addClass('bgactive');
             $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.next').removeClass('bginactive');
            }
            
            if($(this).scrollTop() == 0){
             //$(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings().children('.tvsa-caret-up').css('color','#000');
             $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.prev').addClass('bginactive');
             $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.prev').removeClass('bgactive');
            }
            else
            {
            //$(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings().children('.tvsa-caret-up').css('color','#FFF');	
            $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.prev').addClass('bgactive');
             $(this).siblings('.wdg_teams_classification_01_cnt').children().children().siblings('.prev').removeClass('bginactive');
            }
          });	   
        })($,Televisa);
    };
    // END -- Funcionalidad Widget
})(jQuery);