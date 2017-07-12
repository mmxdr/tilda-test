function t_sldsInit(recid) {
    var el = $('#rec' + recid),
        sliderItem = el.find('.t-slds__item'),
        totalSlides = sliderItem.length,
        firstSlide = sliderItem.filter(':first'),
        lastSlide = sliderItem.filter(':last'),
        windowWidth = $(window).width(),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        stopSlider = sliderWrapper.attr('data-slider-stop');

    if (stopSlider=='true') { return false; }

    var sAgent = window.navigator.userAgent,
        Idx = sAgent.indexOf("MSIE"),
        ieVersion = "",
        oldIE = !1;
    if (Idx > 0) {
        ieVersion = parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
        if (ieVersion == 8 || ieVersion == 9) {
            oldIE = !0
        }
    }
    if (oldIE == !0) {
        sliderWrapper.removeClass('t-slds_animated-fast').removeClass('t-slds_animated-slow').addClass('t-slds_animated-none t-slds_ie').attr('data-slider-correct-height', 'true');
    }

    if (window.$isMobile && sliderWrapper.hasClass('t-slds_animated-none')==true) {
      sliderWrapper.removeClass('t-slds_animated-none').addClass('t-slds_animated-fast')
    }
    
    if (sliderWrapper.attr('data-slider-initialized')=='true') {
      totalSlides = totalSlides-2;
    }

    sliderWrapper.attr('data-slider-initialized', 'true');
    sliderWrapper.attr('data-slider-totalslides', totalSlides);
    sliderWrapper.attr('data-slider-pos', 1);
    sliderWrapper.attr('data-slider-cycle', '');
    sliderWrapper.attr('data-slider-animated', '');
    var pos = sliderWrapper.attr('data-slider-pos');

    if( el.find('.t-slds__item[data-slide-index=0]').length == 0 ) {
      firstSlide.before(lastSlide.clone(!0).attr('data-slide-index', '0'));
    }

    if( el.find('.t-slds__item[data-slide-index='+ (totalSlides + 1) +']').length == 0 ) {
      lastSlide.after(firstSlide.clone(!0).attr('data-slide-index', totalSlides+1).removeClass('t-slds__item_active'));
    }

    t_slds_SliderWidth(recid);
    if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
        t_slds_SliderHeight(recid)
    }
    t_slds_SliderArrowsHeight(recid);
    t_slds_ActiveSlide(recid, pos, totalSlides);
    t_slds_initSliderControls(recid);
    t_slds_ActiveCaption(recid, pos, totalSlides);
    if (sliderWrapper.attr('data-slider-timeout') > 0) {
        t_slds_initAutoPlay(recid)
    }
    if (el.find('.t-slds__item-loaded').length < totalSlides + 2) {
        t_slds_UpdateImages(recid, pos)
    }
    if (sliderWrapper.attr('data-slider-arrows-nearpic') == 'yes') {
        t_slds_positionArrows(recid)
    }
    if (oldIE !== !0) {
        t_slds_initSliderSwipe(recid, windowWidth)
    }
    el.find('.t-slds').css('visibility', '');
    $(window).bind('resize', t_throttle(function() {
        t_slds_SliderWidth(recid);
        t_slideMove(recid);
        t_slds_positionArrows(recid);
    }, 200));
    $(window).load(function() {
        if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
            t_slds_UpdateSliderHeight(recid)
        }
        t_slds_UpdateSliderArrowsHeight(recid)
    })
}

function t_slds_initSliderControls(recid) {
    var el = $('#rec' + recid),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        sliderWidth = el.find('.t-slds__container').width(),
        sliderTransition = sliderWrapper.attr('data-slider-transition'),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider=='true') { return false; }
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth) + 'px, 0, 0)'
    });
    el.find('.t-slds__arrow_wrapper').click(function() {
        var animated = sliderWrapper.attr('data-slider-animated');
        var pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
        var totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides'));
        var cycle = '';
        if (animated == '') {
            sliderWrapper.attr('data-slider-animated', 'yes');
            var direction = $(this).attr('data-slide-direction');
            if (direction === 'left') {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                    pos = 1
                } else {
                    pos--
                }
            } else {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
                    pos = totalSlides
                } else {
                    pos++
                }
            }
            sliderWrapper.attr('data-slider-pos', pos);
            if ((pos == (totalSlides + 1)) || (pos == 0)) {
                cycle = 'yes'
            }
            sliderWrapper.attr('data-slider-cycle', cycle);
            t_slideMove(recid)
        }
        el.trigger('updateSlider');
    });
    el.find('.t-slds__bullet').click(function() {
        var pos = parseFloat($(this).attr('data-slide-bullet-for'));
        sliderWrapper.attr('data-slider-pos', pos);
        t_slideMove(recid);
        el.trigger('updateSlider');
    })
}

