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
	
	$("#btnRestoCompute").click
	(
		function() 
		{
			var stAmount = $("#amtRestoBilled").val();
			
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

			$('#vatDiscount').val(flVATDiscount);
			$('#twentyDiscount').val(fl20Discount);
			$('#totalDiscount').val(flTotalDiscount);
			$('#amountPayable').val(flAmountDue);
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
 * @version 1.0
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