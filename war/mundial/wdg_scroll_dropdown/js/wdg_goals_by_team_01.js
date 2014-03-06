$(document).ready(function() {
    var onDocumentReady = function() {
        // TODO: refactor for a better approach
        var $parent = $('.wdg_goals_by_team_01');
        var $dropdownAnchor = $parent.find('.wdg_goals_by_team_01_dropdown');
        var $firstItem = $('.wdg_goals_by_team_01_dropdownlist li:first-child');        
        $('.wdg_goals_by_team_01_dropdowncontent p').html($firstItem.find('p').html());
        
        $dropdownAnchor.bind('click', function(evt) {
            evt.preventDefault();
            var listItems = $(this).find('.wdg_goals_by_team_01_listcontainer').find('.wdg_goals_by_team_01_dropdownlist');
            var padre =$(this);
            var visibilidad = listItems.css('visibility'); 
            if ( visibilidad == 'hidden' ) 
                listItems.css({
                    visibility: 'visible',
                    height: 'auto',
                    'max-height' : '180px',
                    'overflow-y': 'scroll',
                    'overflow-x': 'hidden'         
                });
             else 
                 listItems.css({
                    visibility: 'hidden',
                    height: '0px'
                });
            var $dropdownItems2 = $(this).find('.wdg_goals_by_team_01_dropdownlist li');
            $dropdownItems2.bind('click', function(evt) {
                console.log('Entando');
                evt.preventDefault();
                padre.find('.wdg_goals_by_team_01_dropdowncontent p').html($(this).find('p').html());
            });
        });
        $("#dropdwon-right").click(function(e) {
            console.log($(this).parents('div'));
        });

        $('.wdg_scroll_events').bind('mouseleave', function(evt) {
            evt.preventDefault();
            var $listItems = $(this);
            var visibilidad = $listItems.css('visibility');
            if ( visibilidad == 'visible' ) {
                $listItems.css({
                    visibility: 'hidden',
                    height: '0px'         
                });
            } 
        });
        
         
    };
    $(onDocumentReady);

   $(function() {
    var zIndexNumber = 1000;
    $('.wdg_goals_by_team_01 div').each(function() {
        $(this).css('zIndex', zIndexNumber);
        zIndexNumber -= 10;
    });
});

});