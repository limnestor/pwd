window.onload = function() 
{
	if ('serviceWorker' in navigator) 
	{
		navigator.serviceWorker.register('./js/service-worker.js');
	}
}
