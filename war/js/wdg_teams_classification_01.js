;(function($){
    
    $.fn.teamsClassification = function( params ) {

        var objSettings = $.extend( {
            idTorneo: false,
            idPhase: false,
            title: 'Clasificación',
            urlWidget: 'http://televisadeportes.esmas.com/',
            lblGrupos: 'Grupos',
            lblNUM: '<i class="tvsa-hash"></i>',
            lblEQUIPO: 'EQUIPO',
            lblPJ: 'PJ',
            lblPG: 'G', 
            lblPTS: 'PTS',
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
        
        objSettings = decoding( objSettings );
        
        var $objGlobal = $(this);
        token_grupos( objSettings, $objGlobal);
        return this;

    };
    
    
    var successData = function ( objSettings, $objGlobal, data_groups, data_teams ) {
        var html = "";
        
        switch( objSettings.template ) {
            case 'deportes': html = createHTML_Deportes( objSettings, data_teams ); break;
            //case 'mundialF1': html = createHTML_Mundial_OLD( data_groups, data_teams ); break;
            case 'mundial': html = createHTML_Mundial( objSettings, data_groups, data_teams ); break;
        }
        
        $objGlobal.addClass('wdg_teams_classification_01').attr("data-enhance","false");
        
        $objGlobal.delay( 8000 ).html( html );
        $(".g_A").show();
        $objGlobal.children('div').fadeIn( 4000 );
        funciones($);
    };
    
    var token_grupos = function ( objSettings, $objGlobal ) {
        
        var domain = ( objSettings.test ) 
        	? 'http://feeds-miportal.appspot.com/data/phases.js'
        		: 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+objSettings.idTorneo+'/phases.js';
        
        var peticion = $.ajax({
            type: 'GET',
            url: domain,
            async: false,
            jsonpCallback: 'phasesbytorneo',
            contentType: "application/json",
            dataType: 'jsonp',
            cache: false,
            beforeSend: function() {
            	$objGlobal.html( objSettings.lblLoading );
            },
            success: function(data_groups) {
                token_teams( objSettings, $objGlobal, data_groups);
            }
        });
    };
    
    var token_teams = function ( objSettings, $objGlobal, data_groups ) {
        console.log( typeof( objSettings.test ) );
        var domain = ( objSettings.test ) 
        	? 'http://feeds-miportal.appspot.com/data/teamsclassification.js' 
       			: 'http://static-televisadeportes.esmas.com/sportsdata/futbol/data/'+objSettings.idTorneo+'/teamsclassification.js';
        console.log( domain );
        $.ajax({
            type: 'GET',
            url: domain,
            async: false,
            jsonpCallback: 'teamsClassification',
            contentType: "application/json",
            dataType: 'jsonp',
            cache: false,
            success: function(data_teams) {
                successData( objSettings, $objGlobal, data_groups, data_teams);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $objGlobal.html('');
            }
        });
    };
    
    var clearUrlString = function(text)
    {
        text = text.trim();
        text = text.toLowerCase();
        text = text.replace(" ","-");
        return text;
    }
    
    var decoding = function (tx)
    {
    	if( typeof(tx) == "string" ) {
    		return accentEncode(tx);
    	} else if( typeof(tx) == "object" ){
    		$.each(tx, function(i,t){
    			if( typeof(tx[i]) == "string" ) {
    				tx[i] = accentEncode( tx[i] );
    	    	}
    			
    		});
    	}
    	return tx;
    };
    
    var accentEncode = function (tx)
    {
    	var rp = String(tx);

	    rp = rp.replace(/á/g, '&aacute;');
	    rp = rp.replace(/é/g, '&eacute;');
	    rp = rp.replace(/í/g, '&iacute;');
	    rp = rp.replace(/ó/g, '&oacute;');
	    rp = rp.replace(/ú/g, '&uacute;');
	    rp = rp.replace(/ñ/g, '&ntilde;');
	    rp = rp.replace(/ü/g, '&uuml;');

	    rp = rp.replace(/Á/g, '&Aacute;');
	    rp = rp.replace(/É/g, '&Eacute;');
	    rp = rp.replace(/Í/g, '&Iacute;');
	    rp = rp.replace(/Ó/g, '&Oacute;');
	    rp = rp.replace(/Ú/g, '&Uacute;');
	    rp = rp.replace(/Ñ/g, '&Ntilde;');
	    rp = rp.replace(/Ü/g, '&Uuml;');
	    
	    return rp;
    };
    
    function eliminateDuplicates(arr) {
        var i, len=arr.length, out=[], obj={};

        for (i=0;i<len;i++) {
            obj[arr[i]]=0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    }

    
    // Layout Mundial Con Feeds de Fase 2 y 3
    var createHTML_Mundial = function ( objSettings, data_groups, data_teams ) {
    	var html = ''; 
        var combo = ''; 
        var grupos = new Array(); 
        var groupVal = [];
        var items = "";

        for( var i=0; i<data_groups.dataFases.length; i++ ) {
        	if( data_groups.dataFases[i].idFase == objSettings.idPhase ) {
          
        		// Se forma la lista de equipos
        		for( var j=0; j<data_groups.dataFases[i].dataJornadas.length; j++ ) {
        			groupVal[j] = data_groups.dataFases[i].dataJornadas[j].group;
        			if( !grupos[groupVal[j]] ) {
        				grupos[groupVal[j]] = new Array();
        			}
        			for( var k=0; k < data_teams.dataEstadistica.length; k++ ) {
            	  
        				if( data_groups.dataFases[i].dataJornadas[j].idTeam == data_teams.dataEstadistica[k].idTeam ) {
        					data_teams.dataEstadistica[k].grupo = groupVal[j];
        					grupos[groupVal[j]].push( data_teams.dataEstadistica[k] );
        				}
        			}
        		}
          	}
        }
        
        var groupID = ["A","B","C","D"];

        $.each( groupID, function(i, item){
        	
        	combo += '<li id="list_'+item+'" ><p>Grupo '+item+'</p></li>';
        	if( grupos[item] ) {
        		grupos[item].sort( function(a,b){return b.dataEstadisticas.PTS - a.dataEstadisticas.PTS;});

	        	$.each( grupos[item], function(j, data) {
	        		items += '<tr class="g_'+data.grupo+'" style="display:none" >';
	          	    items += '<td class="fondo izq textcolor-title2">'+(j+1)+'</td>';
	          	    items += '<td class="der_img textcolor-title2"><img src="'+data.urlLogoClub+'" style="width: 24px; height: 18px;" alt="'+data.nameTeam+'"></td>';
	          	    items += '<td class="team">'+data.nameTeam+'</td>';
	          	    items += '<td class="der textcolor-title2">'+data.dataEstadisticas.JJ+'</td>';
	          	    items += '<td class="der textcolor-title2">'+data.dataEstadisticas.JG+'</td>';
	          	    items += '<td class="der textcolor-title2">'+data.dataEstadisticas.PTS+'</td>';
	          	  	items += '</tr>';
	        	});
        	
        	}
        });


        html += '<div class="str_pleca_01">';
            html += '<div class="str_pleca_01_title">';
                html += '<h3 class="background-color-pleca1">';
                    html += '<a title="'+objSettings.title+'" class="textcolor-title3">'+objSettings.title;
                        html += '<span class="str_pleca_01_arrowa selected"></span>';
                        html += '<span class="str_pleca_01_arrowb"></span>';
                    html += '</a>';
                html += '</h3>';
            html += '</div>';
        html += '</div>';

        html += '<div class="wdg_teams_classification_01_grupos">';
            html += '<span class="title">'+objSettings.lblGrupos+'</span>';
            html += '<div class="filter">';
                html += '<div class="wdg_teams_classification_01_grupos_dropdown drop">';
                    html += '<div class="wdg_teams_classification_01_grupos_dropdowncontent content">';
                        html += '<p>Grupo A</p>';
                        html += '<span class="tvsa-caret-down"></span>';
                    html += '</div>';
                    html += '<div class="wdg_teams_classification_01_grupos_listcontainer">';
                        html += '<ul class="wdg_teams_classification_01_grupos_dropdownlist">';
                            html += combo;
                        html += '</ul>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
            
        html += '</div>';

        html += '<table class="titulo">';
            html += '<tbody><tr>';
                html += '<th class="izq textcolor-title1">'+objSettings.lblNUM+'</i></th>';
                  html += '<th class="der_img textcolor-title1">&nbsp;</th>';
                  html += '<th class="team1 textcolor-title1">'+objSettings.lblEQUIPO+'</th>';
                  html += '<th class="der textcolor-title1">'+objSettings.lblPJ+'</th>';
                  html += '<th class="der textcolor-title1">'+objSettings.lblPG+'</th>';
                  html += '<th class="der textcolor-title1">'+objSettings.lblPTS+'</th>';
              html += '</tr>';
          html += '</tbody></table>';
          
        html += '<div class="scroll" id="navigation_list">';
          html += '<table class="datos"><tbody>';
          
	          html += items;
	            
	          html += '</tbody></table>';
	      html += '</div>';
	          
	      html += '<div class="degraded"></div>';
	      html += '<div class="seemore">';
	          html += '<a href="'+objSettings.urlWidget+'">'+objSettings.lblViewMore+'</a>';
	      html += '</div>';
        
        return html;
    };
    
    /* Layout Mundial Con Feeds de Fase 1
    var createHTML_Mundial_OLD = function ( data_groups, data_teams ) {
        
        var html = '';
        
        html += '<div class="wdg_teams_classification_01" data-enhance="false">';
            html += '<div class="str_pleca_01">';
                html += '<div class="str_pleca_01_title">';
                    html += '<h3 class="background-color-pleca1">';
                        html += '<a title="'+objSettings.title+'" class="textcolor-title3">'+objSettings.title;
                            html += '<span class="str_pleca_01_arrowa selected"></span>';
                            html += '<span class="str_pleca_01_arrowb"></span>';
                        html += '</a>';
                    html += '</h3>';
                html += '</div>';
            html += '</div>';
    
            html += '<div class="wdg_teams_classification_01_grupos">';
                html += '<span class="title">'+objSettings.lblGrupos+'</span>';
                html += '<div class="filter">';
                    html += '<div class="wdg_teams_classification_01_grupos_dropdown drop">';
                        html += '<div class="wdg_teams_classification_01_grupos_dropdowncontent content">';
                            html += '<p>Grupo '+data_groups[0].id+'</p>';
                            html += '<span class="tvsa-caret-down"></span>';
                        html += '</div>';
                        html += '<div class="wdg_teams_classification_01_grupos_listcontainer">';
                            html += '<ul class="wdg_teams_classification_01_grupos_dropdownlist">';
                                var group = [];                                
                                var groupVal = [];                                
                                for( var i=0; i<data_groups.length; i++ ) { 
                                  html += '<li id="list_'+data_groups[i].id+'" ><p>Grupo '+data_groups[i].id+'</p></li>';
                                  group[i] = [];
                                  groupVal[i] = data_groups[i].id;
                                }
                                
                            html += '</ul>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
                
            html += '</div>';
    
            html += '<table class="titulo">';
                html += '<tbody><tr>';
                    html += '<th class="izq textcolor-title1">'+objSettings.lblNUM+'</i></th>';
                      html += '<th class="der_img textcolor-title1">&nbsp;</th>';
                      html += '<th class="team1 textcolor-title1">'+objSettings.lblEQUIPO+'</th>';
                      html += '<th class="der textcolor-title1">'+objSettings.lblPJ+'</th>';
                      html += '<th class="der textcolor-title1">'+objSettings.lblPG+'</th>';
                      html += '<th class="der textcolor-title1">'+objSettings.lblPTS+'</th>';
                  html += '</tr>';
              html += '</tbody></table>';
              
            html += '<div class="scroll" id="navigation_list">';
              html += '<table class="datos"><tbody>';

              for( var i=0; i<data_teams.teams.length; i++ ) {
                for( var j=0; j<data_groups.length; j++ ) {
                    for( var k=0; k<data_groups[j].teams.length; k++ ) { 
                        if( data_teams.teams[i].id == data_groups[j].teams[k].id ) {
                          group[groupVal.indexOf(data_groups[j].id)].push(data_teams.teams[i]);
                        }
                    }
                }
              }
              
              $.each( group, function( index , item ){
                item.sort(function(a,b){
                  return (b.estadisticas.JG - a.estadisticas.JG );
                });
                $.each( item, function( index2 , pais ){
                  html += '<tr class="g_'+groupVal[index]+'" style="display:none" >';
                    html += '<td class="fondo izq textcolor-title2">'+( index2+1 )+'</td>';
                    html += '<td class="der_img textcolor-title2"><img src="'+pais.bandera+'" style="width: 24px; height: 18px;" alt="'+pais.nombre+'"></td>';
                    html += '<td class="team">'+pais.nombre+'</td>';
                    html += '<td class="der textcolor-title2">'+pais.estadisticas.JJ+'</td>';
                    html += '<td class="der textcolor-title2">'+pais.estadisticas.JG+'</td>';
                    html += '<td class="der textcolor-title2"> - </td>';
                  html += '</tr>';
                });
              });
                
              html += '</tbody></table>';
              html += '</div>';
              
              html += '<div class="degraded"></div>';
              html += '<div class="seemore">';
                  html += '<a href="'+objSettings.urlWidget+'">'+objSettings.lblViewMore+'</a>';
              html += '</div>';
          html += '</div>';
          
          return html;
    };
    
    /* ################################################################################################################################################## */
    
    // Layout Deportes
    var createHTML_Deportes = function ( objSettings, data ) {
        var html = '';
        
        htmlData = processData( objSettings, data );
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
    var processData = function ( objSettings, data ) {
        var dataAux = "";
        var html = "";
        var lim = 0;
        
        lim = ( data.dataEstadistica ) ? data.dataEstadistica.length : 0;
        
        if ( lim === 0 ) {
          return false;
        }

        data.dataEstadistica.sort( function(a,b){return b.dataEstadisticas.PTS - a.dataEstadisticas.PTS;});
        
        for( var i=0 ; i<lim ; i++ )  {
        
            dataAux = data.dataEstadistica[i];
            
            if( objSettings.upperCase ) {
                dataAux.nameTeam = dataAux.nameTeam.toUpperCase();
            }
            
            html += '<tr>';
            html += '<td class="fondo izq textcolor-title2">'+(i+1)+'</td>  <td class="der_img textcolor-title2">';
            
            html += ( dataAux.urlLogoClub ) ? '<img src="'+dataAux.urlLogoClub+'" alt="'+dataAux.nameTeam+'">' : '';

            html += '</td>';
            html += '<td class="team">'+dataAux.nameTeam+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.dataEstadisticas.JJ+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.dataEstadisticas.JG+'</td>';
            html += '<td class="der textcolor-title2">'+dataAux.dataEstadisticas.PTS+'</td>';
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