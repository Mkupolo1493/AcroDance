// From the apparently no longer API-phobic dev 3941driB
// DEBUG CONSTANTS
const debug = {
	legal: true,
	legalInfo: false,
	borders: true,
	bordersInfo: false,
	positions: true,
	modifiers: true
};

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

var cannonPosition = {x: 0, y: 0};

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
			<img class="real-shape shape" src="sprites/red_triangle.png" alt="Triangle" />\
			<img class="real-shape shape" src="sprites/blue_triangle.png" alt="Inverse Triangle" />\
			<img class="fake-shape shape" src="" />\
		</div>\
		<div id="playing-field"><img id="cannon" src="sprites/cannon.png" /></div>\
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
		stop: function(e) { // Why use e.pageX - 40 instead of .offset().left? oh right yeah that happened lol nope
			var pos = {
				// top left coordinates
				x1: e.pageX - 40,
				y1: e.pageY - 40,

				// bottom right coordinates
				x2: e.pageX + 39,
				y2: e.pageY + 39
			};
			var legal = (pos.x1 >= 0 && pos.y1 >= 0 && pos.x2 <= $("#playing-field").width() && pos.y2 <= $("#playing-field").height()) && $(".undoable").length < 3;

			if (debug.legal) console.log("Legal: " + legal);
			if (debug.legalInfo) {
				console.log("\tX1: " + pos.x1);
				console.log("\tY1: " + pos.y1);

				console.log("\n\tX2: " + pos.x2);
				console.log("\tY2: " + pos.y2);


				console.log("\n\n\tField Width: " + $("#playing-field").width());
				console.log("\tField Height: " + $("#playing-field").height());


				console.log("\n\n\tUndoable: " + $(".undoable").length);
			}
			positions.forEach(function(p) {
				if (legal) {
					if (p.x2 == pos.x1 || p.y2 == pos.y1 || p.x1 == pos.x2 || p.y1 == pos.y2 || p.x1 == pos.x1) {
						legal = false;
						if (debug.borders) console.log("Borders aligned (illegal):");
					}
				}
				if (legal && debug.borders) {
					console.log("Borders not aligned (legal):");
				}
				if (debug.bordersInfo) {
					console.log("\tp.x1 = " + p.x1);
					console.log("\tp.y1 = " + p.y1);
					console.log("\tp.x2 = " + p.x2);
					console.log("\tp.y2 = " + p.y2);

					console.log("\n\tpos.x1 = " + pos.x1);
					console.log("\tpos.y1 = " + pos.y1);
					console.log("\tpos.x2 = " + pos.x2);
					console.log("\tpos.y2 = " + pos.y2);
				}
			});
			if (legal) {
				positions.push(pos);
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
			startSim();
		}
	});

	$("body").append('<span id="showpos">X, Y</span>'); // debug

	$("#playing-field").css("cursor", "crosshair"); // debug

	$("body").on("mousemove", function(e) {
		$("#showpos").text(`X: ${e.pageX}, Y: ${e.pageY}`);
	}); // debug
}

function startSim() {
	var position = cannonPosition;

	if (debug.positions) {
		console.log("Positions:");
		positions.forEach(function(p, i) {
			console.log("\tShape " + i + ":");
				console.log("\t\tX1: " + p.x1);
				console.log("\t\tY1: " + p.y1);

				console.log("\n\t\tX2: " + p.x2);
				console.log("\t\tY2: " + p.y2);
		});
	}

	// Start PGrid Simulation
	var modifiers = [];
	positions.forEach(function(p) {
		if (pointWithin(position, p) || pointWithin({x: position.x, y: position.y + 80}, p) || pointWithin({x: position.x + 80, y: position.y}, p) || pointWithin({x: position.x + 80, y: position.y + 80}, p)) {
			modifiers.push(p.x1);
		}
	});
    
    var x1id;
    // In-place x1id replacement
    $("#playing-field").children(".real-shape").each(function() {
        x1id = $(this).offset().left;
        if (modifiers.includes(x1id)) {
            modifiers = modifiers.filter(item => item != x1id);
            modifiers.push($(this));
        }
    });

	if (debug.modifiers) {
		console.log("Modifiers:");
		modifiers.forEach(function(m, i) {
			console.log("\tModifier " + i + ":");
				console.log("\t\tType: " + m.get(0).src.slice(44, -4)); // removes url and .png extension, IMPORTANT NOTE: if forking, change the slice to fit your needs of url, as 44 is simply a hardcoded string length for https://acrodance.3941drib.repl.co/sprites/

				console.log("\n\t\tX: " + m.offset().left);
				console.log("\t\tY: " + m.offset().top);
		});
	}
}

function pointWithin(point, boundary) {
	return point.x >= boundary.x1 && point.y >= boundary.y1 && point.x <= boundary.x2 && point.y <= boundary.y2;
}