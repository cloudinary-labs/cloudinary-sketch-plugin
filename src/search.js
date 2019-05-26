import util from 'util'
import sketch from 'sketch'
import { getStoredCredentials, getOrientations } from './utils';
import { API_ENDPOINT, SETTING_KEY, saveTempFileFromImageData, flatten } from './cloudinary'

const { UI, Settings, DataSupplier } = sketch

export function search() {
    let selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;
    let previousTerms = selectedLayers.map(layer => Settings.layerSettingForKey(layer, 'cloudinary.search.terms'))
    let firstPreviousTerm = previousTerms.find(term => term !== undefined)
    let previousTerm = firstPreviousTerm || '';

    if (sketch.version.sketch < 53) {
        const searchTerm = UI.getStringFromUser('Search for a photo...', previousTerm).trim()
        if (searchTerm !== 'null') {
            getLayersAndMap(selectedLayers, context, searchTerm);
        }
    } else {
        UI.getInputFromUser('Search for a photo...',
            { initialValue: previousTerm },
            (err, searchTerm) => {
                if (err) return; // user hit cancel
                const terms = searchTerm.trim();

                if (terms !== 'null') {
                    getLayersAndMap(selectedLayers, context, terms);
                }
            }
        )
    }
}

const getLayersAndMap = (selectedLayers, context, searchTerm) => {
    const { cloud_name, api_key, api_secret } = getStoredCredentials();
    const dataKey = context.data.key;

    selectedLayers.forEach(layer => {
        Settings.setLayerSettingForKey(layer, 'cloudinary.search.terms', searchTerm)
    })

    const items = util.toArray(context.data.items).map(sketch.fromNative);

    UI.message('🔍 Searching...');
    const data = {
        max_results: items.length, 
        sort_by: [
            { public_id: "desc"}   
        ],
        expression: `tags:${searchTerm}`
    };

    fetch(`https://${api_key}:${api_secret}@api.cloudinary.com/v1_1/${cloud_name}/resources/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(function(response){return response.json();})
    .then(function(data) {
        console.log(data);

        const resources = data.resources;
    
        const orientations = getOrientations(items);
    
        const mapped =  items.map((item, index) => {
            const mappedOrientation = {...flatten(Object.values(orientations))[index]};
            const resource = resources[index] ? resources[index] : resources[resources.length - 1];
console.log(`${API_ENDPOINT}${cloud_name}/image/upload/w_${mappedOrientation.frame.width*4},h_${mappedOrientation.frame.height*4},q_auto,c_fill,g_auto/${resource.public_id}.png`);
            return ({
                item: item,
                url: `${API_ENDPOINT}${cloud_name}/image/upload/w_${mappedOrientation.frame.width*4},h_${mappedOrientation.frame.height*4},q_auto,c_fill,g_auto/${resource.public_id}.png`,
            });
        });

        UI.message('🎑 Adding images...');

        mapped.forEach((data, index) => {
            return fetch(data.url)
                .then(res => res.blob())
                // TODO: use imageData directly, once #19391 is implemented
                .then(saveTempFileFromImageData)
                .then(imagePath => {
                    if (!imagePath) {
                        UI.message(`❌ Image path is not correct.`)
                        return
                    }
                    DataSupplier.supplyDataAtIndex(dataKey, imagePath, index)
                
                    // store where the image comes from, but only if this is a regular layer
                    if (data.item.type !== 'DataOverride') {
                        Settings.setLayerSettingForKey(data.item, SETTING_KEY, data.item.id)
                    }
                
                    UI.message(`✅ ${mapped.length} image(s) added!`)
                })
                .catch((err) => {
                    console.error(err);
                    UI.message(`😱 Something awful happened.`)
                    return context.plugin.urlForResourceNamed('placeholder.png').path()
                })
        })
    });
    
}

export default search;
