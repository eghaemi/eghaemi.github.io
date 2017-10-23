var per_slide = 1;
	var step = 1;
	var last_item = $(".item").length - Math.floor(per_slide);
	var current_item = 0;
	
	var eff_per_slide;
	var eff_step;
	
	$(window).resize(function() {
		var w = window.innerWidth;
		var h = Math.min(window.innerHeight, 256) - 6;
		
		$("#container").height(h);
		$("#logo").height(h);
		$("#carousel").height(h);
		$(".item").height(h - 2);
		$(".item img").height(h - 2);
		$("#previous").height(h - 2);
		$("#next").height(h - 2);
		
		
		if(w >= 400) {
			eff_per_slide = per_slide;
			eff_step = step;
		} else {
			eff_per_slide = 1;
			eff_step = 1;
		}
		last_item = $(".item").length - Math.floor(eff_per_slide);
		
		if(w >= 300) {
			$("#logo").css("display", "block");
			$("#previous").css("display", "table");
			$("#next").css("display", "table");
			$("#logo").width(h);
			if($("#logo").width()>0) {
				$("#carousel").css("margin-right", h + 10);
				$("#carousel").width(w - h - 16);
			} else {
				$("#carousel").css("margin-right", 0);
				$("#carousel").width(w - 6);
			}
			$("#carousel-body").css("margin-left", 28);
			$("#carousel-body").css("margin-right", 28);
			
		} else {
			$("#logo").css("display", "none");
			$("#previous").css("display", "none");
			$("#next").css("display", "none");
			$("#carousel").css("margin-right", 0);
			$("#carousel").width(w);
			$("#carousel-body").css("margin-left", 0);
			$("#carousel-body").css("margin-right", 0);
		}
		
		$(".item").width($("#carousel-body").innerWidth() / eff_per_slide - (8 + eff_per_slide));
		set_items_pos(false);
		
		var f = Math.sqrt($(".item").height()*$(".item").width()) / 9 + $(".item").height() / 50;
		f = f*0.8;
		$(".item-text .title").css("font-size", f);
		$(".item-text .call-to-action").css("font-size", 0.75 * f);
		
	});
	
	$(window).resize();
	
	$("#previous").click(function(){
		current_item -= eff_step;
		if(current_item < 0) {
			current_item = 0;
		}
		set_items_pos();
	});
	
	$("#next").click(function(){
		current_item += eff_step;
		if(current_item > last_item) {
			current_item = last_item;
		}
		set_items_pos();
	});
	
	function set_items_pos(animate = true) {
		
		if(current_item <= 0) {
			$("#previous").addClass("disabled");
		} else {
			$("#previous").removeClass("disabled");
		}
		
		if(current_item >= last_item) {
			$("#next").addClass("disabled");
		} else {
			$("#next").removeClass("disabled");
		}
		
		var items_pos = $(".item")[current_item].getBoundingClientRect().left - $(".item")[0].getBoundingClientRect().left;
		if(animate) {
			$("#items").animate({right: items_pos}, 350);
		} else {
			$("#items").css("right", items_pos);
		}
	}
	
	var my_timer = setInterval(auto_scroll, 3000);
	var my_timer_enabled = true;
	function auto_scroll() {
		if(!my_timer_enabled) return;
		if(current_item < last_item) {
			current_item += eff_step;
			if(current_item > last_item) {
				current_item = last_item;
			}
		} else {
			current_item = 0;
		}
		set_items_pos();
	}
	
	$("#container").mouseover(function() {
		my_timer_enabled = false;
	});
	
	$("#container").mouseleave(function() {
		my_timer_enabled = true;
	});

	
function referesh_page() {
	(document.getElementsByTagName('html')[0]).innerHTML = '';
	// window.location.replace('own links');
}