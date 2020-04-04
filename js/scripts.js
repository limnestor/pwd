window.onload = function() 
{
	if ('serviceWorker' in navigator) 
	{
		navigator.serviceWorker.register('/pwd/service-worker.js')
			.then(function(registration) 
			{
				console.log('Registration successful, scope is:', registration.scope);
			})
			.catch(function(error) 
			{
				console.log('Service worker registration failed, error:', error);
			});
	}
	
	var popupRestoAmount = $('#amtRestoBilled').popup
		({
			content : 'Please enter a correct amount.'
		});
	
	var popupGroceryAmount = $('#amtGroceryBilled').popup
		({
			content : 'Please enter a correct amount.'
		});
			
	$("#btnRestoCompute").click
	(
		function() 
		{
			var stAmount = $("#amtRestoBilled").val().replace(/,/g, '');
			
			if (isNaN(stAmount))
			{
				popupRestoAmount.popup('show');
				$('#vatDiscount').val("0.00");
				$('#twentyDiscount').val("0.00");
				$('#totalDiscount').val("0.00");
				$('#amountPayable').val("0.00");
				
				return;
			}
			
			var isNoVAT = $("#novat").prop("checked");

			var flAmount = forceParseFloat(stAmount);
			
			var flVATDiscount = 0;
			
			if (!isNoVAT)
			{
				flVATDiscount = roundTo2(flAmount * 0.12 / 1.12);
			}
			
			var fl20Discount = roundTo2((flAmount - flVATDiscount) * 0.2);
			
			var flTotalDiscount = roundTo2(flVATDiscount + fl20Discount);
			
			var flAmountDue = roundTo2((flAmount - flVATDiscount - fl20Discount));

			$('#vatDiscount').val(flVATDiscount.toFixed(2));
			$('#twentyDiscount').val(fl20Discount.toFixed(2));
			$('#totalDiscount').val(flTotalDiscount.toFixed(2));
			$('#amountPayable').val(flAmountDue.toFixed(2));
		}
	);
	
	$("#btnGroceryCompute").click
	(
		function() 
		{
			var stAmount = $("#amtGroceryBilled").val();
			
			if (isNaN(stAmount))
			{
				popupGroceryAmount.popup('show');
				$('#fiveDiscount').val("0.00");
				$('#amountGroceryPayable').val("0.00");
				
				return;
			}
			
			var isNoVAT = $("#novatgrocery").prop("checked");
			
			var flAmount = forceParseFloat(stAmount);
			
			var flVATRate = 1.12;
			
			if (isNoVAT)
			{
				flVATRate = 1;
			}
			
			var fl5Discount = roundTo2(flAmount / flVATRate * 0.05);
			
			var flAmountDue = roundTo2((flAmount - fl5Discount));

			$('#fiveDiscount').val(fl5Discount.toFixed(2));
			$('#amountGroceryPayable').val(flAmountDue.toFixed(2));
		}
	);
	
	
	$('.menu .item').tab();
	$('.ui.checkbox').checkbox();
}

/** 
 * Converts a string to float.  If the string is not a number then it returns 0.00.
 *
 * @param (string) stValue The string value to be converted to float.
 * @return float equivalent of the string value
 * @type float
 * @author Nestor Lim
 * @version 1.0.0
 */
function forceParseFloat(stValue)
{
    var flValue = parseFloat(stValue);
    
    if (isNaN(flValue))
    {
        return 0.00;
    }
    
    return flValue;
}

function roundTo2(flNumber)
{
	return Math.round(flNumber * 100) / 100;
}