function t_slideMove(recid) {
    var el = $('#rec' + recid),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        sliderWidth = el.find('.t-slds__container').width(),
        sliderTransition = parseFloat(sliderWrapper.attr('data-slider-transition')),
        animated = sliderWrapper.attr('data-slider-animated'),
        pos = parseFloat(sliderWrapper.attr('data-slider-pos')),
        totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides')),
        cycle = sliderWrapper.attr('data-slider-cycle'),
        sliderNotAnimated = el.find('.t-slds__items-wrapper').hasClass('t-slds_animated-none'),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider=='true') { return false; }
    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
        el.find('.t-slds__arrow_wrapper-right').fadeOut(300)
    } else {
        el.find('.t-slds__arrow_wrapper-right').fadeIn(300)
    }
    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
        el.find('.t-slds__arrow_wrapper-left').fadeOut(300)
    } else {
        el.find('.t-slds__arrow_wrapper-left').fadeIn(300)
    }
    sliderWrapper.addClass('t-slds_animated');
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
    });
    setTimeout(function() {
        sliderWrapper.removeClass('t-slds_animated');
        sliderWrapper.attr('data-slider-animated', '');
        if (cycle == 'yes') {
            if (pos == (totalSlides + 1)) {
                pos = 1
            };
            if (pos == 0) {
                pos = totalSlides
            };
            sliderWrapper.css({
                transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
            });
            if (sliderNotAnimated!==true) {
                t_slds_ActiveSlide(recid, pos, totalSlides);
            }
            sliderWrapper.attr('data-slider-pos', pos);
        }
        if (window.lazy == 'y') { t_lazyload_update(); }
    }, sliderTransition);
    t_slds_ActiveBullet(recid, pos, totalSlides);
    t_slds_ActiveSlide(recid, pos, totalSlides);
    if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
        t_slds_SliderHeight(recid)
    }
    t_slds_SliderArrowsHeight(recid);
    t_slds_ActiveCaption(recid, pos, totalSlides);
    if (el.find('.t-slds__item-loaded').length < totalSlides + 2) {
        t_slds_UpdateImages(recid, pos);
    }
}

function t_slds_UpdateImages(recid, pos) {
    var el = $('#rec' + recid),
        item = el.find('.t-slds__item[data-slide-index="' + pos + '"]');
    item.addClass('t-slds__item-loaded');
    item.next().addClass('t-slds__item-loaded');
    item.prev().addClass('t-slds__item-loaded');
}

function t_slds_ActiveCaption(recid, pos, totalSlides) {
    var el = $('#rec' + recid),
        caption = el.find('.t-slds__caption'),
        captionActive = el.find('.t-slds__caption[data-slide-caption="' + pos + '"]');
    caption.removeClass('t-slds__caption-active');
    if (pos == 0) {
        captionActive = el.find('.t-slds__caption[data-slide-caption="' + totalSlides + '"]');
    } else if (pos == totalSlides + 1) {
        captionActive = el.find('.t-slds__caption[data-slide-caption="1"]');
    }
    captionActive.addClass('t-slds__caption-active')
}

function t_slds_scrollImages(recid, distance) {
    var el = $('#rec' + recid),
        value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    el.find(".t-slds__items-wrapper").css("transform", "translate3d(" + value + "px, 0, 0)")
}

function t_slds_ActiveBullet(recid, pos, totalSlides) {
    var el = $('#rec' + recid),
        bullet = el.find('.t-slds__bullet'),
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="' + pos + '"]');
    bullet.removeClass('t-slds__bullet_active');
    if (pos == 0) {
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="' + totalSlides + '"]');
    } else if (pos == totalSlides + 1) {
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="1"]');
    }
    bulletActive.addClass('t-slds__bullet_active')
}

function t_slds_ActiveSlide(recid, pos, totalSlides) {
    var el = $('#rec' + recid),
        slide = el.find('.t-slds__item'),
        slideActive = el.find('.t-slds__item[data-slide-index="' + pos + '"]'),
        sliderNotAnimated = el.find('.t-slds__items-wrapper').hasClass('t-slds_animated-none');
    slide.removeClass('t-slds__item_active');
    if (pos == 0 && sliderNotAnimated==false) {
        el.find('.t-slds__item[data-slide-index="' + totalSlides + '"]').addClass('t-slds__item_active')
    } else if (pos == 0 && sliderNotAnimated==true) {
        slideActive = el.find('.t-slds__item[data-slide-index="' + totalSlides + '"]')
    } else if (pos == totalSlides + 1 && sliderNotAnimated==false) {
        el.find('.t-slds__item[data-slide-index="' + 1 + '"]').addClass('t-slds__item_active');
    } else if (pos == totalSlides + 1 && sliderNotAnimated==true) {
        slideActive = el.find('.t-slds__item[data-slide-index="1"]')
    }
    slideActive.addClass('t-slds__item_active')
}

function t_slds_SliderWidth(recid) {
    var el = $('#rec' + recid),
        sliderWidth = el.find('.t-slds__container').width(),
        totalSlides = el.find('.t-slds__item').length,
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider=='true') { return false; }
    el.find('.t-slds__items-wrapper').width(sliderWidth * totalSlides);
    el.find('.t-slds__item').width(sliderWidth)
}

function t_slds_SliderHeight(recid) {
    var el = $('#rec' + recid);
    el.find('.t-slds__items-wrapper').height(el.find('.t-slds__item_active').height())
}

