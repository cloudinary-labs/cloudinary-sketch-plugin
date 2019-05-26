import sketch from 'sketch'

const { UI, Settings } = sketch

export function search() {
    let selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;
    let previousTerms = selectedLayers.map(layer => Settings.layerSettingForKey(layer, 'cloudinary.search.terms'))
    let firstPreviousTerm = previousTerms.find(term => term !== undefined)
    let previousTerm = firstPreviousTerm || '';

    UI.getInputFromUser('Search for a photo...',
        { initialValue: previousTerm },
        (err, searchTerm) => {
            if (err) { return } // user hit cancel
            if ((searchTerm = searchTerm.trim()) !== 'null') {
                selectedLayers.forEach(layer => {
                    Settings.setLayerSettingForKey(layer, 'cloudinary.search.terms', searchTerm)
                })

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
                
                if (!cloud_name || !api_key || !api_secret) return -1;

                fetch(`https://${api_key}:${api_secret}@api.cloudinary.com/v1_1/${cloud_name}/resources/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': 'Basic ' + btoa(api_key + ":" + api_secret)
                    },
                    body: JSON.stringify(data)
                }).then(function(response){return response.json();})
                .then(function(data) {
                    console.log(data);
                    UI.alert('Success', 'kljahdfl');
                    });
            }
        }
    );
}

export default search;
