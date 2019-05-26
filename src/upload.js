var cloud_name = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');
var api_key = NSUserDefaults.standardUserDefaults().objectForKey('apikey');
var api_secret = NSUserDefaults.standardUserDefaults().objectForKey('secretkey');

var data = {
    "upload_preset": "preset",
    "file": "https://res.cloudinary.com/demo/w_50/sample.jpg",
    "folder": "myfolder",
    "public_id": "artboard_name"
};

export function search(cloudName, apiKey, secretKey) {
    if (!cloudName || !apiKey || !secretKey) return -1;
    fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
    	method: 'POST',
    	headers: {
    		'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(data)
    }).then(function(response){return response.json();})
    .then(function(data) {
        console.log(data);
	  });
}

search(cloud_name,api_key,api_secret);