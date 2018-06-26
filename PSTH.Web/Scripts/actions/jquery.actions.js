// Variables
var $mScroll = $('.ap-scroll'),
		$mClose = $('.ap-btn-close'),
		$termsData = '',
		$termsDataIns = '',
		$card = $('.ap-form--info'),
		$tltip = $('.ap-field-ttip'),
		$tltipvis = 'ap-field-ttip--visible',
		$burguer = $('.ap-btn--burguer'),
		$burguerIcn = $('.ap-hd-icon-menu'),
		$burguerCls = 'ap-hd-icon-menu--is-open',
		$elhead = $('.ap-header'),
		$elnav = $('.ap-hd-nav');

var isFootball = false;

$(function(){
	loader();
	headerAct();
	explorer();
	$('input:checkbox, .ap-sl').uniform();
	ttip();
	formfaces();

	if ($mScroll.length) {
		$mScroll.perfectScrollbar();
	}

	// Show modal
	$(document).on('click', 'a.ap-mol', function (e) {
		e.preventDefault();

		var $link = $(this).attr('href'),
			  $el = $($link),
			  $vis = $('.ap-modal--is-visible');

		$vis.removeClass('ap-modal--is-visible');

		$el.fadeIn(200, function(){
			$el.addClass('ap-modal--is-visible');
		});

		if ($link === '#ap-modal--terms'){
			terms();
		}
		if ($link === '#ap-modal--instructions'){
			termsIns()
		}
	});

	// Close modals
	$mClose.on('click', function (e) {
		e.preventDefault();
		closemodal.call(this);
	});

	$('.ap-modal-close').on('click', function (e) {
		e.preventDefault();
		closeEsc();
	});

	setTimeout(function(){
		he()
	},1000);
});

$(window).smartresize(function(){
  he();
});

$(document).keyup(function (e) {
	if (e.keyCode == 27) {
		e.preventDefault();
		closeEsc();
	}
});

function headerAct() {
	if ($('.ap-hm').is(':visible')) {
		$elhead.addClass('ap-header--home');
	}

	burguer();

	$('.ap-hd-link').on('click', function(){
		returnburguer();
	})
}

function burguer(){
	$burguer.on('click', function(e){
		e.preventDefault();
		$burguerIcn.toggleClass($burguerCls);
		$elnav.toggleClass('ap-hd-nav--is-open');
	});
}

function returnburguer() {
	$elnav.toggleClass('ap-hd-nav--is-open');
	$burguerIcn.toggleClass($burguerCls);
}

function ttip() {
	$tltip.removeClass($tltipvis);
	$card.on('click', function(){
		$tltip.removeAttr('style').removeClass('ap-field-ttip--out').addClass($tltipvis);

		setTimeout(function(){
			closettip();
		},3000);
	});

	$('.ap-ttip-close').on('click', function(e){
		e.preventDefault();
		closettip();
	})

	function closettip() {
		$tltip.toggleClass('ap-field-ttip--visible ap-field-ttip--out').delay(500).fadeOut('1000');
	}
}

function loader() {
	setTimeout(function () {
		if (!isFootball) {
			$('.ap-modal--loading').fadeOut(function(){
				$('.ap-main').removeClass('ap-loading').addClass('ap-main--ready');
				$(this).removeClass('ap-modal--is-visible').removeAttr('style');
			});
		}
	},1000);
}

function closeEsc() {
	$('.ap-overlay').fadeOut(function(){
			$(this).removeClass('ap-modal--is-visible').removeAttr('style');
	});
}

function closemodal() {
	var $la = $(this),
			$parents = $la.parent().parent().parent().parent().parent();

	$parents.fadeOut(500).removeClass('ap-modal--is-visible').removeAttr('style');
}

function explorer() {
	if (/MSIE 9/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
		$('body').addClass('ap-ie')
	}
	if (/Edge/i.test(navigator.userAgent)) {
		$('body').addClass('ap-edge');
	}
	if (/rv:11.0/i.test(navigator.userAgent)) {
		$('body').addClass('ap-ie-11')
	}
}

// Texts
function terms() {
	if ($termsData) {
		$('.ap-modal-terms-data').html($termsData);
	} else {
		  // $.get(route('page.terms.html'), function (data) {
		$.get(('page.terms.html'), function (data) {
			$termsData = data;
			$('.ap-modal-terms-data').html($termsData);
			$mScroll.perfectScrollbar('update');
		});
	}
}

function termsIns() {
	if ($termsDataIns) {
		$('.ap-modal-terms-data').html($termsDataIns);
	} else {
		  // $.get(route('page.instructions.html'), function (data) {
		$.get(('page.instructions.html'), function (data) {
			$termsDataIns = data;
			$('.ap-modal-terms-data').html($termsDataIns);
			$mScroll.perfectScrollbar('update');
		});
	}
}

// img height
function he() {
	var $ed = $('.ap-games--rompecabezas .ap-instructions');

	if (!detectmob()) {
		if ($ed.length) {
			$ed.addClass('ap-instructions--desktop');
		}
	}

	if ($('.ap-hm').is(':visible')) {

		$(window).enllax();

		$('.ap-hd-list').onePageNav({
			currentClass: 'ap-hd-item--active',
			changeHash: false,
			scrollSpeed: 750,
			scrollThreshold: 0.5,
			filter: '',
			easing: 'swing',
			filter: ':not(.ap-hd--anchor)'
		});


		$('.ap-main').addClass('ap-main--home');
		$('html, body').addClass('ap-op');

		$.get(('page.terms.html'), function (data) {
			$termsData = data;
			$('.ap-trms-data').html($termsData);
			$mScroll.perfectScrollbar('update');
		});

		var waypoints = $('#ap-op-prc').waypoint(function(direction) {
				$('.ap-sprt--car-side').toggleClass('ap-sprt--car-side--in');
				$('.ap-header--home').toggleClass('ap-header--home-yell');
			}, {
			offset: '40%'
		});
		hashur();
	}
}

function hashur(){
	$('.ap-op-link-sec').click(function(){
	    $('html, body').animate({
	        scrollTop: $( $(this).attr('href') ).offset().top
	    }, 500);
	    return false;
	});
}

function formfaces() {
	var $ini = 'ap-face--initial',
			$err = 'ap-face--error',
			$ok = 'ap-face--oka',
			$formface = $('.ap-face'),
			$inperr = 'ap-form-txt--error',
			$inpini = 'ap-form-txt--initial',
			$inpok = 'ap-form-txt--oka',
			$faceInpt = $('.ap-form-card');

	if ($faceInpt.hasClass($inpini)) {
		$formface.removeClass($err).removeClass($ok).addClass($ini);

	} else if($faceInpt.hasClass($inperr)) {
		$formface.removeClass($ini).removeClass($ok).addClass($err);

	} else if($faceInpt.hasClass($inpok)) {
		$formface.removeClass($err).removeClass($ini).addClass($ok);
	}
}
