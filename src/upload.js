import sketch from 'sketch'
import { getStoredCredentials } from './utils';

const { UI, Settings } = sketch

export function upload() {
    const { cloud_name } = getStoredCredentials();
    var artboards = sketch.getSelectedDocument().selectedLayers.layers;
    console.log(artboards);
    artboards.forEach(function(ab){
    	if (ab && ab.selected) console.log(ab.name);
    	const options = { formats: 'png', output: false};
			const buffer = sketch.export(ab, options);
			// const file = new File(buffer, "file.png");
			console.log(typeof buffer)
    	var data = new FormData();
    	//{
        data.append("upload_preset", "preset",);
        data.append("file", "data:image/png;base64," + buffer.toString('base64'));
        // data.append("file", new Blob([buffer]));
        data.append("folder", "myfolder"); //folder input from user
        data.append("public_id", ab.name); //artboard name - auto generate
	    //};

	    fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
	    	method: 'POST',
	    	headers: {
	    		'Content-Type': 'application/json'
	    	},
	    	body: data
	    }).then(function(response){return response.json();})
	    .then(function(data) {
	        console.log(data);
		  });
    })
    if (!cloud_name) {
        UI.alert('⚠️ You need to configure Cloudinary account');
        return -1;
    }
}

export default upload;