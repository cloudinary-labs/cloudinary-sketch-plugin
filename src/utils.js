
function layerToImageData(layer) {

	var format = MSExportFormat.formatWithScale_name_fileFormat(1.0, 'export', 'png')
	var request = MSExportRequest.exportRequestsFromExportableLayer_exportFormats_useIDForName(layer, [format], false)[0]

	var colorSpace = NSColorSpace.sRGBColorSpace()
	var data = MSExporter.exporterForRequest_colorSpace(request, colorSpace).data()

	return data
}

console.log('This is an example Sketch script.')

var sketch = require('sketch')


// Create and configure your inputs here
// ...


// User Interactions

export function createLabel( text, fontSize, bold, frame ) {
  var label = NSTextField.alloc().initWithFrame( frame );
  label.setStringValue( text );
  label.setFont( ( bold ) ? NSFont.boldSystemFontOfSize( fontSize ) : NSFont.systemFontOfSize( fontSize ) );
  label.setBezeled( false );
  label.setDrawsBackground( false );
  label.setEditable( false );
  label.setSelectable( false );

  return label;
}

export function createSettingsWindow(context, cloudName, apiKey, secretKey) {
    var alert = COSAlertWindow.new();
    var width = 400;
    var freeSpace = width - 100;

    alert.setIcon( NSImage.alloc().initByReferencingFile( context.plugin.urlForResourceNamed( 'icon@2x.png' ).path() ) );
    alert.addButtonWithTitle( 'Login' );
    alert.addButtonWithTitle( 'Cancel' );
    alert.setMessageText( 'Cloudinary for Sketch' );
    alert.setInformativeText( 'Set your Cloudinary Login to sync Sketch with your Cloudinary account.' );
  
    var mainView = NSView.alloc().initWithFrame( NSMakeRect( 0, 0, width, 200 ) );

    var cloudNameLabel = createLabel( 'Cloudname', 12, true, NSMakeRect( 0, 180, freeSpace, 20 ) );
    var cloudNameTextfield = NSTextField.alloc().initWithFrame( NSMakeRect( 0, 155, freeSpace, 25 ) );
    cloudNameTextfield.setStringValue( cloudName || '' );
  
    var apiKeyLabel = createLabel( 'API Key', 12, true, NSMakeRect( 0, 120, freeSpace, 20 ) );
    var apiKeyTextfield = NSSecureTextField.alloc().initWithFrame( NSMakeRect( 0, 95, freeSpace, 25 ) );
    apiKeyTextfield.setStringValue( apiKey || '' );

    var secretKeyLabel = createLabel( 'API Secret Key', 12, true, NSMakeRect( 0, 60, freeSpace, 20 ) );
    var secretKeyTextfield = NSSecureTextField.alloc().initWithFrame( NSMakeRect( 0, 35, freeSpace, 25 ) );
    secretKeyTextfield.setStringValue( secretKey || '' );
  
    mainView.addSubview( cloudNameLabel );
    mainView.addSubview( cloudNameTextfield );
  
    mainView.addSubview( apiKeyLabel );
    mainView.addSubview( apiKeyTextfield );

    mainView.addSubview( secretKeyLabel );
    mainView.addSubview( secretKeyTextfield );
  
    alert.addAccessoryView( mainView );
  
    var inputs = [ cloudNameTextfield, apiKeyTextfield, secretKeyTextfield ];
    return [alert, inputs]
};

export default createSettingsWindow;
