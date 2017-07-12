function t_initZoom() {
  // if ($('[data-zoomable="yes"]').length) {
  //   $('[data-zoomable="yes"]').addClass("t-zoomable");
  //   $("body").append('<div class="t-zoomer__wrapper">\
  //     <div class="t-zoomer__container">\
  //     </div>\
  //     <div class="t-zoomer__close">\
  //       <div class="t-zoomer__close-line t-zoomer__close-line-first"></div>\
  //       <div class="t-zoomer__close-line t-zoomer__close-line-second"></div>\
  //     </div>\
  //   </div>');
  //   t_showZoom();
  // }

  t_sldsInit('zoom');

$('.zcontainer').each(function(index) {
  var container = $(this);
  var image = $(this).find('.zimg');
  var imageW = image.width();
  var imageH = image.height();
  var maxW = container.width();
  var maxH = container.height();
  var ratio = imageH/imageW;
  var containerRatio = maxH/maxW;
  var allowZoom = false;
  if (imageW > maxW || imageH > maxH) {
    var scale = Math.min(maxW / imageW, maxH / imageH);
    allowZoom = true;
  } else {
    var scale = 1;
  }
  var currentW = Math.round(imageW*scale);
  var currentH = Math.round(imageH*scale);

  image.width(imageW).height(imageH);

  image.css({
    transform: 'translate3d(-50%, -50%, 0) scale(' + scale + ')'
  });

  var containerOffsetX = container.offset().left;
  var containerOffsetY = container.offset().top;
  var imgOffsetX = image.offset().left;
  var imgOffsetY = image.offset().top;
  var offsetX = Math.round(imgOffsetX - containerOffsetX);
  var offsetY = Math.round(imgOffsetY - containerOffsetY);
  if (allowZoom) {
    image.one( "click", function(e) {
      $(this).addClass('zimg-animated');
      var el = $(this);
      var clickX = e.pageX - containerOffsetX - offsetX;
      var clickY = e.pageY - containerOffsetY - offsetY;
      var percentX = Math.round(clickX*100/currentW);
      var percentY = Math.round(clickY*100/currentH);
      if (imageW>maxW) {
        var width = maxW;
      } else {
        var width = imageW;
      }
      if (imageH>maxH) {
        var height = maxH;
      } else {
        var height = imageH;
      }
      var percentMaxX = 100 - Math.round(width*100/imageW)/2;
      var percentMinX = Math.round(width*100/imageW)/2;
      var percentMaxY = 100 - Math.round(height*100/imageH)/2;
      var percentMinY = Math.round(height*100/imageH)/2;

      if (percentX>percentMaxX) {percentX=percentMaxX}
      if (percentX<percentMinX) {percentX=percentMinX}
      if (percentY>percentMaxY) {percentY=percentMaxY}
      if (percentY<percentMinY) {percentY=percentMinY}

      $(this).css({
        transform: 'translate3d(-' + percentX + '%, -' + percentY + '%, 0) scale(1)'
      });

      t_initZoomDrag(el, percentX, percentY, percentMaxX, percentMinX, percentMaxY, percentMinY, scale);
    })
  }
  });
}

function t_initZoomDrag(el, percentX, percentY, percentMaxX, percentMinX, percentMaxY, percentMinY, scale) {
  var hammer = new Hammer(el[0], {
      domEvents: !0,
      threshold: 0,
      recognizers: [
          [Hammer.Pan, {
              direction: Hammer.DIRECTION_ALL
          }],
          [Hammer.Tap]
      ]
  });
  hammer.on('pan', handleDrag).on('tap', stopDrag);
  var lastPosX = percentX;
  var lastPosY = percentY;
  var isDragging = false;
  function handleDrag(ev) {
    var elem = ev.target;
    if ( ! isDragging ) {
      isDragging = true;
      el.removeClass('zimg-animated');
    }
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    var percentX = (ev.deltaX / $('.zcontainer').width() * 100)-lastPosX;
    var percentY = (ev.deltaY / $('.zcontainer').width() * 100)-lastPosY;

    elem.style.transform = 'translate3d('+percentX+'%, '+percentY+'%, 0px) scale(1)';
    console.log(posX)
    
    if (ev.isFinal) {
      isDragging = false;
      el.addClass('zimg-animated');
      if (-percentX>percentMaxX) {percentX=-percentMaxX}
      if (-percentX<percentMinX) {percentX=-percentMinX}
      if (-percentY>percentMaxY) {percentY=-percentMaxY}
      if (-percentY<percentMinY) {percentY=-percentMinY}
      elem.style.transform = 'translate3d('+percentX+'%, '+percentY+'%, 0px) scale(1)';
      lastPosX = -percentX;
      lastPosY = -percentY;
    }
  }
  function stopDrag(ev) {
    var elem = ev.target;
    elem.style.transform = 'translate3d(-50%, -50%, 0px) scale('+scale+')';
    hammer.off('pan', handleDrag).off('tap', stopDrag);
  }
}

