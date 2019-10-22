import os from 'os';
import sketch from 'sketch'
import path from 'path'
import util from 'util'
import fs from '@skpm/fs';
import { getOrientations } from './utils';

export const API_ENDPOINT = 'https://res.cloudinary.com/';
export const FOLDER = path.join(os.tmpdir(), 'com.sketchapp.cloudinary-plugin')
export const SETTING_KEY = 'cloudinary.photo.id';

const { DataSupplier, UI, Settings } = sketch;

export const flatten = (arrays) => {
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
            setLayerAndFetch(selectedLayers, context, searchTerm);
        }
    } else {
        UI.getInputFromUser('Get photo from Cloudinary with public id...',
            { initialValue: previousTerm },
            (err, searchTerm) => {
                if (err) return; // user hit cancel
                const publicId = searchTerm.trim();

                if (publicId !== 'null') {
                    setLayerAndFetch(selectedLayers, context, publicId);
                }
            }
        )
    }
}

export const setLayerAndFetch = (selectedLayers, context, searchTerm) => {
    selectedLayers.forEach(layer => {
        Settings.setLayerSettingForKey(layer, 'cloudinary.search.publicId', searchTerm)
    })

    UI.message('🕑 Downloading...')
    const mappedData = calculateImageUrl(context, searchTerm);
    const dataKey = context.data.key;

    mappedData.forEach((data, index) => {
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
            
                UI.message(`✅ ${mappedData.length} image(s) added!`)
            })
            .catch((err) => {
                console.error(err);
                UI.message(`😱 No image added.`)
                return context.plugin.urlForResourceNamed('placeholder.png').path()
            })
    })
}


export const calculateImageUrl = (context, publicId) => {
    const cloudname = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');
    const errorMsg = !cloudname ? '⚠️ You need to configure Cloudinary account' : (!publicId ? '😰 No public id provided' : '');
    
    if (errorMsg) { UI.alert('Warning', errorMsg); }

    const items = util.toArray(context.data.items).map(sketch.fromNative);

    const orientations = getOrientations(items);

    return items.map((item, index) => {
        const mappedOrientation = {...flatten(Object.values(orientations))[index]};
        return ({
            item: item,
            url: `${API_ENDPOINT}${cloudname}/image/upload/w_${mappedOrientation.frame.width},h_${mappedOrientation.frame.height},q_auto,c_fill,g_auto/${publicId}.png`,
        });
    });
}

export function saveTempFileFromImageData (imageData) {
    const guid = NSProcessInfo.processInfo().globallyUniqueString()
    const imagePath = path.join(FOLDER, `${guid}.jpg`)
    try {
      fs.mkdirSync(FOLDER)
    } catch (err) {
        UI.message('Error writing to file');
      // probably because the folder already exists
      // TODO: check that it is really because it already exists
    }

    try {
      fs.writeFileSync(imagePath, imageData, 'NSData')
      return imagePath
    } catch (err) {
        UI.message(`Error writing to file ${imagePath}`);
      console.error(err)
      return undefined
    }
  }

export default getPhotoById;