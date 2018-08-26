$(function(){

})

// Detect IE
// Get IE or Edge browser version
var version = detectIE();
// add details to debug result
/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
    // IE 10 or older => return version number
        $('body').addClass('IE');
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        $('body').addClass('IE');
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        $('body').addClass('IE');
    }
}
