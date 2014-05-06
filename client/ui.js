$(function() {
    $('#controlPanel').click(
        function(e){e.stopImmediatePropagation();}
                       );
    $('#controlPanel>h3').append('<span class="expandArrow">&#x25B6</span><span class="expandedArrow hidden">&#x25BC</span>')
    $('#controlPanel>h3').click(
        function(){
            $(this).next('div').slideToggle();
            $(this).children('.expandArrow, .expandedArrow').toggle();
    });
});