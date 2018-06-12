$.Action = true;

function route(url) {
	$.Url = /localhost/.test(document.URL) ? location.protocol + '//' + location.host + '/' :
		/stage/.test(document.URL) ? location.protocol + '//' + location.host + '/emociones-2017/' :
		location.protocol + '//' + location.host + '/emociones-2017/';
	return $.Url + url;
	///stage/.test(document.URL) ? location.protocol + '//' + location.host + '/6f03b027-f528-46bb-bd8f-cf8e6b67ebf8/' :
}

$('#ExitSession').on('click', function () {
	$("#ap-modal--leave").addClass("ap-modal--is-visible");
	$("#ap-modal--leave").addClass("ap-modal--ready");
});


$('#closeModal').on('click',
	function() {
		$("#ap-modal--leave").removeClass("ap-modal--is-visible");
		$("#ap-modal--leave").removeClass("ap-modal--ready");
	});

$('#closeLogin').on('click', function () {
	closeModal();
});

function parseBool(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return (string == 'true');
    }
}
$(function () {
	$('.signin').on('click', function () {
		var self = $(this);

		if (self.attr('href') === 'javascript:') {
			openLogin();
			return false;
		} if (self.attr('href') === 'logued:') {
			$.Action = true;
			$('#txbticket').val("");
			if ($('input[type=hidden]').val() == "true") {
				$('#TermsAndConditions').click();
			}
			grecaptcha.reset();
			return false;
		}
		return true;
	});

});

function facebookShare() {
	var app = window.location.pathname.split('/')[1];
	var site = window.location.href.split('/')[2];
	var winWidth = 520;
	var winHeight = 350;
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F' + site + '%2F' + app + '%2F&amp;src=sdkpreparse', 'facebook', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);

}

function twitterShare(text) {
	var url = route('');
	var winWidth = 520;
	var winHeight = 350;
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open("http://twitter.com/share?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text) + "&count=none/", "twitter", 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}


$('.share').on('click', function () {
	var description = $(this).data('description');
	if (description !== undefined) {
		twitterShare(description);
		return false;
	}
	facebookShare();
	return false;
});

$('.ga-fa').on('click', function () {
	ga('send', 'event', 'Inicio de Sesión', 'Facebook');
});
