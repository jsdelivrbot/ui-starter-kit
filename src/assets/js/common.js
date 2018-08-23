$(function(){
	// header js 
    $('.hf-btn-search').on("click",function(){
        $(this).toggleClass("active");
        $(this).parents(".hf-main-header").toggleClass("active-search");
    }) 
    // Add fixed for header
    $(window).on("load scroll", function () {
        if( $(window).scrollTop() >0){
            if(!$('.hf-header--opt01').hasClass('fixed')){
                $('.hf-header--opt01').addClass('fixed');
                $('body').addClass("hf-header-fixed");
            }
        } else {
            $('.hf-header--opt01').removeClass('fixed');
            $('body').removeClass("hf-header-fixed");
        }
    }); 
    // scollbar product sub header
    $(window).on("load",function(){
        $(".hf-sub-product-list").mCustomScrollbar({
            mouseWheel:{ preventDefault: true }
        });
    });

    // click show nearby location
    $('.hf-find-place').on("click", function(e){
        e.preventDefault();
        if($('.hf-place-list').hasClass("active")==false) {
            $(this).find(".hf-text-01").removeClass("active");
            $(this).find(".hf-loading").addClass("active");
            setTimeout(function(){
                $('.hf-find-place').find(".hf-loading").removeClass("active");
                $('.hf-find-place').find(".hf-place-list").addClass("active");
            },2000);
        }
    });

    //  click collapse menu mobile list
    $('.hf-main-nav .hf-btn-collapse').on("click",function (e) {
        e.preventDefault();
        $(this).parents(".hf-menu-item").toggleClass("active");
    })
    // hamburger button
    $(".hf-btn-hamburger").on("click",function(e){
        e.preventDefault();
        $(".hf-btn-hamburger").toggleClass("active");
        $('body').toggleClass("hf-menu-active");
        $('body').append('<div class="hf-header-backdrop"></div>');
    })
    $(document).on("click",".hf-header-backdrop", function(e){
        e.preventDefault();
        $(this).remove();
        $(".hf-btn-hamburger").removeClass("active");
        $('body').removeClass("hf-menu-active");
    })
    // click play video
    $(document).on("click",'.hf-video-cover .hf-btn-play', function (e) {
        e.preventDefault();
        if($(this).parents(".hf-video").hasClass("hf-play")){
            $(this).parents(".hf-video").removeClass("hf-play");
        }else {
            $(this).parents(".hf-video").addClass("hf-play");
            var attrID = $(this).parents(".hf-video").find('iframe');
            $(attrID)[0].src += "&autoplay=1";
        }
    })
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