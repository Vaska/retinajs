(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd ? define(factory) : (global.retinajs = factory());
})(this, function() {
  'use strict';

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
            typeof Symbol === 'function' &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };
  var hasWindow = typeof window !== 'undefined';
  var environment = Math.round(hasWindow ? window.devicePixelRatio || 1 : 1);
  var srcReplace = /(\.[A-z]{3,4}\/?(\?.*)?)$/;
  var inlineReplace = /url\(('|")?([^)'"]+)('|")?\)/i;
  var selector = '[data-rjs]';
  var processedAttr = 'data-rjs-processed';
  function arrayify(object) {
    return Array.prototype.slice.call(object);
  }
  function chooseCap(cap) {
    var numericCap = parseInt(cap, 10);
    if (environment < numericCap) {
      return environment;
    } else {
      return numericCap;
    }
  }
  function forceOriginalDimensions(image) {
    if (!image.hasAttribute('data-no-resize')) {
      if (image.offsetWidth === 0 && image.offsetHeight === 0) {
        image.setAttribute('width', image.naturalWidth);
        image.setAttribute('height', image.naturalHeight);
      } else {
        image.setAttribute('width', image.offsetWidth);
        image.setAttribute('height', image.offsetHeight);
      }
    }
    return image;
  }
  function setSourceIfAvailable(image, retinaURL) {
    var imgType = image.nodeName.toLowerCase();
    var testImage = document.createElement('img');
    testImage.addEventListener('load', function() {
      if (imgType === 'img') {
        forceOriginalDimensions(image).setAttribute('src', retinaURL);
      } else {
        image.style.backgroundImage = 'url(' + retinaURL + ')';
      }
    });
    testImage.setAttribute('src', retinaURL);
    image.setAttribute(processedAttr, true);
  }
  function dynamicSwapImage(image, src) {
    var rjs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var cap = chooseCap(rjs);
    if (src && cap > 1) {
      var newSrc = src.replace(srcReplace, '@' + cap + 'x$1');
      setSourceIfAvailable(image, newSrc);
    }
  }
  function manualSwapImage(image, src, hdsrc) {
    var cap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    if (environment > cap) {
      setSourceIfAvailable(image, hdsrc);
    }
  }
  function getImages(images) {
    if (!images) {
      return typeof document !== 'undefined' ? arrayify(document.querySelectorAll(selector)) : [];
    } else {
      return typeof images.forEach === 'function' ? images : arrayify(images);
    }
  }
  function cleanBgImg(img) {
    return img.style.backgroundImage.replace(inlineReplace, '$2');
  }
  function retina(images) {
    getImages(images).forEach(function(img) {
      if (!img.getAttribute(processedAttr)) {
        var isImg = img.nodeName.toLowerCase() === 'img';
        var src = isImg ? img.getAttribute('src') : cleanBgImg(img);
        var rjs = img.getAttribute('data-rjs');
        var rjsIsNumber = !isNaN(parseInt(rjs, 10));
        var rjsIsArray =
          !rjsIsNumber && (typeof rjs === 'undefined' ? 'undefined' : _typeof(rjs)) === 'object';
        if (rjs === null) {
          return;
        }
        if (rjsIsNumber) {
          dynamicSwapImage(img, src, rjs);
        } else if (rjsIsArray) {
          rjsIsArray.forEach(function(cap, rjsSrc) {
            manualSwapImage(img, src, rjsSrc, cap);
          });
          manualSwapImage(img, src, rjs);
        } else {
          manualSwapImage(img, src, rjs);
        }
      }
    });
  }
  if (hasWindow) {
    window.addEventListener('load', function() {
      retina();
    });
    window.retinajs = retina;
  }

  return retina;
});
//# sourceMappingURL=retina.js.map
