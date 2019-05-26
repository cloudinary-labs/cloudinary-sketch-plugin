import sketch from 'sketch'
import { getStoredCredentials } from './utils';

const { UI, Settings } = sketch

export function upload() {
    const { cloud_name } = getStoredCredentials();
    if (!cloud_name) {
        UI.alert('⚠️ You need to configure Cloudinary account');
        return -1;
    }

    var artboards = sketch.getSelectedDocument().selectedLayers.layers;
    let previousFolder = artboards.map(layer => Settings.layerSettingForKey(layer, 'cloudinary.upload.folder'))
    let firstPreviousFolder = previousFolder.find(term => term !== undefined)
    let pFolder = firstPreviousFolder || '';

    UI.getInputFromUser('Any specific folder to upload to...',
        { initialValue: pFolder },
        (err, folder) => {
            if (err) return; // user hit cancel
            const terms = folder.trim();

            artboards.forEach(function(ab){
                if (ab && ab.selected) console.log(ab.name);

                const options = { formats: 'png', output: false};
                const buffer = sketch.export(ab, options);
                var data = new FormData();
                data.append("upload_preset", "preset",); //user generated
                data.append("file", "data:image/png;base64," + buffer.toString('base64'));
                data.append("folder", terms); //folder input from user
                data.append("public_id", ab.name); //artboard name - auto generate
        
                UI.message('⏰ Uploading, please wait ...');
                fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                })
                .then(function(response){return response.json();})
                .then(function(data) {
                    console.log(data);
                    UI.message('🚀 Uploaded successfully!!!');
                  });
            })
        }
    )
    
}

export default upload;