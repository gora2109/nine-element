function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}

$(document).ready(function() {
	// Highlight any found errors
	$('.text-danger').each(function() {
		var element = $(this).parent().parent();

		if (element.hasClass('form-group')) {
			element.addClass('has-error');
		}
	});

	// Currency
	$('#form-currency .currency-select').on('click', function(e) {
		e.preventDefault();

		$('#form-currency input[name=\'code\']').val($(this).attr('name'));

		$('#form-currency').submit();
	});

	// Language
	$('#form-language .language-select').on('click', function(e) {
		e.preventDefault();

		$('#form-language input[name=\'code\']').val($(this).attr('name'));

		$('#form-language').submit();
	});

	/* Search */
	$('#search input[name=\'search\']').parent().find('button').on('click', function() {
		var url = $('base').attr('href') + 'index.php?route=product/search';

		var value = $('header #search input[name=\'search\']').val();

		if (value) {
			url += '&search=' + encodeURIComponent(value);
		}

		location = url;
	});

	$('#search input[name=\'search\']').on('keydown', function(e) {
		if (e.keyCode == 13) {
			$('header #search input[name=\'search\']').parent().find('button').trigger('click');
		}
	});

	// Menu
	$('#menu .dropdown-menu').each(function() {
		var menu = $('#menu').offset();
		var dropdown = $(this).parent().offset();

		var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

		if (i > 0) {
			$(this).css('margin-left', '-' + (i + 10) + 'px');
		}
	});

	// Product List
	$('#list-view').click(function() {
		$('#content .product-grid > .clearfix').remove();

		$('#content .row > .product-grid').attr('class', 'product-layout product-list col-xs-12');
		$('#grid-view').removeClass('active');
		$('#list-view').addClass('active');

		localStorage.setItem('display', 'list');
	});

	// Product Grid
	$('#grid-view').click(function() {
		// What a shame bootstrap does not take into account dynamically loaded columns
		var cols = $('#column-right, #column-left').length;

		if (cols == 2) {
			$('#content .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
		} else if (cols == 1) {
			$('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
		} else {
			$('#content .product-list').attr('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
		}

		$('#list-view').removeClass('active');
		$('#grid-view').addClass('active');

		localStorage.setItem('display', 'grid');
	});

	if (localStorage.getItem('display') == 'list') {
		$('#list-view').trigger('click');
		$('#list-view').addClass('active');
	} else {
		$('#grid-view').trigger('click');
		$('#grid-view').addClass('active');
	}

	// Checkout
	$(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
		if (e.keyCode == 13) {
			$('#collapse-checkout-option #button-login').trigger('click');
		}
	});

	// tooltips on hover
	$('[data-toggle=\'tooltip\']').tooltip({container: 'body'});

	// Makes tooltips work on ajax generated content
	$(document).ajaxStop(function() {
		$('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
	});
});

// Cart add remove functions
var cart = {
	'add': function(product_id, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			/*beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},*/
			success: function(json) {
				$('.alert-dismissible, .text-danger').remove();

				if (json['redirect']) {
					location = json['redirect'];
				}

				if (json['success']) {
					$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
					// Need to set timeout otherwise it wont update the total
					setTimeout(function () {
						// $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
						$('#cart > button').html('<svg class="icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.0625 17.0627C6.61478 17.0627 7.0625 16.615 7.0625 16.0626C7.0625 15.5103 6.61478 15.0625 6.0625 15.0625C5.51022 15.0625 5.0625 15.5103 5.0625 16.0626C5.0625 16.615 5.51022 17.0627 6.0625 17.0627Z" fill="black"/> <path d="M15.4375 17.0627C15.9898 17.0627 16.4375 16.615 16.4375 16.0626C16.4375 15.5103 15.9898 15.0625 15.4375 15.0625C14.8852 15.0625 14.4375 15.5103 14.4375 16.0626C14.4375 16.615 14.8852 17.0627 15.4375 17.0627Z" fill="black"/> <path d="M3.5 4.12501H17.1262C17.2178 4.12501 17.3082 4.14511 17.3911 4.18391C17.474 4.2227 17.5474 4.27924 17.606 4.34951C17.6647 4.41979 17.7072 4.5021 17.7306 4.59061C17.7539 4.67912 17.7575 4.77168 17.7412 4.86175L16.3783 12.3618C16.3521 12.5058 16.2762 12.636 16.1639 12.7298C16.0515 12.8236 15.9097 12.875 15.7634 12.875H5.61865C5.47233 12.875 5.33066 12.8237 5.2183 12.73C5.10595 12.6362 5.03003 12.5061 5.00378 12.3621L3.02535 1.51288C2.9991 1.36894 2.92319 1.23877 2.81083 1.14505C2.69847 1.05133 2.5568 1 2.41049 1H1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg><span id="cart-total" class="total"> ' + json['total'] + '</span>');
					}, 100);

					// $('html, body').animate({ scrollTop: 0 }, 'slow');

					// $('#cart > ul').load('index.php?route=common/cart/info ul li');
					$('#cartModal .modal-body').load('index.php?route=common/cart/info .checkout-table');
					$('#cartModal').modal('show')
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'update': function(key, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			/*beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},*/
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					// $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
					$('#cart > button').html('<svg class="icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.0625 17.0627C6.61478 17.0627 7.0625 16.615 7.0625 16.0626C7.0625 15.5103 6.61478 15.0625 6.0625 15.0625C5.51022 15.0625 5.0625 15.5103 5.0625 16.0626C5.0625 16.615 5.51022 17.0627 6.0625 17.0627Z" fill="black"/> <path d="M15.4375 17.0627C15.9898 17.0627 16.4375 16.615 16.4375 16.0626C16.4375 15.5103 15.9898 15.0625 15.4375 15.0625C14.8852 15.0625 14.4375 15.5103 14.4375 16.0626C14.4375 16.615 14.8852 17.0627 15.4375 17.0627Z" fill="black"/> <path d="M3.5 4.12501H17.1262C17.2178 4.12501 17.3082 4.14511 17.3911 4.18391C17.474 4.2227 17.5474 4.27924 17.606 4.34951C17.6647 4.41979 17.7072 4.5021 17.7306 4.59061C17.7539 4.67912 17.7575 4.77168 17.7412 4.86175L16.3783 12.3618C16.3521 12.5058 16.2762 12.636 16.1639 12.7298C16.0515 12.8236 15.9097 12.875 15.7634 12.875H5.61865C5.47233 12.875 5.33066 12.8237 5.2183 12.73C5.10595 12.6362 5.03003 12.5061 5.00378 12.3621L3.02535 1.51288C2.9991 1.36894 2.92319 1.23877 2.81083 1.14505C2.69847 1.05133 2.5568 1 2.41049 1H1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg><span id="cart-total" class="total"> ' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					// $('#cart > ul').load('index.php?route=common/cart/info ul li');
					$('#cartModal .modal-body').load('index.php?route=common/cart/info .checkout-table');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			/*beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},*/
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					// $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
					$('#cart > button').html('<svg class="icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.0625 17.0627C6.61478 17.0627 7.0625 16.615 7.0625 16.0626C7.0625 15.5103 6.61478 15.0625 6.0625 15.0625C5.51022 15.0625 5.0625 15.5103 5.0625 16.0626C5.0625 16.615 5.51022 17.0627 6.0625 17.0627Z" fill="black"/> <path d="M15.4375 17.0627C15.9898 17.0627 16.4375 16.615 16.4375 16.0626C16.4375 15.5103 15.9898 15.0625 15.4375 15.0625C14.8852 15.0625 14.4375 15.5103 14.4375 16.0626C14.4375 16.615 14.8852 17.0627 15.4375 17.0627Z" fill="black"/> <path d="M3.5 4.12501H17.1262C17.2178 4.12501 17.3082 4.14511 17.3911 4.18391C17.474 4.2227 17.5474 4.27924 17.606 4.34951C17.6647 4.41979 17.7072 4.5021 17.7306 4.59061C17.7539 4.67912 17.7575 4.77168 17.7412 4.86175L16.3783 12.3618C16.3521 12.5058 16.2762 12.636 16.1639 12.7298C16.0515 12.8236 15.9097 12.875 15.7634 12.875H5.61865C5.47233 12.875 5.33066 12.8237 5.2183 12.73C5.10595 12.6362 5.03003 12.5061 5.00378 12.3621L3.02535 1.51288C2.9991 1.36894 2.92319 1.23877 2.81083 1.14505C2.69847 1.05133 2.5568 1 2.41049 1H1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg><span id="cart-total" class="total"> ' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					// $('#cart > ul').load('index.php?route=common/cart/info ul li');
					$('#cartModal .modal-body').load('index.php?route=common/cart/info .checkout-table');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}

var voucher = {
	'add': function() {

	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			/*beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},*/
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					// $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
					$('#cart > button').html('<svg class="icon" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.0625 17.0627C6.61478 17.0627 7.0625 16.615 7.0625 16.0626C7.0625 15.5103 6.61478 15.0625 6.0625 15.0625C5.51022 15.0625 5.0625 15.5103 5.0625 16.0626C5.0625 16.615 5.51022 17.0627 6.0625 17.0627Z" fill="black"/> <path d="M15.4375 17.0627C15.9898 17.0627 16.4375 16.615 16.4375 16.0626C16.4375 15.5103 15.9898 15.0625 15.4375 15.0625C14.8852 15.0625 14.4375 15.5103 14.4375 16.0626C14.4375 16.615 14.8852 17.0627 15.4375 17.0627Z" fill="black"/> <path d="M3.5 4.12501H17.1262C17.2178 4.12501 17.3082 4.14511 17.3911 4.18391C17.474 4.2227 17.5474 4.27924 17.606 4.34951C17.6647 4.41979 17.7072 4.5021 17.7306 4.59061C17.7539 4.67912 17.7575 4.77168 17.7412 4.86175L16.3783 12.3618C16.3521 12.5058 16.2762 12.636 16.1639 12.7298C16.0515 12.8236 15.9097 12.875 15.7634 12.875H5.61865C5.47233 12.875 5.33066 12.8237 5.2183 12.73C5.10595 12.6362 5.03003 12.5061 5.00378 12.3621L3.02535 1.51288C2.9991 1.36894 2.92319 1.23877 2.81083 1.14505C2.69847 1.05133 2.5568 1 2.41049 1H1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg><span id="cart-total" class="total"> ' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					// $('#cart > ul').load('index.php?route=common/cart/info ul li');
					$('#cartModal .modal-body').load('index.php?route=common/cart/info .checkout-table');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}

var wishlist = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				$('.alert-dismissible').remove();

				if (json['redirect']) {
					location = json['redirect'];
				}

				if (json['success']) {
					$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
				}

				$('#wishlist-total span').html(json['total']);
				$('#wishlist-total').attr('title', json['total']);

				$('html, body').animate({ scrollTop: 0 }, 'slow');
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {

	}
}

var compare = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=product/compare/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				$('.alert-dismissible').remove();

				if (json['success']) {
					$('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

					$('#compare-total').html(json['total']);

					$('html, body').animate({ scrollTop: 0 }, 'slow');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {

	}
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function(e) {
	e.preventDefault();

	$('#modal-agree').remove();

	var element = this;

	$.ajax({
		url: $(element).attr('href'),
		type: 'get',
		dataType: 'html',
		success: function(data) {
			html  = '<div id="modal-agree" class="modal">';
			html += '  <div class="modal-dialog">';
			html += '    <div class="modal-content">';
			html += '      <div class="modal-header">';
			html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
			html += '      </div>';
			html += '      <div class="modal-body">' + data + '</div>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			$('#modal-agree').modal('show');
		}
	});
});

// Autocomplete */
(function($) {
	$.fn.autocomplete = function(option) {
		return this.each(function() {
			this.timer = null;
			this.items = new Array();

			$.extend(this, option);

			$(this).attr('autocomplete', 'off');

			// Focus
			$(this).on('focus', function() {
				this.request();
			});

			// Blur
			$(this).on('blur', function() {
				setTimeout(function(object) {
					object.hide();
				}, 200, this);
			});

			// Keydown
			$(this).on('keydown', function(event) {
				switch(event.keyCode) {
					case 27: // escape
						this.hide();
						break;
					default:
						this.request();
						break;
				}
			});

			// Click
			this.click = function(event) {
				event.preventDefault();

				value = $(event.target).parent().attr('data-value');

				if (value && this.items[value]) {
					this.select(this.items[value]);
				}
			}

			// Show
			this.show = function() {
				var pos = $(this).position();

				$(this).siblings('ul.dropdown-menu').css({
					top: pos.top + $(this).outerHeight(),
					left: pos.left
				});

				$(this).siblings('ul.dropdown-menu').show();
			}

			// Hide
			this.hide = function() {
				$(this).siblings('ul.dropdown-menu').hide();
			}

			// Request
			this.request = function() {
				clearTimeout(this.timer);

				this.timer = setTimeout(function(object) {
					object.source($(object).val(), $.proxy(object.response, object));
				}, 200, this);
			}

			// Response
			this.response = function(json) {
				html = '';

				if (json.length) {
					for (i = 0; i < json.length; i++) {
						this.items[json[i]['value']] = json[i];
					}

					for (i = 0; i < json.length; i++) {
						if (!json[i]['category']) {
							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
						}
					}

					// Get all the ones with a categories
					var category = new Array();

					for (i = 0; i < json.length; i++) {
						if (json[i]['category']) {
							if (!category[json[i]['category']]) {
								category[json[i]['category']] = new Array();
								category[json[i]['category']]['name'] = json[i]['category'];
								category[json[i]['category']]['item'] = new Array();
							}

							category[json[i]['category']]['item'].push(json[i]);
						}
					}

					for (i in category) {
						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

						for (j = 0; j < category[i]['item'].length; j++) {
							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
						}
					}
				}

				if (html) {
					this.show();
				} else {
					this.hide();
				}

				$(this).siblings('ul.dropdown-menu').html(html);
			}

			$(this).after('<ul class="dropdown-menu"></ul>');
			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

		});
	}
})(window.jQuery);
