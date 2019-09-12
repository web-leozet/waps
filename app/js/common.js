$(function() {

	alert('hello');
	var a = 5;
	consol.log(a);


});


// Пишем меню на jQuery

// $(document).ready(function() {
// 	var link = $('.menu-link');
// 	var link_active = $('.menu-link_active');
// 	var menu = $('.menu');
// 	var nav_link = $('.menu a');



// 	link.click(function() {
// 		link.toggleClass('menu-link_active');
// 		menu.toggleClass('menu_active');
// 	});
// 	nav_link.click(function() {
// 		// link.toggleClass('menu-link_active');
// 		menu.toggleClass('menu_active');
// 	});
// });

// .scroll-to-top

// $(document).ready(function() {
// 	$(window).scroll(function() {
// 			$(this).scrollTop() > 100 ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
// 		}),
// 		$(".scroll-to-top").click(function() {
// 			return $("html, body").animate({
// 				scrollTop: 0
// 			}, 600), !1
// 		})
// })



// Practik jQuery

// $(document).ready(function() {
// 	$('h3').css('cursor', 'pointer');
// 	$('h3').click(function() {
// 		$(this).toggleClass('blue');
// 	});
// });