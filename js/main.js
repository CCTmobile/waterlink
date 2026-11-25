(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(window).width() > 992) {
            if ($(this).scrollTop() > 45) {
                $('.sticky-top .container').addClass('shadow-sm').css('max-width', '100%');
            } else {
                $('.sticky-top .container').removeClass('shadow-sm').css('max-width', $('.topbar .container').width());
            }
        } else {
            $('.sticky-top .container').addClass('shadow-sm').css('max-width', '100%');
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: false,
        loop: true,
        margin: 0,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });



    // Project carousel
    $(".project-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : false,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });

    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : false,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Global WhatsApp float widget
    var waWidget = '<a href="https://wa.me/27784693135" class="whatsapp-float" target="_blank" aria-label="Chat with us on WhatsApp"><i class="fab fa-whatsapp"></i></a>';
    $('body').append(waWidget);

    // Scroll-driven camera hero (index.html). One rAF loop writes styles directly.
    var stage = document.getElementById('wl-stage');
    if (stage) {
        document.documentElement.classList.add('wl-stage-page');

        var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };
        var range = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };
        var smooth = function (t) { return t * t * (3 - 2 * t); };
        var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
        var lerp = function (a, b, t) { return a + (b - a) * t; };

        var layers = {
            site: stage.querySelector('[data-layer="site"]'),
            rig: stage.querySelector('[data-layer="rig"]'),
            water: stage.querySelector('[data-layer="water"]')
        };
        var copy = stage.querySelector('.wl-stage__copy');
        var cue = stage.querySelector('.wl-stage__cue');
        var veil = stage.querySelector('.wl-stage__veil');
        var hud = stage.querySelector('.wl-stage__hud');
        var fill = stage.querySelector('.wl-stage__track span');
        var cam = stage.querySelector('[data-stage-cam]');
        var label = stage.querySelector('[data-stage-label]');
        var title = stage.querySelector('[data-stage-title]');
        var lede = stage.querySelector('[data-stage-lede]');

        // Beats: 0.00-0.32 survey, 0.32-0.63 drilling, 0.63-1.00 supply.
        var beats = [
            { cam: 'CAM 01 / SURVEY', label: '01 / SURVEY · GAUTENG', title: 'We find the water.', lede: 'Geophysical surveys and yield testing locate a dependable aquifer before a single metre is drilled.' },
            { cam: 'CAM 02 / DRILLING', label: '02 / DRILLING · BWA STANDARDS', title: 'We drill the borehole.', lede: 'Percussion rigs cut through Gauteng rock. Casing and sanitary seals go in as the hole comes down.' },
            { cam: 'CAM 03 / SUPPLY', label: '03 / SUPPLY · TAP READY', title: 'We keep it flowing.', lede: 'Submersible pumps, JoJo storage and purification carry clean water from the borehole to the tap.' }
        ];

        var setLayer = function (el, y, scale, opacity) {
            el.style.transform = 'translate3d(0,' + y + 'vh,0) scale(' + scale + ')';
            el.style.opacity = String(opacity);
        };

        var step = -1;
        var last = -1;
        var render = function (p) {
            var settle = smooth(range(p, 0, 0.36));
            var rise = easeOut(range(p, 0.26, 0.55));
            var approach = smooth(range(p, 0.58, 0.76));
            var rigOut = range(p, 0.6, 0.78);
            var exit = range(p, 0.86, 1);

            setLayer(layers.site, lerp(0, -6, p), lerp(1.08, 1.18, settle), 1 - range(p, 0.28, 0.42));
            setLayer(layers.rig, lerp(8, 0, rise) - rigOut * 10, lerp(1.28, 1.04, rise) + rigOut * 0.08, smooth(range(p, 0.26, 0.42)) * (1 - rigOut));
            setLayer(layers.water, lerp(10, 0, approach) - exit * 100, lerp(1.24, 1.02, approach), approach);

            copy.style.opacity = String(1 - range(p, 0.84, 0.96));
            copy.style.transform = 'translate3d(0,' + (-p * 4) + 'vh,0)';
            cue.style.opacity = String(1 - range(p, 0, 0.08));
            hud.style.opacity = String(1 - range(p, 0.84, 0.96));
            veil.style.opacity = String(1 - range(p, 0.78, 0.88));
            fill.style.width = (p * 100).toFixed(2) + '%';

            var next = p < 0.32 ? 0 : p < 0.63 ? 1 : 2;
            if (next !== step) {
                step = next;
                cam.textContent = beats[step].cam;
                label.textContent = beats[step].label;
                title.textContent = beats[step].title;
                lede.textContent = beats[step].lede;
            }
        };

        var update = function () {
            var rect = stage.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                var p = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight), 0, 1);
                if (Math.abs(p - last) > 0.00005) {
                    last = p;
                    render(p);
                }
            }
        };

        var queued = false;
        var schedule = function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(function () {
                queued = false;
                update();
            });
        };

        render(0);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
    }

})(jQuery);
