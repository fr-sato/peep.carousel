/*
 * peep carousel v0.1
 * Copyright 2013 Kazuya Sato
 */

if (typeof Object.create !== 'function') {
  Object.create = function(obj) {
    function F() {};
      F.prototype = obj;
      return new F();
  };
}

(function($, window, document) {
  var Carousel = {
    init: function(options, el) {
      var base = this;
      base.options = $.extend({}, $.fn.peepCarousel.options, options);
      var elem = el;
      var $elem = $(el);
      base.$elem = $elem;

      base.startUp();
    },

    startUp: function() {
      var base = this;
      base.carouselId = base.$elem.attr('id');
      base.carouselUl = base.$elem.find('ul');
      base.carouselLi = base.carouselUl.find('li');
      base.carouselLiFirst = base.carouselLi.first();
      base.carouselLiLast = base.carouselLi.last();
      base.imageSize = base.carouselLi.find('img').size();
      base.count = base.minCount = 1;
      base.maxCount = parseInt(base.imageSize / base.options.displayImageNum);

      base.$elem.css('width', 'auto');
      base.carouselUl.height(base.carouselLi.height());

      base.buildCarousel();
      base.buildNavigation();

      $(window).resize(function() {
        base.buildCarousel();
      });
    },

    buildCarousel: function() {
      var base = this;
      var windowWidth = $(window).width();
      var paddingPxPercent = base.options.paddingPercent * windowWidth;
      var paddingPx = windowWidth * paddingPxPercent;
      var carouselDisplayWidth = windowWidth - paddingPx * 2;           
      var carouselLiWidth = carouselDisplayWidth / base.options.displayImageNum;     
      var carouselUlWidth = carouselLiWidth * base.imageSize + paddingPx * 2;

      base.translateXWidth = carouselLiWidth * base.options.displayImageNum;          
      base.carouselUl.width(carouselUlWidth);
      base.carouselLi.width(carouselLiWidth);
      base.carouselLiFirst.css('padding-left', paddingPx);
      base.carouselLiLast.css('padding-right', paddingPx);

      base.translateNaviView(base.count - 1);
    },

    buildNavigation: function() {
      var base = this;
      var naviTemplate = '<ul class="carouselNavi"><li class="prev">' + base.options.navigationText[0]+ '</li><li class="next">' + base.options.navigationText[1]+ '</li></ul><ul class="carouselNaviView">';

      for (var i = 0; i <= base.maxCount; i++) {
        if (i == 0) {
          naviTemplate = naviTemplate + '<li class="active"></li>';
        } else {
          naviTemplate = naviTemplate + '<li></li>';
        }
      }
      naviTemplate = naviTemplate + '</ul'>
      base.$elem.append(naviTemplate);
      base.naviViewLi = base.$elem.children('ul.carouselNaviView').find('li');

      $(document).on('tap click', '#' + base.carouselId + ' li.prev', function() {
        base.prev();
      });

      $(document).on('tap click', '#' + base.carouselId + ' li.next', function() {
        base.next();
      });
    },

    prev: function() {
      var base = this;

      if (base.count > base.minCount) {
        base.count--;
        var count = base.count - 1;
        base.translateNaviView(count);
        base.initNaviView(count);
      }

      return false;
    },

    next: function() {
      var base = this;

      if (base.count <= base.maxCount) {
        base.initNaviView();
        base.translateNaviView();
        base.count++;
      }

      return false;
    },

    initNaviView: function(count) {
      var base = this;
      if (typeof count === "undefined") count = base.count;

      base.naviViewLi.removeClass('active');
      base.naviViewLi.eq(count).addClass('active');
    },

    translateNaviView: function(count) {
      var base = this;
      if (typeof count === "undefined") count = base.count;

      var translateWidth = - base.translateXWidth * count;
      base.carouselUl.css({
        '-webkit-transform' : 'translate3d(' + translateWidth + 'px,0,0)',
        '-webkit-transition': '-webkit-transform 400ms cubic-bezier(0,0,0.25,1)'
      });
    }
  };

  $.fn.peepCarousel = function(options) {
    return this.each(function() {
      var carousel = Object.create(Carousel);
      carousel.init(options, this);
    });
  };

  $.fn.peepCarousel.options = {
    displayImageNum : 3,
    paddingPercent  : 0.00015,
    navigationText  : ['前へ', '次へ']
  };
})(Zepto, window, document);
