import sketch from 'sketch'

const API_ENDPOINT = 'https://res.cloudinary.com/';

const { DataSupplier, UI, Settings } = sketch

export function onStartup () {
  DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
  DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
}

export function onShutdown () {
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

const calculateImageUrl = (context, publicId) => {

}


export default onGetPhotoById;