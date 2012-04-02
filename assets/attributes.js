Shopify.initializeCart = function(variant) {
    jQuery.ajax({ 
        type: 'GET',
        dataType: 'json',
        url: '/cart.js',
        success: function(cart) {
            if(cart.attributes == null && cart.items.length == 0){
                // if no locale is set and no items in cart
                // we can assume the cart is not initialized
                var create = {
                    type: 'POST',
                    url: '/cart/add.js',
                    data: {quantity: 1, id: variant},
                    dataType: 'json',
                    success: function(cart) {
                        jQuery.ajax({ 
                            type: 'POST', 
                            url: '/cart/clear.js', 
                            dataType: 'json', 
                            success: function(){}, 
                            error: function(){}
                        })
	    	        },
                    error: function(XMLHttpRequest, textStatus) {
                        //Shopify.onError(XMLHttpRequest, textStatus);
                    }
                };
                jQuery.ajax(create);
            }
        },
        error: function(XMLHttpRequest, textStatus) {
            //Shopify.onError(XMLHttpRequest, textStatus);
        }
    });
};

Shopify.clearCache = function(variant, callback) {
    //alert("Preparing to clear cache.");
    // the only know way to clear the cache, is to update the cart...
    var create = {
        type: 'POST',
        url: '/cart/add.js',
        data: {quantity: 1, id: variant},
        dataType: 'json',
        success: function(item) { 
            // first, we need to find the current quantity of this product
            //alert("Successfully added a product. Going to fetch the cart.");
            var cart = jQuery.ajax({
                type: 'GET',
                url: '/cart.js',      
                data: '',
                dataType: 'json',
                success: function(data, textStatus) {
                    //alert("Successfully fetched the cart.");
					//console.log("Successfully fetched the cart.");
                    new_quantity = 1;
                    $.each( $.parseJSON(cart.responseText).items, function(i, l){
                        if(l.variant_id == variant)
                            new_quantity = l.quantity - 1;
                    });
                    // then, subtract one
                    //alert("Going to remove one dummy product.");
                    var removal_params = {
                        type: 'POST',
                        url: '/cart/clear.js',
                        dataType: 'json',
                        success: function(cart) {
                            if ((typeof callback) === 'function') {
                                callback();
                            }
                        },
                        error: function(XMLHttpRequest, textStatus) {
                            Shopify.onError(XMLHttpRequest, textStatus);
                        }
                    };
					//console.log('removing params');
                    jQuery.ajax(removal_params);
                },
                error: function(XMLHttpRequest, textStatus) {
                    //alert("Error fecthing the cart:" + textStatus);
                    Shopify.onError(XMLHttpRequest, textStatus);
                }
            });
	    },
        error: function(XMLHttpRequest, textStatus) {
            Shopify.onError(XMLHttpRequest, textStatus);
        }
    };
    //alert("Going to add a product.");
    jQuery.ajax(create);
};

Shopify.onError = function(XMLHttpRequest, textStatus) {
  // Shopify returns a description of the error in XMLHttpRequest.responseText.
  // It is JSON.
  // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    alert(data.message + '(' + data.status  + '): ' + data.description);
  } else {
    alert('Error : ' + Shopify.fullMessagesFromErrors(data).join('; ') + '.');
  }
};

Shopify.fullMessagesFromErrors = function(errors) {
  var fullMessages = [];
  jQuery.each(errors, function(attribute, messages) {
    jQuery.each(messages, function(index, message) {
      fullMessages.push(attribute + ' ' + message);
    });
  });
  return fullMessages
}

Shopify.onCartUpdate = function(cart) {
  //alert('There are now ' + cart.item_count + ' items in the cart.');
};  

Shopify.onCartShippingRatesUpdate = function(rates, shipping_address) {
  //var readable_address = '';
  //if (shipping_address.zip) readable_address += shipping_address.zip + ', ';
  //if (shipping_address.province) readable_address += shipping_address.province + ', ';
  //readable_address += shipping_address.country
  //alert('There are ' + rates.length + ' shipping rates available for ' + readable_address +', starting at '+ Shopify.formatMoney(rates[0].price) +'.');
};  

Shopify.onItemAdded = function(line_item) {
  //alert(line_item.title + ' was added to your shopping cart.');
};

Shopify.onProduct = function(product) {
  //alert('Received everything we ever wanted to know about ' + product.title);
};