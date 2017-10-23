
function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {return true}

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {return true;}

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {return true;}

    return false;
}

(function () {
    rotatingSlider = function (selector, options) {

        function initSingleSlider($el, options) {
            var $cube, $rotaters,
                $handle, $handleItems,
                autoRotate, numOfAds,
                angle, currentAngle = 0,
                prefix = ".ad-slide__",
                handlePrefix = prefix + "handle__",
                rotating = false;

            /*
             * Some global options
             */
            var defaultOptions = {
                xRotation: false,
                speed: 500,
                dragSpeedCoef: 0.7,
                handleSpeedCoef: 6,
                easing: "cubic-bezier(0.7, 0.28, 0.65, 0.96)",
                persMult: 1.6,
                handlePersMult: 3,
                scrollRotation: true,
                globalDragRotation: false,
                withControls: true,
                handleAndGlobalDrag: false,
                allowDragDuringAnim: false,
                allowScrollDuringAnim: false,
                allowControlsDuringAnim: false
            };

            var __opts = $.extend(defaultOptions, options);
            var axis = (__opts.xRotation) ? "Y" : "X";
            var angleMult = (__opts.xRotation) ? 1 : -1;

            function handleActiveItem() {
                if (!__opts.withControls) return;
                $handleItems.removeClass("active");
                var a = currentAngle % 360 / angle;
                if (a < 0) a = numOfAds + a;
                if (a > 0) a = a + 1;
                if (!a) a = 1;
                $handleItems.eq(a - 1).addClass("active");
            }

            /*
             * Controls the animation,  rotates the cube and fixes interval when the tab is inactive
             */
            function rotateCube(delta) {
                $cube = $(".ad-slide");
                var $items = $(prefix + "item", $cube);
                numOfAds = $items.length;
                angle = 360 / numOfAds;
                var s = (__opts.xRotation) ? $cube.width() : $cube.height();
                var depth = s / 2 / Math.tan(angle / 2 * Math.PI / 180);
                var $inner = $(prefix + "inner", $cube);

                // Interval fix if cube rotates for too long
                if (currentAngle >= (numOfAds * angle) - angle) {
                    var newAngle = 0
                } else {
                    newAngle = currentAngle + angle * delta
                }

                // Do the animations (rotate and scale smaller then scale back to normal)
                $inner.css({
                    'transform': "translateZ(-" + depth + "px) scale(.7)",
                    "transition": "transform " + __opts.speed / 1000 + "s " + __opts.easing
                });

                $rotaters.css({
                    "transform": "rotate" + axis + "(" + (newAngle * angleMult * -1) + "deg)",
                    "transition": "transform " + __opts.speed / 1000 + "s " + __opts.easing
                });
                currentAngle = newAngle;

                setTimeout(function () {
                    $rotaters.css({
                        "transform": "rotate" + axis + "(" + (newAngle * angleMult * -1) + "deg)"
                    });
                    $inner.css("transform", "translateZ(-" + depth + "px) scale(1)");
                    handleActiveItem();
                    rotating = false;
                }, __opts.speed);
            }

            // These two are used for the controllers, interval and the handlers
            function navigateUp() {
                rotateCube(-1);
            }

            function navigateDown() {
                rotateCube(1);
            }

            /*
             * Rotates the cube when pointer is not hovered
             */
            autoRotate = setInterval(navigateDown, 3000);
            $(document).on('mouseover', function () {
                clearInterval(autoRotate);
            });
            $(document).on('mouseout', function () {
                autoRotate = setInterval(navigateDown, 3000);
            });

            function scrollHandler(e) {
                if (rotating && !__opts.allowScrolluringAnim) return;
                rotating = true;
                var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                if (delta > 0) {
                    navigateUp();
                } else if (delta < 0) {
                    navigateDown();
                }
            }


            /*
             * Adds necessary attributes and behaviours to the tags of the controllers buttons
             */
            function initControls() {
                var $controls = $(prefix + "controls");
                $handle = $(prefix + "handle", $cube);
                var $handleInner = $(handlePrefix + "inner", $handle);
                $handleItems = $(handlePrefix + "item", $handle);
                var s = (__opts.xRotation) ? $handle.width() : $handle.height();
                var pers = s * __opts.handlePersMult;
                depth = s / 2 / Math.tan(angle / 2 * Math.PI / 180);

                $cube.addClass("with-controls");
                $handle.css({
                    "-webkit-perspective": pers + "px",
                    "perspective": pers + "px"
                })
                    .addClass("js-handle");
                $handleInner.css("transform", "translateZ(-" + depth + "px)");

                if (__opts.xRotation) $controls.addClass("m--xAxis");

                $handleItems.each(function (index) {
                    $(this).css("transform", "rotate" + axis + "(" + (index * angle * angleMult) + "deg) translateZ(" + depth + "px)");
                });

                $rotaters = $(prefix + "rotater, " + handlePrefix + "rotater", $cube);

                $(document).on("click", ".ad-slide__control", function () {
                    if (rotating && !__opts.allowControlsDuringAnim) return;
                    rotating = true;
                    if ($(this).hasClass("m--up")) {
                        navigateUp();
                    } else {
                        navigateDown();
                    }
                });
            }

            /*
             * Adds necessary attributes and behaviours to the tags of the cube
             */
            function initSlider($el) {
                $cube = $el;
                var $wrapper = $(prefix + "wrapper", $cube);
                var $inner = $(prefix + "inner", $cube);
                var $items = $(prefix + "item", $cube);
                numOfAds = $items.length;
                angle = 360 / numOfAds;
                var s = (__opts.xRotation) ? $cube.width() : $cube.height();
                var pers = s * __opts.persMult;
                depth = s / 2 / Math.tan(angle / 2 * Math.PI / 180);

                $wrapper.css({
                    "-webkit-perspective": pers + "px",
                    "perspective": pers + "px"
                });
                $inner.css("transform", "translateZ(-" + depth + "px)");

                $items.each(function (index) {
                    $(this).css("transform", "rotate" + axis + "(" + (index * angle * angleMult) + "deg) translateZ(" + depth + "px)");
                });

                $cube.addClass("slider-ready");

                $rotaters = $(prefix + "rotater", $cube);

                if (__opts.scrollRotation) {
                    $cube.on("mousewheel DOMMouseScroll", scrollHandler);
                }
                if (__opts.withControls) {
                    initControls();
                }

            }

            initSlider($el);

        }

        function globalInit() {
            $(selector).each(function () {
                initSingleSlider($(this), options);
            });
        }

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

        var resizeFn = debounce(function () {
            globalInit();
        }, 100);

        $(window).on("resize", resizeFn);

        globalInit();

    };
    window.rotatingSlider = rotatingSlider;

}());

if(window.location.origin != 'https://eghaemi.github.io'){
    var $body = document.getElementsByTagName('body')[0].textContent = '';
}

$(document).ready(function () {
    // If it's IE/Edge then die
    if (!detectIE()) {
        rotatingSlider(".ad-slide", {xRotation: false, globalDragRotation: true});
    } else {
        $(".cover").css('opacity', '1');
        $(".title").css({
            'background': 'linear-gradient(to top, rgb(255, 255, 255) , #fff)',
            'border': '1px solid #555'
        });
    }
});
