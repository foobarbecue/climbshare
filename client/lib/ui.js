// jquery helper for selecting text in contenteditable span
jQuery.fn.selectText = function(){
    var doc = document;
    var element = this[0];
    console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

Climbsim.menuinit = function(){
    $('#controlPanel').click(
        function(e){e.stopImmediatePropagation();}
                       );
    $('#controlPanel>h3').append('<span class="expandArrow">&#x25C2</span><span class="expandedArrow hidden">&#x25BE</span>')
    $('#controlPanel>h3').click(
        function(){
            $(this).next('div').slideToggle();
            $(this).children('.expandArrow, .expandedArrow').toggle();
    });
};
