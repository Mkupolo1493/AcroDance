// From the apparently no longer API-phobic dev 3941driB
var allowAudio;
window.onload = function() {
	$("#allow-audio").on("click", function() {
		allowAudio = true;
		loadMenu();
	});
	$("#deny-audio").on("click", function() {
		allowAudio = false;
		loadMenu();
	});
}

function loadMenu() {
	if (allowAudio) {
		$("body").append('<audio src="MainMenu.mp3" type="audio/mpeg" id="menu-music"></audio>');
		$("#menu-music").get(0).play();
	}
	$("#audio-overlay").remove();
	$("#play").on("click", start);
}

function start() {
	$("body").children().remove();
	$("body").css("background-image", "none");
	if (allowAudio) {
		$("body").append('<audio src="CloudWorld.mp3" type="audio/mpeg" id="ingame-music" loop></audio>');
		$("#ingame-music").get(0).volume = 0.5;
		$("#ingame-music").get(0).play();
	}
	/**********************************\
	|*            .shape              *|
	|*             ☃☃☃☃            *|
	|* There is 1 .fake-shape among us*|
	\**********************************/

	$("body").append('\
		<div id="shapes-bar">\
			<div>Shapes</div>\
			<img class="real-shape shape" src="sprites/circle.png" alt="Circle" />\
			<img class="real-shape shape" src="sprites/square.png" alt="Square" />\
			<img class="real-shape shape" src="sprites/triangle.png" alt="Triangle" />\
			<img class="fake-shape shape" src="" />\
		</div>\
		<div id="playing-field"></div>\
	');
	var fsCache;
	$(".fake-shape").hide();
	var oCache;
	$(".real-shape").draggable({
		start: function(e) {
			$(".fake-shape").appendTo("body");
			fsCache = $(".fake-shape");
			fsCache.get(0).src = this.src;
			fsCache.show();
			$(this).css("visibility", "hidden");
		},
		drag: function(e) {
			fsCache.offset({left: e.pageX - 40, top: e.pageY - 40});
		},
		stop: function(e) {
			var withinBoundaries = e.pageX - 40 > 0 && e.pageY - 40 > 0 && e.pageX + 40 < $("#playing-field").get(0).offsetWidth && e.pageY + 40 < $("#playing-field").get(0).offsetHeight;
			
			if (withinBoundaries) {
				$(this).appendTo("#playing-field");
				$(this).offset({left: e.pageX - 40, top: e.pageY - 40});
			}
			else {
				$(this).css("position", "static");
			}
			fsCache.hide();
			$(this).css("visibility", "visible");
			fsCache.get(0).src = "";
			fsCache.appendTo("#shapes-bar");
			if (withinBoundaries) $(this).draggable("destroy");
		}
	});
}