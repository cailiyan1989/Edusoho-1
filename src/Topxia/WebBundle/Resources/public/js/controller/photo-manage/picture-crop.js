define(function(require, exports, module) {

    require("jquery.jcrop-css");
    require("jquery.jcrop");
    var Notify = require('common/bootstrap-notify');


    exports.run = function() {
      	
        

        var $form = $("#course-picture-crop-form"),
            $picture = $("#course-picture-crop");

        var scaledWidth = $picture.attr('width'),
            scaledHeight = $picture.attr('height'),
            naturalWidth = $picture.data('naturalWidth'),
            naturalHeight = $picture.data('naturalHeight'),
            cropedWidth = 800,
            cropedHeight =600,
            ratio = cropedWidth / cropedHeight,
            selectWidth = 800 * (naturalWidth/scaledWidth),
            selectHeight = 600 * (naturalHeight/scaledHeight);

        $picture.Jcrop({
            trueSize: [naturalWidth, naturalHeight],
            setSelect: [0, 0, selectWidth, selectHeight],
            aspectRatio: ratio,
            onSelect: function(c) {
                $form.find('[name=x]').val(c.x);
                $form.find('[name=y]').val(c.y);
                $form.find('[name=width]').val(c.w);
                $form.find('[name=height]').val(c.h);
            }
        });

    };
  
});