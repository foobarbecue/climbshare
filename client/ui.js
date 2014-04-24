$(function() {
    $('#controlPanel').click(
        function(e){e.stopImmediatePropagation();}
                       );
    $('#controlPanel>h3').click(
        function(){
            $(this).next().slideToggle();
    });
    $('.hidden').hide();
});