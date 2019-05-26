import os from 'os';
import sketch from 'sketch'
import path from 'path'
import util from 'util'
import fs from '@skpm/fs';
import {getOrientations} from './utils';

const API_ENDPOINT = 'https://res.cloudinary.com/';
const FOLDER = path.join(os.tmpdir(), 'com.sketchapp.cloudinary-plugin')

const { DataSupplier, UI, Settings } = sketch
const flatten = (arrays) => {
    return arrays.reduce((prev, array) => prev.concat(array), [])
}

export const getPhotoById = () => {
    let selectedLayers = sketch.getSelectedDocument().selectedLayers.layers;
    let previousTerms = selectedLayers.map(layer => Settings.layerSettingForKey(layer, 'cloudinary.search.publicId'))
    let firstPreviousTerm = previousTerms.find(term => term !== undefined)
    let previousTerm = firstPreviousTerm || '';

    // TODO: support multiple selected layers with different search terms for each
    if (sketch.version.sketch < 53) {
        const searchTerm = UI.getStringFromUser('Get photo with public id...', previousTerm).trim()
        if (searchTerm !== 'null') {
            selectedLayers.forEach(layer => {
                Settings.setLayerSettingForKey(layer, 'cloudinary.search.publicId', searchTerm)
            })
        }
    } else {
        UI.getInputFromUser('Get photo from Cloudinary with public id...',
            { initialValue: previousTerm },
            (err, searchTerm) => {
                if (err) { return } // user hit cancel
                if ((searchTerm = searchTerm.trim()) !== 'null') {
                selectedLayers.forEach(layer => {
                    Settings.setLayerSettingForKey(layer, 'cloudinary.search.publicId', searchTerm)
                })
                calculateImageUrl(context, searchTerm);
                // setImageForContext(context, null, searchTerm);
                }
            }
        )
    }
}


const calculateImageUrl = (context, publicId) => {
    const dataKey = context.data.key;
    const cloudname = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');
    const errorMsg = !cloudname ? '⚠️ You need to configure Cloudinary account' : (!publicId ? '😰 No public id provided' : '');
    
    if (errorMsg) { UI.alert('Warning', errorMsg); }

    const items = util.toArray(context.data.items).map(sketch.fromNative);

    const orientations = getOrientations(items);

    const mappedData = items.map((item, index) => {
        const mappedOrientation = {...flatten(Object.values(orientations))[index]};
        console.log(`${API_ENDPOINT}${cloudname}/image/upload/w_${mappedOrientation.frame.width*4},h_${mappedOrientation.frame.height*4},q_auto,c_fill,g_auto/${publicId}.png`);
        return ({
            item: item,
            url: `${API_ENDPOINT}${cloudname}/image/upload/w_${mappedOrientation.frame.width*4},h_${mappedOrientation.frame.height*4},q_auto,c_fill,g_auto/${publicId}.png`,
        });
    });

    mappedData.forEach((data, index) => {
        return fetch(data.url)
            .then(res => res.blob())
            // TODO: use imageData directly, once #19391 is implemented
            .then(saveTempFileFromImageData)
            .then(imagePath => {
                if (!imagePath) {
                    // TODO: something wrong happened, show something to the user
                    return
                }
                DataSupplier.supplyDataAtIndex(dataKey, imagePath, index)
            
                // store where the image comes from, but only if this is a regular layer
                if (data.item.type !== 'DataOverride') {
                    Settings.setLayerSettingForKey(data.item, SETTING_KEY, data.item.id)
                }
            
                UI.message('📷 on Cloudinary')
            })
            .catch((err) => {
            console.error(err)
                return context.plugin.urlForResourceNamed('placeholder.png').path()
            })
    })
}

function saveTempFileFromImageData (imageData) {
    const guid = NSProcessInfo.processInfo().globallyUniqueString()
    const imagePath = path.join(FOLDER, `${guid}.jpg`)
    try {
      fs.mkdirSync(FOLDER)
    } catch (err) {
      // probably because the folder already exists
      // TODO: check that it is really because it already exists
    }
    try {
      fs.writeFileSync(imagePath, imageData, 'NSData')
      return imagePath
    } catch (err) {
      console.error(err)
      return undefined
    }
  }

export default getPhotoById;