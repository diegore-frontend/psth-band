$(function () {
	$.ajax({
		url: route('Trivia/_QuestionTrivia'),
		type: "POST",
		dataType: "html",
		data: null,
		async: false,
		success: function (response) {
			$("#loader").html(response);
		},
		error: function () {
			console.log("error");
		},
	});

});


function assignQuestion() {
	$(".ap-trivia-answers-item").on('click', function () {
		$('#hdfAnswer').val($(this).children('button').data('value'));
		if ($('#hdfAnswer').val() != "") {
			var data = { answerGUID: $('#hdfAnswer').val() }
			$.ajax({
				url: route('Trivia/Trivia'),
				type: "POST",
				dataType: "html",
				data: data,
				async: false,
				success: function (response) {
					$("#loader").html(response);
				},
				error: function () {
					console.log("error");
				},
			});
		} else {
			return false;
		}
	});
};
