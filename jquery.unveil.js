/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;
(function ($) {

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    $.fn.unveil = function (opts, callback) {

        var opts = opts || {};

        var $w = $(window),
            th = opts.threshold || 0,
            delay = opts.delay || 0,
            retina = window.devicePixelRatio > 1,
            attrib = retina ? "data-src-retina" : "data-src",
            images = this,
            loaded;

        this.one("unveil", function () {
            var source = this.getAttribute(attrib);
            source = source || this.getAttribute("data-src");
            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            debounce(function () {
                var inview = images.filter(function () {
                    var $e = $(this);
                    if ($e.is(":hidden")) return;

                    var wt = $w.scrollTop(),
                        wb = wt + $w.height(),
                        et = $e.offset().top,
                        eb = et + $e.height();

                    return eb >= wt - th && et <= wb + th;
                });
                
                loaded = inview.trigger("unveil");
                images = images.not(loaded);
            },delay)();
        }

        $w.on("scroll.unveil resize.unveil lookup.unveil",unveil);

        unveil();

        return this;

    };

})(window.jQuery || window.Zepto);
