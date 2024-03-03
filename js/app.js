if(navigator.serviceWorker) {
	navigator
		.serviceWorker
		.register('./.././Emission_Spectra/service_worker_Emission_Spectra.js')
		.then(function(r) {
			console.log('NW  App now available offline');
		})
		.catch(function(e) {
			console.log('NW App NOT available offline');
			console.log(e);
		});
} else {
	console.log('Service workers are not supported');
}
