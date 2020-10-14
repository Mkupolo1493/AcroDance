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
		<div id="submit-container">\
			<button id="undo-move">⤺</button>\
			<button id="submit-move" class="inactive">✓</button>\
		</div>\
	');
	var fsCache;
	$(".fake-shape").hide();
	var oCache;
	var shapeDrag = {
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
			var legal = (e.pageX - 40 > 0 && e.pageY - 40 > 0 && e.pageX + 40 < $("#playing-field").get(0).offsetWidth && e.pageY + 40 < $("#playing-field").get(0).offsetHeight) && $(".undoable").length < 3;
			
			if (legal) {
				$(this).addClass("undoable");
				if ($(".undoable").length == 3) $("#submit-move").removeClass("inactive");
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
			if (legal) {
				$(this).clone().draggable(shapeDrag).css("position", "static").removeClass("undoable").appendTo("#shapes-bar");
				$(this).draggable("destroy");
			}
		}
	};
	$(".real-shape").draggable(shapeDrag);

	$("#undo-move").on("click", function() {
		$("#submit-move").addClass("inactive");
		$(".undoable").remove();
	});
	$("#submit-move").on("click", function() {
		if ($(this).hasClass("inactive")) {
			$(this).addClass("inactive");
			$(".undoable").removeClass("undoable");
		}
	});
}