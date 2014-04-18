$(function() {
    $('#controlPanel').click(
        function(e){e.stopImmediatePropagation();}
                       );
    $('#controlPanel>h3').click(
        function(){
            $(this).next().toggle();
    });
    $('.hidden').hide();
});