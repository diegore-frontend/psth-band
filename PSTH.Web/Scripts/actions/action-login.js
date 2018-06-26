var content = 1;

function openLogin() {
	$('.modal-login').addClass("ap-modal--is-visible");
	$('.modal-login').addClass("ap-modal--ready");
	$('body').on('click touchstart', '.close-modal', closeModal);
}

function closeModal() {
	$('.modal-login').removeClass("ap-modal--is-visible");
	$('.modal-login').removeClass("ap-modal--ready");
}

try {
	window.addEventListener('message', receiveMessage, false);
} catch (e) {
}

function receiveMessage(event) {
	var obj = JSON.parse(event.data);
	switch (obj.accion) {
		case "abrir":
			$(".mfp-content").css("height", obj.mensaje);
			$(".mfp-content").css("max-width", window.auto);
			break;
		case "login":
			signIn(obj.mensaje);
			break;
		case "registro":
			alertify.alert(obj.mensaje, function (e) {
				if (e) {
					closeModal();
				}
			});
			break;
		case "alerta":
			alertify.alert(obj.mensaje, function (e) {
				if (e) {
					closeModal();
				}
			});
			break;
		case "cerrar":
			alertify.alert(obj.mensaje, function (e) {
				if (e) {
					closeModal();
				}
			});
			break;
	}
};

var signIn = function (guid) {
	$('#ap-modal--loading').fadeIn();
	var regexGuid = new RegExp("^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$");
	if (content === 1) {
		content++;
		if (regexGuid.test(guid)) {
			closeModal();
			
			$.ajax({
				url: route('Account/SignIn'),
				type: "POST",
				dataType: "JSON",
				data: { Guid: guid },
				success: function (response) {
					try {
						if (response.status === 0) {
							location.href = response.content;
						} else {
							$('#ap-modal--loading').fadeOut();
							alertify.alert(response.content);
						}
					} catch (ex) {
						$('#ap-modal--loading').fadeOut();
						alertify.error(ex);
					}
				}
			});
		}
		else
			$('#ap-modal--loading').fadeOut();
	}
	else
		$('#ap-modal--loading').fadeOut();
}