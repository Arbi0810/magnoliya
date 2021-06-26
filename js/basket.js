BX.ready(function(){
	if(!BX.Sale || !BX.Sale.BasketComponent)
		return;
		
		logictimBasket('first');
});

BX.addCustomEvent('onAjaxSuccess', function(command,params) {logictimBasket(params);});


function logictimBasket(params) {
	
	if(!BX.Sale || !BX.Sale.BasketComponent)
		return;
		
	if(!BX.Sale.BasketComponent.result.GRID.ROWS && BX.Sale.BasketComponent.result.BASKET_ITEM_RENDER_DATA) //DLYA ASPRO
		BX.Sale.BasketComponent.result.GRID.ROWS = BX.Sale.BasketComponent.result.BASKET_ITEM_RENDER_DATA;
	if(!BX.Sale.BasketComponent.result.GRID.ROWS)
		return;
	
	if(params.url == '/bitrix/components/logictim/bonus.ajax/bonus_cart_ajax.php')
		return;
		
	console.log(BX.Sale.BasketComponent.result.GRID.ROWS);
	
	//CHECK CAN_BUY
	var rows = [];
	for(id in BX.Sale.BasketComponent.result.GRID.ROWS) {
		var row = BX.Sale.BasketComponent.result.GRID.ROWS[id];
		if(row['CAN_BUY'] != 'N' && row['NOT_AVAILABLE'] != true)
			rows[id] = row;
	}
	
		
	BX.ajax({
		url: '/bitrix/components/logictim/bonus.ajax/bonus_cart_ajax.php',
		method: 'POST',
		data: rows,
		dataType: 'json',
		onsuccess: function(result) {
			setBonusInBasket(result);
		}
	});
}

function setBonusInBasket(result) {
	//console.log(result);
	
	var itog_block = BX.findChild(BX('basket-root'), {'tag': 'div', 'class': 'basket-checkout-block-total-price-inner'}, true);
	var bonus_all = BX.create('DIV', {props: {id: 'bonus_all'}, style: {order: '10'}, html: result.ALL_BONUS + ' ' + result.TEXT.TEXT_BONUS_FOR_ITEM});
	BX.remove(BX('bonus_all'));
	
	if(parseFloat(result.ALL_BONUS) > 0)
		itog_block.appendChild(bonus_all);
	
	for(id in result.ITEMS) {
		var item = result.ITEMS[id];
		var product_block = BX('basket-item-'+item.BASKET_ITEM_ID);
		
		if(!product_block)
			continue;
		
		var price_blocks = BX.findChild(product_block, {'tag': 'div', 'class': 'basket-item-block-price'}, true, true);
		var price_for_one = price_blocks[0];
		var price_for_item = price_blocks[1];
		var bonus_item = BX.create('DIV', {props: {id: 'bonus_item_'+item.BASKET_ITEM_ID, className: 'bonus bonus_item_cart'}, style: {order: '10'}, html: item.ADD_BONUS + ' ' + result.TEXT.TEXT_BONUS_FOR_ITEM});
		BX.remove(BX('bonus_item_'+item.BASKET_ITEM_ID));
		
		if(parseFloat(item.ADD_BONUS) > 0)
			price_for_item.appendChild(bonus_item);
		//console.log(price_for_one);
	}
	
	
}