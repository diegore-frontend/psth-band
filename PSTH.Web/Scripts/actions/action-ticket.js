var ticket = $('#Ticket'),
	btnRegister = $('#btnRegister');

$(function () {

    $("#Ticket").alphanum({
        allow: 'á',
        disallow: '',
        allowSpace: false,
        allowNumeric: true,
        allowUpper: true,
        allowLower: true,
        allowCaseless: true,
        allowLatin: true,
        allowOtherCharSets: true,
        forceUpper: false,
        forceLower: false,
        maxLength: NaN
    });

    $('#TermsAndConditions').on('click', function () {
        $('input[name="TermsAndConditions"]:hidden').val($(this).is(':checked'));
    });

    btnRegister.on('click', function () {
        $('#ap-modal--loading').fadeIn();
        var byc = $('input[name="TermsAndConditions"]:hidden').val(),
				ticketo = $('#Ticket').val();//,
        var regexGuid = new RegExp("[A-Z0-9a-z]{5,16}$");
        if ($('#g-recaptcha-response').val() != "") {
            if (ticketo !== "") {
                if (byc === "true") {
                    var data = { Ticket: ticketo, TermsAndConditions: byc, Token: $('#g-recaptcha-response').val() }
                    if (regexGuid.test(ticketo)) {
                        if ($.Action) {
                            $.Action = false;
                            $.ajax({
                                url: route('Ticket/Validate'),
                                type: "POST",
                                dataType: "JSON",
                                data: data,
                                success: function (response) {
                                    $.Action = true;
                                    grecaptcha.reset();
                                    try {
                                        $('#Ticket').val("");
                                        if ($('input[type=hidden]').val() == "true") {
                                            $('#TermsAndConditions').click();
                                        }
                                        if (response.status === 0) {
                                            location.href = route(response.content);
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
                            return false;
                        }
                    } else {
                        $('#ap-modal--loading').fadeOut();
                        alertify.alert("Tu ticket no es válido. Intenta nuevamente.");
                    }
                } else {
                    $('#ap-modal--loading').fadeOut();
                    alertify.alert("Debes aceptar las bases y condiciones.");
                }
            } else {
                $('#ap-modal--loading').fadeOut();
                alertify.alert("Debes ingresar un ticket para poder participar.");
            }
        } else {
            $('#ap-modal--loading').fadeOut();
            alertify.alert("Debes aceptar el captcha.");
        }
        $('#ap-modal--loading').fadeOut();
        return false;
    });
});