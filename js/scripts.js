window.onload = function() 
{
	var flGroceryLimit = 2500;
	
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
			content : 'Please enter a correct amount here.'
		});
	
	var popupGroceryAmount = $('#amtGroceryBilled').popup
		({
			content : 'Please enter a correct amount here.'
		});
		
	var popupAmountRemaining = $('#amtRemaining').popup
		({
			content : 'Please enter a correct amount here.  The remaining amount for the week should be in your purchase booklet of ' + flGroceryLimit + ' pesos if not yet used for this week.'
		});
		
	var popupNumberPwd = $('#numberPwdDining').popup
		({
			content : 'Please enter a correct number here.'
		});
	
	var popupNumberNonPwd = $('#numberNonPwdDining').popup
		({
			content : 'Please enter a correct number here.'
		});
		
	function clearRestorantResults()
	{
		$('#vatDiscount').val("0.00");
		$('#twentyDiscount').val("0.00");
		$('#totalDiscount').val("0.00");
		$('#amountPayable').val("0.00");
	}
		
	popupRestoAmount.raiseError = 
		function()
		{
			popupRestoAmount.popup('show');
			clearRestorantResults();
		}
		
	popupNumberPwd.raiseError = 
		function()
		{
			popupNumberPwd.popup('show');
			clearRestorantResults();
		}	
	
	popupNumberNonPwd.raiseError = 
		function()
		{
			popupNumberNonPwd.popup('show');
			clearRestorantResults()
		}	

	popupGroceryAmount.raiseError = 
		function()
		{
			popupGroceryAmount.popup('show');
			$('#fiveDiscount').val("0.00");
			$('#amountGroceryPayable').val("0.00");	
		}	
	
	popupAmountRemaining.raiseError = 
		function()
		{
			popupAmountRemaining.popup('show');
			$('#fiveDiscount').val("0.00");
			$('#amountGroceryPayable').val("0.00");	
		}	

	$("#inresto").change
	(
		function()
		{
			var isInRestorant = $("#inresto").prop("checked");
			
			if (isInRestorant)
			{
				$('.restaurant').css("display", "inline");
				
				return;
			}
			
			$('.restaurant').css("display", "none");
		}
	);		
			
	$("#btnRestoCompute").click
	(
		function() 
		{
			var stAmount = $("#amtRestoBilled").val().replace(/,/g, '');
			
			if (isNaN(stAmount))
			{
				popupRestoAmount.raiseError();
				
				return;
			}
			
			var flAmount = forceParseFloat(stAmount);
			
			if (flAmount < 0)
			{
				popupRestoAmount.raiseError();
				
				return;
			}
			
			var isInRestorant = $("#inresto").prop("checked");
			
			var flNonPwdAmount = 0;
			
			if (isInRestorant)
			{
				var stNumberOfPwdDining = $("#numberPwdDining").val().replace(/,/g, '');
				var stNumberOfNonPwdDining = $("#numberNonPwdDining").val().replace(/,/g, '');
				
				if ((stNumberOfPwdDining.indexOf(".") > -1) || isNaN(stNumberOfPwdDining))
				{
					popupNumberPwd.raiseError();
					
					return;
				}
				
				if ((stNumberOfNonPwdDining.indexOf(".") > -1) || isNaN(stNumberOfNonPwdDining))
				{
					popupNumberNonPwd.raiseError();
					
					return;
				}
				
				var intNumberOfPwdDining = parseInt(stNumberOfPwdDining);
				var intNumberOfNonPwdDining = parseInt(stNumberOfNonPwdDining);
				
				if (intNumberOfPwdDining < 0)
				{
					popupNumberPwd.raiseError();
					
					return;
				}
				
				if (intNumberOfNonPwdDining < 0)
				{
					popupNumberNonPwd.raiseError();
					
					return;
				}
				
				if ((intNumberOfPwdDining + intNumberOfNonPwdDining) == 0)
				{
					popupNumberPwd.raiseError();
					
					return;
				}
				
				var flPwdAmount = flAmount * (intNumberOfPwdDining / (intNumberOfPwdDining + intNumberOfNonPwdDining));
				
				flNonPwdAmount = flAmount - flPwdAmount
				
				flAmount = flPwdAmount;
			}

			var isNoVAT = $("#novat").prop("checked");
			
			var flVATDiscount = 0;
			
			if (!isNoVAT)
			{
				flVATDiscount = roundTo2(flAmount * 0.12 / 1.12);
			}
			
			var fl20Discount = roundTo2((flAmount - flVATDiscount) * 0.2);
			
			var flTotalDiscount = roundTo2(flVATDiscount + fl20Discount);
			
			var flAmountDue = roundTo2((flAmount - flVATDiscount - fl20Discount + flNonPwdAmount));

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
			var stAmount = $("#amtGroceryBilled").val().replace(/,/g, '');
			
			if (isNaN(stAmount))
			{
				popupGroceryAmount.raiseError();
				
				return;
			}
			
			var isNoVAT = $("#novatgrocery").prop("checked");
			
			var flAmount = forceParseFloat(stAmount);
			
			if (flAmount < 0)
			{
				popupGroceryAmount.raiseError();
				
				return;
			}
			
			var stAmountRemaining = $("#amtRemaining").val().replace(/,/g, '');
			
			if (isNaN(stAmountRemaining))
			{
				popupAmountRemaining.raiseError();
				
				return;
			}
			
			var flAmountRemaining = forceParseFloat(stAmountRemaining);
			
			if ((flAmountRemaining < 0) || (flAmountRemaining > flGroceryLimit))
			{
				popupAmountRemaining.raiseError();
				
				return;
			}
			
			var flExcessAmount = 0;
			
			if (flAmount > flAmountRemaining)
			{
				flExcessAmount = flAmount - flAmountRemaining;
				
				flAmount = flAmountRemaining;
			}
			
			var flVATRate = 1.12;
			
			if (isNoVAT)
			{
				flVATRate = 1;
			}
			
			var fl5Discount = roundTo2(flAmount / flVATRate * 0.05);
			
			var flVATOfDiscount = fl5Discount * (flVATRate - 1);
			
			var flAmountDue = roundTo2(flAmount - fl5Discount + flExcessAmount - flVATOfDiscount);

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