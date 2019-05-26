
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


export function createSettingsWindow(context, email, password) {
    var alert = COSAlertWindow.new();
    var width = 400;
    var freeSpace = width - 100;
  
    alert.addButtonWithTitle( 'Save' );
    alert.addButtonWithTitle( 'Cancel' );
    alert.setMessageText( 'Sketch Conceptboard' );
    alert.setInformativeText( 'Set your Conceptboard Login to sync Sketch with your Conceptboard.' );
  
    var mainView = NSView.alloc().initWithFrame( NSMakeRect( 0, 0, width, 150 ) );
    var emailLabel = createLabel( 'Email Address', 12, true, NSMakeRect( 0, 120, freeSpace, 20 ) );
    var emailTextfield = NSTextField.alloc().initWithFrame( NSMakeRect( 0, 95, freeSpace, 25 ) );
    emailTextfield.setStringValue( email || '' );
  
    var passwordLabel = createLabel( 'Password', 12, true, NSMakeRect( 0, 60, freeSpace, 20 ) );
    var passwordTextfield = NSSecureTextField.alloc().initWithFrame( NSMakeRect( 0, 35, freeSpace, 25 ) );
    passwordTextfield.setStringValue( password || '' );
  
    mainView.addSubview( emailLabel );
    mainView.addSubview( emailTextfield );
  
    mainView.addSubview( passwordLabel );
    mainView.addSubview( passwordTextfield );
  
    alert.addAccessoryView( mainView );
  
    var inputs = [ emailTextfield, passwordTextfield ];
    return [alert, inputs]
};

export default createSettingsWindow;
