angular.module('mm.foundation.equalizer', [])

  .directive('equalizer', [function () {
    var defaultSettings = {
      use_tallest : true,
      before_height_change : angular.noop,
      after_height_change : angular.noop,
      equalize_on_stack : false
    };

    return {
      scope: {},
      restrict: 'A',
      link: function ($scope, element, attrs) {

        var isStacked = false,
          group = attrs.equalizer,
          settings = attrs.equalizerInit || defaultSettings,
          vals,
          values,
          firstTopOffset,
          elem = element[0];

        vals = group ?
          elem.querySelectorAll('[data-equalizer-watch="'+group+'"], [equalizer-watch="'+group+'"]')
          :
          elem.querySelectorAll('[data-equalizer-watch], [equalizer-watch]')
        ;


        if (vals.length === 0) {
          return;
        }
        values = angular.element(vals);
        settings.before_height_change();
        values.css('height', 'inherit');

        if (settings.equalize_on_stack === false) {

          firstTopOffset = values[0].getBoundingClientRect().top;

          angular.forEach(values, function(val, key) {
            if (val.getBoundingClientRect().top !== firstTopOffset) {
              isStacked = true;
              return false;
            }

          });
          if (isStacked) {
            return;
          }
        }

        var heights = new Array(values.length);
        angular.forEach(values, function(val, key) {
            heights[key] = val.offsetHeight;
        });

        if (settings.use_tallest) {
          var max = Math.max.apply(null, heights);
          values.css('height', max + 'px');
        } else {
          var min = Math.min.apply(null, heights);
          values.css('height', min + 'px');
        }
        settings.after_height_change();
      }
    };
  }]);

/* @TODO implement mqs
 var reflow = function () {
 this.S('[' + this.attr_name() + ']', this.scope).each(function () {
 var $eq_target = $(this),
 media_query = $eq_target.data('equalizer-mq'),
 ignore_media_query = true;

 if (media_query) {
 media_query = 'is_' + media_query.replace(/-/g, '_');
 if (Foundation.utils.hasOwnProperty(media_query)) {
 ignore_media_query = false;
 }
 }

 self.image_loaded(self.S('img', this), function () {
 if (ignore_media_query || Foundation.utils[media_query]()) {
 self.equalize($eq_target)
 } else {
 var vals = $eq_target.find('[' + self.attr_name() + '-watch]:visible');
 vals.css('height', 'auto');
 }
 });
 });
 }
 */
