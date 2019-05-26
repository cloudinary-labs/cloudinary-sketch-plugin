import sketch from 'sketch'
import { getStoredCredentials } from './utils';

const { UI, Settings } = sketch

export function upload() {
    const { cloud_name } = getStoredCredentials();

    if (!cloud_name) {
        UI.alert('⚠️ You need to configure Cloudinary account');
        return -1;
    }

    var data = {
        "upload_preset": "preset",
        "file": "https://res.cloudinary.com/demo/w_50/sample.jpg", //
        "folder": "myfolder", //folder input from user
        "public_id": "artboard_name" //artboard name - auto generate
    };

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