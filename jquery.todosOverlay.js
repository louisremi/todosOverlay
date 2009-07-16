(function($){

$("body").append((
	"<div id=\"overlayDiv\">"+
		"<div id=\"overlayRelative\">"+
			"<img id=\"overlayClose\" src=\"image/close.png\" />"+
			"<img id=\"overlayLoader\" src=\"image/loader.gif\" />"+
			"<img id=\"overlayImage\" />"+
			"<div id=\"overlayPlus\">"+
				"<img id=\"overlayPrevious\" src=\"image/keyLeft.png\" class=\"overlayKey\" />"+
				"<img id=\"overlayNext\" src=\"image/keyRight.png\" class=\"overlayKey\" />"+		
				"<p id=\"overlayTitle\"></p>"+
			"</div>"+
		"</div>"+
	"</div>"+
	"<div id=\"fixedDiv\"></div>"
));
var $overlay = $("#overlayDiv").click(function(e) {
		$overlay.trigger(e.target.className == "overlayKey"? "change" : "minimize", [e.target.id == "overlayNext"? 1 : -1])
		
	}).bind("change", function(e, increment) {
		$CurrentContainer.find("img:eq("+ (parseInt($CurrentTarget.data("imageOrder")) + increment) + ")").trigger("click");
		
	}).bind("minimize", function() {
		// Cache useful values
		var overlayWidth = $overlay.data("width");
		$overlay.animate({
			width: 0,
			height: 0,
			left: "+=" + overlayWidth /2,
			top: "+=" + overlayWidth /Format /2
		}).queue(function() {
			$image.css({
				width: "auto"
			}).attr("src", "");
			$overlay.hide().dequeue();
		});
		
	}).hover(function() {
		if($overlay.hasClass("maximized"))
			$title.stop(true, true).fadeIn();
	}, function() {
		if($overlay.hasClass("maximized"))
			$title.stop(true, true).fadeOut();
	}),
	$image = $("#overlayImage").load(function() {
		clearInterval(Load);
		$image.css({
			width: "90%"
		}).animate({opacity: 1});
	}),
	$plus = $('#overlayPlus'),
	$title = $("#overlayTitle").css("opacity", .8),
	$fixed = $("#fixedDiv"),
	Format,
	Load,
	$CurrentTarget,
	$CurrentContainer;
	
$.fn.extend({
	todosOverlay: function(o) {
		return this.each(function() {
			var $this = $(this),
				options = $.extend({}, $.todosOverlay.defaults, o);
			$this.click(function(e) {
				if(e.target.tagName == "IMG") {
					//Immediately hide the text to prevent visual glitches
					$plus.hide();
					$overlay.removeClass("maximized");
					var target = e.target, 
						$target = $(target),
						targetPosition = $target.position(),
						targetWidth = $target.width(),
						targetHeight = $target.height(),
						fixedPosition = $fixed.position(),
						// Cache usefull values
						overlayWidth = options.width,
						_$image = $image.attr("src", target.src.replace(options.regex, options.replace))
							.css({
								opacity: 0,
								display: "block"
							}),
						title = $target.attr("title");
					// Make sure that the load event fires even from cache 
					Load = setInterval(function() {
						if($image.width() != 0)
							$image.trigger("load");
					}, 200);
					$title.text(title).css("visibility", title? "visible" : "hidden");
					$CurrentTarget = $target;
					$CurrentContainer = $(this);
					Format = targetWidth / targetHeight;
					$overlay.data("width", options.width)
					// Move the overlay over the clicked image
					.css({
						left: targetPosition.left,
						top: targetPosition.top,
						width: $target.width(),
						height: $target.height(),
						display: "block"
					// Animate the overlay to the center of the viewport
					}).animate({
						top: fixedPosition.top + 100,
						left: fixedPosition.left - 300,
						width: overlayWidth,
						height: overlayWidth / Format
					}).queue(function() {
						$plus.fadeIn();
						$overlay.addClass("maximized").dequeue();
					});
				}
			}).find("img").each(function(i) {
				$(this).data("imageOrder", i);
			});
		});
	}
});

$(window).keydown(function(e) {
		if($overlay.is(":visible"))
		switch(e.keyCode) {
			case 37:
				$overlay.trigger("change", [-1]);
				break;
			case 39:
				$overlay.trigger("change", [1]);
				break;
		}
});

$.todosOverlay = {
	defaults: {
		width: 600,
		regex: /_?thumbnail_?/,
		replace: ""
	}
};

})(jQuery);