function t_showZoom() {
    $('.t-zoomable').click(function(e) {
        $("body").addClass("t-zoomer__show");
        $(".t-zoomer__container").html('<div class="t-carousel__zoomed">\
      <div class="t-carousel__zoomer__slides">\
        <div class="t-carousel__zoomer__inner">\
        </div>\
        <div class="t-carousel__zoomer__control t-carousel__zoomer__control_left" data-zoomer-slide="prev">\
          <div class="t-carousel__zoomer__arrow__wrapper t-carousel__zoomer__arrow__wrapper_left">\
            <div class="t-carousel__zoomer__arrow t-carousel__zoomer__arrow_left t-carousel__zoomer__arrow_small"></div>\
          </div>\
        </div>\
        <div class="t-carousel__zoomer__control t-carousel__zoomer__control_right" data-zoomer-slide="next">\
          <div class="t-carousel__zoomer__arrow__wrapper t-carousel__zoomer__arrow__wrapper_right">\
            <div class="t-carousel__zoomer__arrow t-carousel__zoomer__arrow_right t-carousel__zoomer__arrow_small"></div>\
          </div>\
        </div>\
      </div>\
    </div>');
        var id = $(this).closest(".r").attr("id"),
            images = $("#" + id + "").find(".t-zoomable");
        images.each(function() {
            var images_urls = $(this).attr('data-img-zoom-url').split(',');
            if ($(this).is("img")) {
                var imgdescr = $(this).attr('alt')
            }
            if ($(this).is("div")) {
                var imgdescr = $(this).attr('title')
            }
            images_urls.forEach(function() {
                if (typeof imgdescr !== "undefined" && imgdescr !== !1) {
                    $(".t-carousel__zoomer__inner").append("<div class=\"t-carousel__zoomer__item\"><div class=\"t-carousel__zoomer__wrapper\"><img class=\"t-carousel__zoomer__img\" src=\"" + images_urls + "\"></div><div class=\"t-zoomer__comments\"><div class=\"t-zoomer__descr t-descr t-descr_xxs\">" + imgdescr + "</div></div></div>")
                } else {
                    $(".t-carousel__zoomer__inner").append("<div class=\"t-carousel__zoomer__item\"><div class=\"t-carousel__zoomer__wrapper\"><img class=\"t-carousel__zoomer__img\" src=\"" + images_urls + "\"></div><div class=\"t-zoomer__comments\"></div></div>")
                }
            })
        });
        var image_descr = $(".t-carousel__zoomer__item");
        image_descr.each(function() {
            $(this).css("display", "block");
            var height = $(this).find(".t-zoomer__comments").height();
            $(this).css("display", "");
            var image_active = $(this).find(".t-carousel__zoomer__wrapper");
            image_active.css("bottom", height)
        });
        var target_url = $(this).attr("data-img-zoom-url"),
            target_img = $(".t-carousel__zoomer__img[src=\"" + target_url + "\"]"),
            slideItem = $(".t-carousel__zoomer__item"),
            target = target_img.closest(slideItem);
        target.show(0);
        slideItem.each(function() {
            $(this).attr("data-zoomer-slide-number", $(this).index())
        });


       

        $('.t-zoomer__close, .t-zoomer__bg').click(function(e) {
            $('body').removeClass("t-zoomer__show");
            $('body').removeClass("t-zoomer__show_fixed");
            $(document).unbind('keydown')
        })

        pos = $(".t-carousel__zoomer__item:visible").attr("data-zoomer-slide-number");
        $('.t-carousel__zoomer__control_right').click(function() {
            pos = (pos + 1) % slideItem.length;
            slideItem.hide(0).eq(pos).show(0)
        });
        $('.t-carousel__zoomer__control_left').click(function() {
            pos = (pos - 1) % slideItem.length;
            slideItem.hide(0).eq(pos).show(0)
        });
        $(document).keydown(function(e) {
            if (e.keyCode == 37) {
                pos = (pos - 1) % slideItem.length;
                slideItem.hide(0).eq(pos).show(0)
            }
            if (e.keyCode == 39) {
                pos = (pos + 1) % slideItem.length;
                slideItem.hide(0).eq(pos).show(0)
            }
            if (e.keyCode == 27) {
                $('body').removeClass("t-zoomer__show");
                $('body').removeClass("t-zoomer__show_fixed");
                $(document).unbind('keydown')
            }
        });
        var defaultSwipe;
        $(".t-carousel__zoomer__inner").bind('touchstart', function(e) {
            defaultSwipe = e.originalEvent.touches[0].clientX
        });
        $(".t-carousel__zoomer__inner").bind('touchend', function(e) {
            var swiped = e.originalEvent.changedTouches[0].clientX;
            if (defaultSwipe > swiped + 50) {
                pos = (pos - 1) % slideItem.length;
                slideItem.hide(0).eq(pos).show(0)
            } else if (defaultSwipe < swiped - 50) {
                pos = (pos + 1) % slideItem.length;
                slideItem.hide(0).eq(pos).show(0)
            }
        });
        var slides_count = $(".t-carousel__zoomer__item").size();
        if (slides_count > 1) {
            $('body').addClass("t-zoomer__show_fixed")
        } else {
            $(".t-carousel__zoomer__control").css("display", "none")
        }
        $('.t-carousel__zoomer__inner').click(function(e) {
            $('body').removeClass("t-zoomer__show");
            $('body').removeClass("t-zoomer__show_fixed");
            $(document).unbind('keydown')
        });
        var lastScrollTop = 0;
        $(window).scroll(function(event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                $('body').not('.t-zoomer__show_fixed').removeClass("t-zoomer__show");
                $(document).unbind('keydown')
            }
            lastScrollTop = st
        })
    })
}

$(document).ready(function() {
    setTimeout(function() {
        t_initZoom()
    }, 500)
})