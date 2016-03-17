$(function() {
    $( ".draggable" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    $("div").droppable({
        drop: function( event, ui ) {
            createNode(ui.draggable.text(), $(ui.draggable))
            $(ui.draggable).hide();
            
        }
    });
    
    $('input').keydown(function(e){
        if (e.keyCode === 8 && this.value === '') {
            $('span.node:last > span.close').click();
        } else if (e.keyCode === 13) {
            createNode(this.value);
            this.value = '';
        }
    });
});

function createNode(text, origNode) {
   var $node = $('<span class="node"/>').html(text).append(
       $('<span class="close"/>').click(function () {
           if (origNode !== undefined) origNode.show();
           $(this).parent().remove();
       }).html('x')
   );
   $node.insertBefore($('input'));
}

