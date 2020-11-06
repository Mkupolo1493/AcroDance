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

var positions = [];
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
	$("#playing-field")
	.width($("#playing-field").width())
	.height($("#playing-field").height());
	
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
			var pos = {
				// top left coordinates
				x1: e.pageX - 40,
				y1: e.pageY - 40,

				// bottom right coordinates
				x2: e.pageX + 40,
				y2: e.pageY + 40
			};
			positions.push(pos);
			var legal = (pos.x1 > 0 && pos.y1 > 0 && pos.x2 < $("#playing-field").width() && pos.y2 < $("#playing-field").height()) && $(".undoable").length < 3;
			console.log("Legal: " + legal);
				console.log("\tX1: " + pos.x1);
				console.log("\tY1: " + pos.y1);

				console.log("\n\tX2: " + pos.x2);
				console.log("\tY2: " + pos.y2);


				console.log("\n\n\tField Width: " + $("#playing-field").width());
				console.log("\tField Height: " + $("#playing-field").height());


				console.log("\n\n\tUndoable: " + $(".undoable").length);
			if (legal) {
				$(this).addClass("undoable");
				if ($(".undoable").length == 3) $("#submit-move").removeClass("inactive");
				$(this).appendTo("#playing-field");
				$(this).offset({left: pos.x1, top: pos.y1});
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
		for (var i = 0; i < $(".undoable").length; i++) {
			positions.pop();
		}
		$(".undoable").remove();
	});
	$("#submit-move").on("click", function() {
		if (!$(this).hasClass("inactive")) {
			$(this).addClass("inactive");
			$(".undoable").removeClass("undoable");
		}
		startSim();
	});
}

function startSim() {
	var position = {x: 0, y: 0}; // Change to cannon position later
	console.log("Positions:");
	positions.forEach(function(p, i) {
		console.log("\tShape " + i + ":");
			console.log("\t\tX1: " + p.x1);
			console.log("\t\tY1: " + p.y1);

			console.log("\n\t\tX2: " + p.x2);
			console.log("\t\tY2: " + p.y2);
	});
	// Start PGrid Simulation
	var modifiers = [];
	positions.forEach(function(p) {
		if (pointWithin(position, p) || pointWithin({position.x, position.y + 40}, p) || pointWithin({position.x + 40, position.y}, p) || pointWithin({position.x + 40, position.y + 40}, p)) {
			modifiers.push(p);
		}
	} // In case I forget what I'm doing, I need to not check for intersections, but rather check that neither the x's or the y's are equal.
}

function pointWithin(point, boundary) {
	return point.x >= boundary.x1 && point.y >= boundary.y1 && point.x <= boundary.x2 && point.y <= boundary.y2;
}
