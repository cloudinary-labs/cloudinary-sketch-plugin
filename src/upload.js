import sketch from 'sketch'

const { UI, Settings } = sketch

export function upload() {
    var cloud_name = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');

    var data = {
        "upload_preset": "preset",
        "file": "https://res.cloudinary.com/demo/w_50/sample.jpg", //
        "folder": "myfolder", //folder input from user
        "public_id": "artboard_name" //artboard name - auto generate
    };

    if (!cloud_name) return -1;
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

export default upload;