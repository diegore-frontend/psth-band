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

$(function () {
	loader();
	explorer();
	$('input:checkbox, .ap-sl').uniform();

	$(document).on('click', 'a#view', function (e) {
		$('article#ap-modal--video').fadeIn(200, function () {
			$(this).addClass('ap-modal--is-visible');
			openYouTube()
		});
	});

	// Show modal
	$(document).on('click', 'a.ap-mol', function (e) {
		e.preventDefault();

		var $link = $(this).attr('href'),
  	$el = $($link),
  	$vis = $('.ap-modal--is-visible');

  	$('.ap-contributed').fadeIn();
  	setTimeout(function() {
			$vis.removeClass('ap-modal--is-visible');

			$el.fadeIn(200, function () {
				$el.addClass('ap-modal--is-visible');
			});

			if ($link === '#ap-modal--video') {
					openYouTube();
			}

			if ($link === '#ap-modal--data') {
				countNumbers()
			}
			$('.ap-contributed').fadeOut();
		}, 3000);
	});


	$(document).on('click', function () {

	});


	// Close modals
	$mClose.on('click', function (e) {
		e.preventDefault();
		var no = $(this).data('no') || 0;

		if (no != undefined && no !== 1)
			player.destroy();
		closemodal.call(this);
	});

	$('.ap-modal-close').on('click', function (e) {
		e.preventDefault();
		closeEsc();
	});

	// Youtube Trailer
	var player;

	function onYouTubeIframeAPIReady() {
		openYouTube();
	}

	function start() {
		player = new YT.Player('player', {
			playerVars: { 'autoplay': 1, 'showinfo': 0, 'modestbranding': 1, 'rel': 0, 'controls': 0, 'playsinline': 1 },
			videoId: '7yIMm4AM0dM',
			events: {
				'onStateChange': onPlayerStateChange
			}
		});
	}

	function onPlayerStateChange(event) {
		if (event.data == 0) {
			removeYoutube();
		}
	}

	function openYouTube() {
		start();
	}

	function removeYoutube() {
		// Remove Trailer
		$('#ap-modal--video').fadeOut(function () {
			countNumbers();
		});
	}

	function loader() {
		setTimeout(function () {
			if (!isFootball) {
				$('.ap-modal--loading').fadeOut(function () {
					$('.ap-main').removeClass('ap-loading').addClass('ap-main--ready');
					$(this).removeClass('ap-modal--is-visible').removeAttr('style');
				});
			}
		}, 1000);
	}

	function closeEsc() {
		$('.ap-overlay').fadeOut(function () {
			$(this).removeClass('ap-modal--is-visible').removeAttr('style');
			removeYoutube();
		});
	}

	function closemodal() {
		var $la = $(this),
		$parents = $la.parent().parent().parent().parent();

		$parents.fadeOut(500, function () {
			$parents.removeClass('ap-modal--is-visible').removeAttr('style')
		});
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

	$(document).keyup(function (e) {
		if (e.keyCode == 27) {
			e.preventDefault();
			closeEsc();
		}
	});

	function countNumbers() {
		$('.ap-js--num-animated').each(function() {
		  var $this = $(this),
		    	countTo = $this.attr('data-count');

		  $({countNum: $this.text()
		  }).animate({
		      countNum: countTo
		    },

		    {
		      duration: 5000,
		      easing: 'linear',
		      step: function() {
		        $this.text(commaSeparateNumber(Math.floor(this.countNum)));
		      },
		      complete: function() {
		        $this.text(commaSeparateNumber(this.countNum));
		        //alert('finished');
		      }
		    }
		  );
		});

		function commaSeparateNumber(val) {
		  while (/(\d+)(\d{3})/.test(val.toString())) {
		    val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
		  }
		  return val;
		}
	}
});