function t_slds_UpdateSliderHeight(recid) {
    var el = $('#rec' + recid);
    el.find('.t-slds__items-wrapper').css('height', '');
    el.find('.t-slds__items-wrapper').height(el.find('.t-slds__item_active').height())
}

function t_slds_SliderArrowsHeight(recid) {
    var el = $('#rec' + recid);
    el.find('.t-slds__arrow_wrapper').height(el.find('.t-slds__item_active').height())
}

function t_slds_UpdateSliderArrowsHeight(recid) {
    var el = $('#rec' + recid);
    el.find('.t-slds__arrow_wrapper').css('height', '');
    el.find('.t-slds__arrow_wrapper').height(el.find('.t-slds__item_active').height())
}

function t_slds_initAutoPlay(recid) {
    var el = $('#rec' + recid),
        sliderContainer = el.find('.t-slds'),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        sliderTimeOut = parseFloat(sliderWrapper.attr('data-slider-timeout')),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider=='true') { return false; }
    sliderContainer.hover(function(e) {
        sliderWrapper.attr('data-slider-hovered', 'yes')
    }, function(e) {
        sliderWrapper.attr('data-slider-hovered', '')
    });
    setInterval(function() {
        var wst = $(window).scrollTop();
        var wh = $(window).height();
        var eot = el.offset().top;
        var eih = el.innerHeight();
        var hovered = sliderWrapper.attr('data-slider-hovered');
        var ignorehover = sliderWrapper.attr('data-slider-autoplay-ignore-hover');
        if (((wst + wh / 2) > eot) && ((eot + eih) > wst) && hovered != 'yes' && ignorehover != 'yes') {
            el.find('.t-slds__arrow_wrapper-right').trigger('click')
        }
    }, sliderTimeOut)
}

function t_slds_positionArrows(recid) {
    var el = $("#rec" + recid);
    container = el.find(".t-slds__arrow_container-outside"), inner = el.find(".t-slds__item").width(), arrowleft = el.find(".t-slds__arrow-left").width(), arrowright = el.find(".t-slds__arrow-right").width();
    container.css({
        'max-width': (arrowleft + arrowright + inner + 120 + 'px')
    })
}

function t_slds_initSliderSwipe(recid, windowWidth) {
    var el = $('#rec' + recid);
    var isScrolling = !1;
    var timeout,
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider=='true') { return false; }
    delete Hammer.defaults.cssProps.userSelect;
    hammer = new Hammer(el.find('.t-slds__items-wrapper')[0], {
        domEvents: !0,
        threshold: 0,
        inputClass: Hammer.TouchInput,
        recognizers: [
            [Hammer.Pan, {
                direction: Hammer.DIRECTION_HORIZONTAL
            }]
        ]
    });
    $(window).bind('scroll', function() {
        isScrolling = !0;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            isScrolling = !1
        }, 250)
    });
    hammer.on('pan', function(event) {
        if (isScrolling) {
            return
        }
        var sliderWidth = el.find('.t-slds__container').width(),
            sliderWrapper = el.find('.t-slds__items-wrapper'),
            pos = parseFloat(sliderWrapper.attr('data-slider-pos')),
            totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides')),
            cycle = '',
            distance = event.deltaX,
            percentage = 100 / totalSlides * event.deltaX / $(window).innerWidth(),
            sensitivity = 20,
            stopSlider = sliderWrapper.attr('data-slider-stop');
        if (stopSlider=='true') { return false; }
        t_slds_scrollImages(recid, (sliderWidth * pos) - distance);
        if (event.isFinal) {
            if (event.velocityX > 1) {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                    pos = 1
                } else {
                    pos--
                }
                sliderWrapper.attr('data-slider-pos', pos);
                if (pos == 0) {
                    cycle = 'yes'
                }
                sliderWrapper.attr('data-slider-cycle', cycle);
                t_slideMove(recid)
            } else if (event.velocityX < -1) {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
                    pos = totalSlides
                } else {
                    pos++
                }
                sliderWrapper.attr('data-slider-pos', pos);
                if (pos == (totalSlides + 1)) {
                    cycle = 'yes'
                }
                sliderWrapper.attr('data-slider-cycle', cycle);
                t_slideMove(recid)
            } else {
                if (percentage <= -(sensitivity / totalSlides)) {
                    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
                        pos = totalSlides
                    } else {
                        pos++
                    }
                    sliderWrapper.attr('data-slider-pos', pos);
                    if (pos == (totalSlides + 1)) {
                        cycle = 'yes'
                    }
                    sliderWrapper.attr('data-slider-cycle', cycle);
                    t_slideMove(recid)
                } else if (percentage >= (sensitivity / totalSlides)) {
                    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                        pos = 1
                    } else {
                        pos--
                    }
                    sliderWrapper.attr('data-slider-pos', pos);
                    if (pos == 0) {
                        cycle = 'yes'
                    }
                    sliderWrapper.attr('data-slider-cycle', cycle);
                    t_slideMove(recid)
                } else {
                    t_slideMove(recid)
                }
            }
        }
    })
}