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

menuinit = function(){
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

positionLabelIcons = function (){
  // position label images on top of right edge of labels
  Labels.find().forEach(function(lbl){
    var lbl_el=$('.label3D.'+lbl._id);
    // only attempt if label is already drawn
    if (lbl_el.length > 0){
      var lbl_type_img=lbl_el.children('img');
      lbl_type_img.position(
        {my:'center',
          at:'right top',
          of:lbl_el,
          offset:'0 10',
//                  using: function(pos) {
//                     $(this).animate(pos, 50, "linear");
//                 }
        });
    }
  })
};