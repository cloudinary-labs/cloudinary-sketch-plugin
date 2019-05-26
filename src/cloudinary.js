import sketch from 'sketch'
import util from 'util'

const API_ENDPOINT = 'https://res.cloudinary.com/';

const { DataSupplier, UI, Settings } = sketch

export const onStartup = () => {
  DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
  DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
}

export const onShutdown = () => {
    // Deregister the plugin
    DataSupplier.deregisterDataSuppliers()
}

export const onSearchPhoto = () => {

}

export const onGetPhotoById = () => {
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

                const url = cloudinary.url(searchTerm, { quality: 'auto'});
                // setImageForContext(context, null, searchTerm);
                }
            }
        )
    }
}

const calculateLayerDimension = (item) => {
    let layer = item;

    if (item.type === 'DataOverride') {
        // only available on Sketch 54+
        const overrideFrame = item.override.getFrame && item.override.getFrame();

        if (overrideFrame) {
            layer = {
                frame: overrideFrame
            }
        } 
        else {
            const overrideRepresentation = util.toArray(
                    item.symbolInstance.sketchObject.overrideContainer().flattenedChildren()
                ).find(x => x.availableOverride() === item.override.sketchObject);

            if (!overrideRepresentation) {
                layer = item.symbolInstance
            } 
            else {
                const path = overrideRepresentation.pathInInstance()
                const bounds = CGPathGetBoundingBox(path)
                
                layer = {
                    frame: {
                        width: Number(bounds.size.width),
                        height: Number(bounds.size.height)
                    }
                }
            }
        }
    }

    return layer;
}

const getOrientations = (items) => {
    return items.reduce((prev, item, index) => {
        if (!item.type) {
        // if we get an unknown item, it means that we have a layer that is not yet
        // recognized by the API (probably an MSOvalShape or something)
        // force cast it to a Shape
        item = sketch.Shape.fromNative(item.sketchObject)
        }

        const layer = calculateLayerDimension(item);
        const dataInfo = { item, index, frame: layer.frame };

        if (layer.frame.width > layer.frame.height) {
        prev.landscape.push(dataInfo)
        } else if (layer.frame.width < layer.frame.height) {
        prev.portrait.push(dataInfo)
        } else if (layer.frame.width === layer.frame.height) {
        prev.squarish.push(dataInfo)
        }
        return prev;
    }, {
        landscape: [],
        portrait: [],
        squarish: []
    });
}

const calculateImageUrl = (context, publicId) => {
    const items = util.toArray(context.data.items).map(sketch.fromNative);

    const orientations = getOrientations(items);
    const cloudname = NSUserDefaults.standardUserDefaults().objectForKey('cloudname');
    console.log(orientations.toString());

    if (cloudname && publicId) {
        const url = `${API_ENDPOINT}${cloudname}/image/upload/${publicId}`;
    }
    else if (!cloudname){
        UI.alert('Warning', 'You need to configure Cloudinary account');
    }
    else {
        UI.alert('Error', 'No public id provided');
    }

}

const 


export default onGetPhotoById;