String.prototype.replaceArray = function (find, replace) {
	var replaceString = this;
	var regex;

	for (var i = 0; i < find.length; i++) {
		regex = new RegExp(find[i], "g");
		replaceString = replaceString.replace(regex, replace[i]);
	}
	return replaceString;
};
cartLocalItems = [];
cartItems = [];
function checkItemQtd(id)
{
	if(!cartLocalItems[id]) return 0;
	else return cartLocalItems[id];
}
(function () {
	var loadMainVB = function ($) {
		var autocomplete, place;
		var selectedPlace = [];

		$('.veja-mobile-list').slick({
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
		});

		$('.carousel_slick_banner').slick({
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
		});

		$('.carousel_slick_list').slick({
			infinite: true,
			speed: 300,
			slidesToShow: 8,
			slidesToScroll: 1,
			responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 6,
					slidesToScroll: 1
				}
			}, {
				breakpoint: 800,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					dots: true,
					infinite: true
				}
			}, {
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					dots: true,
					infinite: true
				}
			}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					dots: true,
					infinite: true,
					autoplay: true,
					autoplaySpeed: 2000
				}
			}]
		});

		$('.slideshow').slick({
			infinite: true,
			autoplay: false,
			dots: true,
			arrows: false,
			autoplaySpeed: 4000
		});

		$('.ico_menu_mobile').click(function () {
			var $that = $(this);

			$(this).next().toggle('fast', function () {
				$that.toggleClass("menu-active");
			});
		});

		$(window).scroll(function () {
			checkPosition();
		});

		function checkPosition() {

			var scrollTop = $(window).scrollTop();

			if (scrollTop > 250) {
				$('.full_list_prod').addClass('list_prod');
			} else {
				$('.full_list_prod').removeClass('list_prod');
			}
		}


		if (document.getElementById('home_autocomplete') || document.getElementById('home_autocomplete_mobile')) {

			var componentForm = {
				street_number: 'short_name',
				route: 'long_name',
				locality: 'long_name',
				administrative_area_level_1: 'short_name',
				country: 'long_name',
				postal_code: 'short_name'
			};

			var script = document.createElement('script');
			script.type = 'text/javascript';
			//script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBsK-HC5Jh0KNb_bU7St7tr07g2pLUZx38&libraries=places";
			script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZ9Z1OiWLAqfnG1Sy0fnq5sx10NZX8GLQ&libraries=places";
			script.async = "true";
			script.defer = "defer";
			document.body.appendChild(script);

			setTimeout(initAutocomplete, 2000);

			function initAutocomplete() {
				if (document.getElementById('home_autocomplete')) {
					autocomplete = new google.maps.places.Autocomplete((document.getElementById('home_autocomplete')));
					autocomplete.addListener('place_changed', fillInAddress);
				}

				if (document.getElementById('home_autocomplete_mobile')) {
					autocomplete_mobile = new google.maps.places.Autocomplete((document.getElementById('home_autocomplete_mobile')));
					autocomplete_mobile.addListener('place_changed', fillInAddress);
				}
			}

			function fillInAddress() {
				place = autocomplete.getPlace();

				if (isNullOrUndefined(place)) {
					place = autocomplete_mobile.getPlace();
				}

				for (var i = 0; i < place.address_components.length; i++) {
					var addressType = place.address_components[i].types[0];
					if (componentForm[addressType]) {
						if (!isNullOrUndefined(place.address_components[i][componentForm[addressType]])) {
							selectedPlace[addressType] = place.address_components[i][componentForm[addressType]];
						}
					}
				}
			}

			function onSubmitPlace() {
				var sValue = $('#home_autocomplete').val();
				var check_mobile = false;
				$('.feedback-mobile-blue').fadeOut();

				if (isNullOrUndefined(sValue) && sValue == '') {
					if (!isNullOrUndefined($('#home_autocomplete_mobile').val()) && $('#home_autocomplete_mobile').val() != '') {
						sValue = $('#home_autocomplete_mobile').val();
						check_mobile = true;
					}
				}

				if (isNullOrUndefined(place) || isNullOrUndefined(place.address_components)) {
					window.dataLayer.push({ "event": "Endereco_Informado_Invalido", "address": sValue });

					if (!check_mobile && !$('.btn-mobile-yellow').is(':visible')) {
						$('.modalCepSugestion').modal({ backdrop: 'static', keyboard: false });
					} else if (check_mobile || $('.btn-mobile-yellow').is(':visible')) {
						$('.feedback-mobile-blue').fadeIn();
					}
					return false;
				}

				var validAddress = false;
				var validCity = false;
				var validCountry = false;
				var validState = false;

				var addressCaptured = {
					route: null,
					city: null,
					state: null,
					country: null,
					cep: null
				};

				for (var i = 0; i < place.address_components.length; i++) {
					if (place.address_components[i].types[0] == 'administrative_area_level_2') {
						validCity = true;
						if (place.address_components[i].short_name == 'São Paulo')
							addressCaptured.city = place.address_components[i].short_name;

					} else if (place.address_components[i].types[0] == 'administrative_area_level_1') {
						validState = true;
						if (place.address_components[i].short_name == 'SP')
							addressCaptured.state = place.address_components[i].short_name;
					} else if (place.address_components[i].types[0] == 'route') {
						validAddress = true;
						if (!isNullOrUndefined(place.address_components[i].types[0].long_name) || place.address_components[i].types[0].long_name != '')
							addressCaptured.route = place.address_components[i].long_name;
					} else if (place.address_components[i].types[0] == 'country') {
						validCountry = true;
						if (place.address_components[i].short_name == 'BR') {
							addressCaptured.country = place.address_components[i].short_name;
							validCountry = true;
						}
					} else if (place.address_components[i].types[0] == 'postal_code') {
						addressCaptured.cep = place.address_components[i].long_name;
					}
				}

				place.address_components = null;

				if (validAddress && validCity && validState && validCountry) {
					if (!isNullOrUndefined(addressCaptured.state) && !isNullOrUndefined(addressCaptured.city) && !isNullOrUndefined(addressCaptured.country)) {
						if (isNullOrUndefined(addressCaptured.route)) {
							window.dataLayer.push({ "event": "Endereco_Informado_Invalido", "address": sValue });
							$('.modalCepSugestion').modal({ backdrop: 'static', keyboard: false });
						} else {
							window.dataLayer.push({ "event": "Endereco_Informado_Sucesso", "address": sValue });
							window.sessionStorage.setItem('address_ok', addressCaptured);
							window.location.href = '/collections/all';
						}
					} else {
						addressCaptured = null;
						window.dataLayer.push({ "event": "Endereco_Informado_NaoEntrega", "address": sValue });
						$('.modalCep').modal({ backdrop: 'static', keyboard: false });
					}
				} else {
					addressCaptured = null;
					window.dataLayer.push({ "event": "Endereco_Informado_Invalido", "address": sValue });
					$('.modalCepSugestion').modal({ backdrop: 'static', keyboard: false });
				}


				addressCaptured = null;
				return false;
			}


			function isNullOrUndefined(var_test) {
				if (var_test === null || var_test === undefined) {
					return true;
				} else {
					return false;
				}
			}

			if (document.getElementById('placeForm')) {
				document.getElementById('placeForm').onsubmit = onSubmitPlace;
			}

			if (document.getElementById('placeFormMobile')) {
				document.getElementById('placeFormMobile').onsubmit = onSubmitPlace;
			}
		}

		$(".v_select").on('click', function () {
			$(this).parent().find('.active').removeClass('active');
			$('.p_' + $(this).data('pid')).hide();
			$('.v_' + $(this).data('vid')).show();
			$('.var_' + $(this).data('vid')).addClass('active');

		});

		$('.matchProducts .vb-image-holder').matchHeight();
		$('.matchProductsTitle').matchHeight();
		$('.matchBoxes').matchHeight();
		if ($('.productsSelectBox').length) {
			$.fn.matchHeight._afterUpdate = function (event, groups) {
				if ($('.matchProducts').length > 1) {
					//$('.productsSelectBox .matchProducts .bottom-card').css('position','absolute');
					//$('.productsSelectBox .matchProducts .bottom-card').css('margin-top','0');
				}
			}
		}

		$(".intervaloSelectBtn").on("click", function () {
			//$('#productsSelectBox').hide();
			//$('.selectIntervalo').show();

			$('.lateralIntervalos').show();

			window.dataLayer.push({ "event": "Compra_Ir_SelecionarIntervalo" });
		});

		$('.ico_carrinho').on('click', function () {
			$('.lista_assinatura').css('display', 'block');
		});

		var twoStepInterval = true;
		function setFuncionamento()
		{
			$('#result_bottom').show();
			$('.selectedInterval').removeClass('active');
			selectedFrequency = undefined;

			twoStepInterval = true;
			if( $(window).height() > 850 && $(window).width() > 700 )
			{
				twoStepInterval = false;
			}
	
			if(twoStepInterval)
			{
				$('.lateralIntervalos').css('display','none');
				$("#intervaloSelectBtn .selbtn-intervalo").html('Selecionar intervalo');
			} else {
				$('.lateralIntervalos').css('display','block');
				$("#intervaloSelectBtn .selbtn-intervalo").html('Prosseguir');
			}
		}
		$(window).on(
			'resize',
			function(){
				setFuncionamento();
			}
		);
		setFuncionamento();

		$('#intervaloSelectBtn').on("click", function () {
			if (cartItems.length == 0) {
				$('#modalMessageText').text("Adicione um item ao carrinho!");
				$('.modalMessage').modal({ backdrop: 'static', keyboard: false });
				return;
			}
			if(twoStepInterval)
			{
				window.dataLayer.push({ "event": "Compra_Ir_SelecionarIntervalo" });

				$('.lateralIntervalos').show();
				$('#result_bottom').hide();
			} else {
				var interval = $('.selectedInterval.active').data('interval');
				if (interval == undefined) {
					$('#modalMessageText').text("Selecione um intervalo de entrega!");
					$('.modalMessage').modal({ backdrop: 'static', keyboard: false });
					return;
				}
				selectedFrequency = interval;
				window.dataLayer.push({ "event": "Compra_Intervalo_Selecionado", "Intervalo": selectedFrequency });
				updateCart();
				$('.flex_bottom').html('carregando ..')
			}
		});

		$('.selectedInterval').on("click", function () {
			if(twoStepInterval)
			{
				selectedFrequency = $(this).data('interval');
				window.dataLayer.push({ "event": "Compra_Intervalo_Selecionado", "Intervalo": selectedFrequency });
				updateCart();
				$('.flex_bottom').html('carregando ..');
			} else {
				$('.selectedInterval').removeClass('active');
				$(this).addClass('active');
			}
		});

		var removeItems = [];
		$('.btn-go-to-cart').on("click", function () {
			//removeItems = cartItems;
			if (selectedFrequency == 30 || selectedFrequency == 60 || selectedFrequency == 90) {
				window.dataLayer.push({ "event": "Compra_Intervalo_Selecionado", "Intervalo": selectedFrequency });
				updateCart();
			}

		});

		$('#checkoutFinal').on('click', function () {

			window.dataLayer.push({ "event": "Compra_Checkout_Final" });
			window.dataLayer.push(transactionProducts);

		});

		function updateCart() {
			var removeData = { updates: {} };

			for (var i = 0; i < cartItems.length; i++) {
				removeData.updates[cartItems[i].id] = 0;
			}

			$.post('/cart/update.js', removeData, null, 'json')
				.success(function (response) {
					addItemsAndToRedirect();
				});
		}

		function addItemsAndToRedirect() {

			var product_add = cartItems.shift();

			$.post('/cart/add.js', {
				quantity: 1,
				id: product_add.id,
				"properties[shipping_interval_frequency]": selectedFrequency,
				"properties[shipping_interval_unit_type]": '' + product_add.properties.shipping_interval_unit_type,
				"properties[subscription_id]": '' + product_add.properties.subscription_id
			},
				null,
				'json').success(function (response) {
					if (cartItems.length) {
						addItemsAndToRedirect();
					} else {
						window.location.href = "/cart";
					}
				}).error(function () {

				});
		}

		$('#RecoverPassword').on('click', function () {
			$('.recoverModal').modal('show');
		});

		/**
		* Funcao que check se o cep eh atendido
		* @return Boolean
		*/
		function checkCepBlocked(cep) {
			var key = cep.substr(0, 3);

			switch (key) {
				case '048':
				case '049':
				case '074':
				case '078':
				case '079':
				case '083':
				case '084':
				case '085':
				case '086':
				case '087':
				case '094':
				case '132':
					return true;
					break;
				default:
					return false;
			}
		}

		/**
		* Funcao que checa a regiao de entrega
		* @return Boolean
		*/
		function checkCepRegion(cep) {
			if (cep >= '01000000' && cep <= '04799999') return true;
			if (cep >= '05000000' && cep <= '07399999') return true;
			if (cep >= '07500000' && cep <= '07799999') return true;
			if (cep >= '08000000' && cep <= '08299999') return true;

			return false;
		}

		/**
		* Modal range ceps
		*/
		function getCepModal() {
			var cep = document.getElementById('getCepInput').value;
			cep = cep.replace(/[^0-9\.]+/g, "");

			if (cep.length > 5) {
				var checkBlocked = checkCepBlocked(cep);

				if (!checkBlocked) {
					var checkRegion = checkCepRegion(cep);

					if (checkRegion) {
						window.dataLayer.push({ "event": "Endereco_Informado_Sucesso", "address": cep });
						$('#checkoutFinal').click();
						$('.modalCep').modal('hide');
						return false;
					}
				}
			}
			window.dataLayer.push({ "event": "Endereco_Informado_NaoEntrega", "address": cep });
			$('.modalCep').modal('hide');
			$('.modalCepErro').modal('show');
			return false;
		}

		if (document.getElementById('cepFormModal')) {
			document.getElementById('cepFormModal').onsubmit = getCepModal;
		}

		if (document.getElementById('checkoutFinalBtn')) {
			var checkoutFinalBtn = document.getElementById('checkoutFinalBtn');

			checkoutFinalBtn.addEventListener('click', function (event) {
				event.preventDefault();

				$('.modalCep').modal('show');
				return false;
			});
		}

		if (document.getElementById('btnAlertHide')) {
			var boxAlertTop = document.getElementById('btnAlertHide');

			boxAlertTop.addEventListener('click', function (event) {
				event.preventDefault();

				$('.header-alert').css('display', 'none');
			});
		}

		var selectedFrequency = '';
		var disabledButtons = false;
		$('.btn-add-to-cart').on('click', function () {
			var checkItem = checkItemQtd($(this).data('pid'));
			if( !disabledButtons && checkItem < 3 ){
				disabledButtons = true;
				$.post(
					'/cart/add.js', 
					{
						quantity: 1,
						id: $(this).data('vid'),
						"properties[shipping_interval_unit_type]": '' + $(this).data('unit'),
						"properties[subscription_id]": '' + $(this).data('subid'),
						"properties[shipping_interval_frequency]": '30'
					},
					null,
					'json'
				)
				.success(function (response, status) {
					if(!$('.lista_assinatura').is(':visible'))
						$('.ico_carrinho').click();

					window.dataLayer.push({ "event": "Compra_AdicionarCarrinho_Sucesso" });
					mountCartItems()
				})
				.error(function (error) {
					disabledButtons = false;
					window.dataLayer.push({ "event": "Compra_AdicionarCarrinho_Erro", "errorMessage": error.responseJSON.description });
					$('#modalMessageText').text(error.responseJSON.description);
					$('.modalMessage').modal({ backdrop: 'static', keyboard: false });
				});
			}
		});

		$('.remove-cart-item').on("click", function () {
			var item_id = $(this).data("id");
			var removeData = { updates: {} };
			removeData.updates[parseInt(item_id)] = 0;

			$.post('/cart/update.js', removeData, null, 'json')
				.success(function (response) {
					var position = cartItems.findIndex(x => x.id == item_id);
					if (position != -1) {
						cartItems.splice(position, 1);
						mountCartItems();
					}
				});
		});

		function mountCartItems() {
			cartLocalItems = [];
			var total_discount = 0;
			var total_price = 0;
			$("#final_discount_result").html('R$ 0,00');
			$("#final_price_result").html('R$ 0,00');

			// if(!$('.lista_assinatura').is(':visible'))
			// 	$('.ico_carrinho').click();

			$.get('/cart.js', function (response) {
				$('.prod_car_list ul').html(' ');
				cartItems = response.items;
				if(response.items.length)
				{
					defaultValues = [
						'##product##',
						'##image##',
						'##id##',
						'##variant_id##',
						'##quantity##'
					];

					items = response.items;
					for (i in items) {

						if( cartLocalItems[items[i].product_id] == undefined )
							cartLocalItems[items[i].product_id] = 0;
						
						cartLocalItems[items[i].product_id] += items[i].quantity
						

						replaceValues = [
							items[i].product_title,
							items[i].image,
							items[i].id,
							items[i].variant_id,
							items[i].quantity
						];
	
						contentPre = $('#cart-item-skeleton').html();
						contentPre = contentPre.replaceArray( defaultValues, replaceValues );
	
						preItem = $('<li></li>').html( contentPre );
	
						$('.prod_car_list ul').append(preItem);
						$('#item-' + items[i].id + ' .cap').load('/products/' + items[i].handle + '.js',function(divResponse){
							parentDiv = $(this).closest('.car_prod_item');
							divID = parentDiv.attr('id');
							variantID = $('#' + divID + ' .variantid').val();
							iquantity = $('#' + divID + ' .iquantity').val();
							variantValues = JSON.parse(divResponse);
							final = 0;

							for( j in variantValues.variants )
							{
								if( variantValues.variants[j].id == variantID )
								{
									compare = variantValues.variants[j].compare_at_price
									price = variantValues.variants[j].price
									total_discount += ( compare - price ) * iquantity;
									total_price += price * iquantity;
								}
							}
							if(total_price)
							{
								$("#final_discount_result").html(theme.Currency.formatMoney(total_discount, 'R$ {{amount_with_comma_separator}}'));
								$("#final_price_result").html(theme.Currency.formatMoney(total_price, 'R$ {{amount_with_comma_separator}}'));
								$("#" + divID + ' .cap').html(theme.Currency.formatMoney(compare, 'R$ {{amount_with_comma_separator}}'));
								$("#" + divID + ' .price').html(theme.Currency.formatMoney(price, 'R$ {{amount_with_comma_separator}}'));
							}
						});

					} // for
					$('#intervaloSelectBtn').attr('disabled', false);
				} else {
					$('.prod_car_list ul').html('<li>' + $('#empty-cart').html() + '</li>');

					$('#intervaloSelectBtn').attr('disabled', true);
				}

				disabledButtons = false;

				if(!$('.m_t_itens').length){
						$('.ico_carrinho').parent().append('<div class="m_t_itens">'+response.items.length+'</div>');
				}else{
					$('.m_t_itens').html(response.items.length);
				}


				// cartItems = response.items;
				// for ( item in items )
				// {
				// 	qtdCarItens[item.id] = item.quantity;
				// }

				// total_price = 0;
				// total_discount = 0;

				// var html = '';
				// for(var i = 0; i < cartItems.length; i++){
				// 	html += '<div class="bg_fff car_prod_item col-12" data-uniqueid="'+ cartItems[i].id +'" data-uniqueqtd="'+ cartItems[i].quantity +'"><div class="row align-items-center"><div class="col-md-2 col-6">';
				// 	html += '<img class="img-responsive img-cart" alt="" style="width:35px;" src="'+cartItems[i].image+'"></div>';
				// 	html += '<div class="col-md-4 col-6"><div class="c_l_blue f14">'+cartItems[i].product_title+'</div><div class="f14 normal"></div>';
				// 	html += '</div>';
				// 	html += '<div class="col-md-6 col-6"><a href="javascript:void(0);" class="right pull-right pointer remove-cart-item" data-id="'+cartItems[i].id+'"><img src="//cdn.shopify.com/s/files/1/0010/3150/3987/t/46/assets/close.png?2481023071720560370" /></a>';
				// 	html += '<div class="f14 c_blue margin_t_15">De: <span class="sti_d">'+theme.Currency.formatMoney(cartItems[i].formated_compare, 'R$ {{amount_with_comma_separator}}')+'</span></div>';
				// 	html += '<div class="f21 c_l_blue"><span class="f14 c_blue">Por: </span> <span class="price">'+cartItems[i].formated_price+'</span></div>';
				// 	html += '</div></div></div>';

				// 	total_price += parseInt(cartItems[i].price);
				// 	total_discount += parseInt(cartItems[i].formated_compare);
				// }

				// $('.prod_car_list').html(html);

				// if(!$('.m_t_itens').length){
				// 		$('.ico_carrinho').parent().append('<div class="m_t_itens">'+cartItems.length+'</div>');
				// }else{
				// 	$('.m_t_itens').html(cartItems.length);
				// }


				// $('.final_discount').text('Você economiza '+ theme.Currency.formatMoney(total_discount - total_price, 'R$ {{amount_with_comma_separator}}'));
				// $('.final_price').text("Total: "+theme.Currency.formatMoney(total_price, 'R$ {{amount_with_comma_separator}}'));

				// if(cartItems.length > 0){
				// 	$('#intervaloSelectBtn').attr('disabled', false);
				// }else{
				// 	$('#intervaloSelectBtn').attr('disabled', true);
				// }
				// if(!$('.lista_assinatura').is(':visible'))
				// 	$('.ico_carrinho').click();

				// 	$('.subtotal-box').css('display', 'block');

				$('.remove-cart-item').on("click",function(){
					var item_id = $(this).data("id");
					var removeData = {updates:{}};
					removeData.updates[parseInt(item_id)] = 0;

					$.post('/cart/update.js',removeData, null, 'json')
						.success(function(response){

							// var position = cartItems.findIndex(x=> x.id == item_id);

							// if(position != -1){
								//cartItems.splice(position, 1);
								mountCartItems();
							// }
						});
				});

			}, "json");


		} // mountCartItems 
		if( $('#carrinho').length )
			mountCartItems();

	} // end load

	$('.card-a').on(
		'click',
		function()
		{
			document.location = $(this).data('link');
			return;
		}
	);

	if ((typeof (jQuery) == 'undefined') || (parseInt(jQuery.fn.jquery) == 1 && parseFloat(jQuery.fn.jquery.replace(/^2\./, "")) < 2.4)) {
		loadScript('//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js', function () {
			jQuery224 = jQuery.noConflict(true);
			loadMainVB(jQuery224);
		});
	} else {
		loadMainVB(jQuery);
	}
})();
