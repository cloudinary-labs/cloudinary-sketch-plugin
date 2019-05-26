export function search() {
	var cloud_name = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');
	var api_key = NSUserDefaults.standardUserDefaults().objectForKey('apikey');
	var api_secret = NSUserDefaults.standardUserDefaults().objectForKey('secretkey');

	var data = {
	    "max_results": "3",
	    "sort_by": [
	        {"public_id": "desc"}   
	    ],
	    "expression": "public_id:sample"
	};

	export function search(cloudName, apiKey, secretKey) {
	    if (!cloudName || !apiKey || !secretKey) return -1;
	    fetch(`https://fapi.cloudinary.com/v1_1/${cloud_name}/resources/search`, {
	    	method: 'POST',
	    	headers: {
	    		'Content-Type': 'application/json',
	    		'Authorization': 'Basic ' + btoa(api_key + ":" + api_secret)
	    	},
	    	body: JSON.stringify(data)
	    }).then(function(response){return response.json();})
	    .then(function(data) {
	        console.log(data);
		  });
	}

	export default search(cloud_name,api_key,api_secret);
}