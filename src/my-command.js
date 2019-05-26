import sketch from 'sketch'
import fs from '@skpm/fs'

const { DataSupplier, UI, Settings } = sketch

var alert = COSAlertWindow.new();

alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("rectangle@2x.png").path()));
alert.setMessageText("Configure your confetti")

// Creating dialog buttons
alert.addButtonWithTitle("Ok");
alert.addButtonWithTitle("Cancel");

// Creating the view
var viewWidth = 300;
var viewHeight = 140;

var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
alert.addAccessoryView(view);

// Create and configure your inputs here
// ...


// Show the dialog
return [alert]
// const SETTING_KEY = 'unsplash.photo.id'
// const FOLDER = path.join(os.tmpdir(), 'com.sketchapp.unsplash-plugin')

export function onStartup () {
  UI.getInputFromUser(
    "Your username",
    {
      type: UI.INPUT_TYPE.selection,
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        return
      }
    }
  )

  DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
  DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
}

export function onShutdown () {
  DataSupplier.deregisterDataSuppliers()
  try {
    if (fs.existsSync(FOLDER)) {
      fs.rmdirSync(FOLDER)
    }
  } catch (err) {
    console.error(err)
  }
}

function SupplyPhotoById (context) {
//context.data.key
//context.data.items
}

function SearchPhoto (context) {

}

export default function() {
  const doc = sketch.getSelectedDocument()
  const selectedLayers = doc.selectedLayers
  const selectedCount = selectedLayers.length

  if (selectedCount === 0) {
    sketch.UI.alert('Hello World', 'No layers are selected.')
  } else {
    sketch.UI.message(`${selectedCount} layers selected.`)
  }
}