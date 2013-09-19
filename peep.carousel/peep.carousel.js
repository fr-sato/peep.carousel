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
      base.startPosX = base.endPosX = 0;
      base.translateVal = 10;

      base.$elem.css('width', 'auto');
      base.carouselUl.height(base.carouselLi.height());

      base.buildCarousel();
      base.buildNavigation();
      base.setEventType();

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
      var carouselUlWidth = carouselLiWidth * (base.imageSize + base.options.displayImageNum - 1) + paddingPx * 2;

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

    setEventType: function() {
      var base = this;

      var events = {
        start: {
          touch: 'touchstart',
          mouse: 'mousedown'
        },
        move: {
          touch: 'touchmove',
          mouse: 'mousemove'
        },
        end: {
          touch: 'touchend',
          mouse: 'mouseup'
        }
      };

      var agent = navigator.userAgent;
      if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/Android/) != -1) {
        base.eventTypes = 'touch';
      } else {
        base.eventTypes = 'mouse';
      }
      base.eventStart = events.start[base.eventTypes];
      base.eventMove = events.move[base.eventTypes];
      base.eventEnd = events.end[base.eventTypes];

      base.eventListener();
    },

    eventListener: function() {
      var base = this;

      $(document).on(base.eventStart, base.carouselUl, function(e) {
        base.startPosX = e.pageX;
      });

      $(document).on(base.eventEnd, base.carouselUl, function(e) {
        base.endPosX = e.pageX;
        var translateX = base.startPosX - base.endPosX;

        if (translateX < -base.translateVal) {
          base.prev();
        } else if (base.translateVal < translateX) {
          base.next();
        }

        base.startPosX = base.endPosX = 0;
      });
    },

    prev: function() {
      var base = this;

      if (base.count > base.minCount) {
        base.count--;
        var count = base.count - 1;
        var translateWidth = - base.translateXWidth * count;
        base.translateNaviView(translateWidth);
        base.initNaviView(count);
      }

      return false;
    },

    next: function() {
      var base = this;

      if (base.count <= base.maxCount) {
        var translateWidth = - base.translateXWidth * base.count;

        base.initNaviView();
        base.translateNaviView(translateWidth);
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

    translateNaviView: function(translateWidth) {
      var base = this;
      base.carouselUl.css({
        '-webkit-transform' : 'translate3d(' + translateWidth + 'px, 0, 0)',
        '-moz-transform'    : 'translate3d(' + translateWidth + 'px, 0, 0)',
        '-webkit-transition': '-webkit-transform 400ms cubic-bezier(0, 0, 0.25, 1)',
        '-moz-transition'   : '-moz-transform 400ms cubic-bezier(0, 0, 0.25, 1)'
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
