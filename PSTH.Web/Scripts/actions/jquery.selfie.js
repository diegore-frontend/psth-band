var canvas = document.getElementById('ap-slf-canv'),
		wW = $(window).width(),
		colors = ['#F9D000', '#F2AB00', '#F2AB00'],
		movRad = 42;

if (wW > 1026) {
	movRad = 44;
}

if (wW > 1560) {
	movRad = 46;
}


circleProgressBar = new CircleProgressBar(canvas, {
		colors: colors,
		lineWidth: 5,
		radius: movRad,
		trackLineColor: null,
		frameInterval: 100
});

circleProgressBar.setValue(1);
