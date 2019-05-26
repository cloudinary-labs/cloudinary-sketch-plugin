import createSettingsWindow from './utils';

export function settings(context) {
  // var doc = context.document

  var last_cloudname = NSUserDefaults.standardUserDefaults().objectForKey('cloudname')
  var last_apikey = NSUserDefaults.standardUserDefaults().objectForKey('apikey')
  var last_secretkey = NSUserDefaults.standardUserDefaults().objectForKey('secretkey')

  var popup = createSettingsWindow(context, last_cloudname, last_apikey, last_secretkey)

  var alert = popup[0];
  var inputs = popup[1];
  var response = alert.runModal();

  // save button was pressed
  if ( response === 1000 ) {
    
    var cloudname = inputs[0].stringValue()
    var apikey = inputs[1].stringValue()
    var secretkey = inputs[2].stringValue()
    NSUserDefaults.standardUserDefaults().setObject_forKey(cloudname, 'cloudname')
    NSUserDefaults.standardUserDefaults().setObject_forKey(apikey, 'apikey')
    NSUserDefaults.standardUserDefaults().setObject_forKey(secretkey, 'secretkey')
  }
}

export default settings;