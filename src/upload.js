import sketch from 'sketch'
import { getStoredCredentials, createUploadScreen } from './utils';

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

    var last_preset = NSUserDefaults.standardUserDefaults().objectForKey('preset')
    var last_folder = NSUserDefaults.standardUserDefaults().objectForKey('folder')
  
    var popup = createUploadScreen(context, last_preset, last_folder)
  
    var alert = popup[0];
    var inputs = popup[1];
    var response = alert.runModal();
  
    // save button was pressed
    if ( response === 1000 ) {
      
      var preset = inputs[0].stringValue()
      var folder = inputs[1].stringValue()
      NSUserDefaults.standardUserDefaults().setObject_forKey(preset, 'preset')
      NSUserDefaults.standardUserDefaults().setObject_forKey(folder, 'folder')

        artboards.forEach(function(ab){
            if (ab && ab.selected) {
                const options = { formats: 'png', output: false};
                const buffer = sketch.export(ab, options);

                var data = new FormData();
                data.append("upload_preset", preset); //user generated
                data.append("file", "data:image/png;base64," + buffer.toString('base64'));
                data.append("folder", folder); //folder input from user
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
                    if (data.error) UI.message('Something was wrong');
                    else UI.message('🚀 Uploaded successfully!!!');
                });
            }
            else {
                UI.message('To upload, select an artboard.');
            }
        
        })
    }
    
}

export default upload;