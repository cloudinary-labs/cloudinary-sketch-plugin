import sketch from 'sketch'
import createSettingsWindow from './utils';
import intializeCloudinary from './cloudinary';

const { DataSupplier, UI, Settings } = sketch

// export function onStartup () {
//   UI.getInputFromUser(
//     "Your username",
//     {
//       type: UI.INPUT_TYPE.selection,
//     },
//     (err, value) => {
//       if (err) {
//         // most likely the user canceled the input
//         return
//       }
//     }
//   )

//   DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
//   DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
// }


export default function(context) {
  // var doc = context.document

  var last_cloudname = NSUserDefaults.standardUserDefaults().objectForKey('cloudname')
  var last_apikey = NSUserDefaults.standardUserDefaults().objectForKey('apikey')
  var last_secretkey = NSUserDefaults.standardUserDefaults().objectForKey('secretkey')

  var popup = createSettingsWindow(context, last_cloudname, last_apikey, last_secretkey)

  var alert = popup[0];
  var inputs = popup[1];
  var response = alert.runModal();

  UI.alert('creden-1', String(response));
  // save button was pressed
  if ( String(response) === '1000' ) {
    
    var cloudname = inputs[0].stringValue()
    var apikey = inputs[1].stringValue()
    var secretkey = inputs[2].stringValue()
    NSUserDefaults.standardUserDefaults().setObject_forKey(cloudname, 'cloudname')
    NSUserDefaults.standardUserDefaults().setObject_forKey(apikey, 'apikey')
    NSUserDefaults.standardUserDefaults().setObject_forKey(secretkey, 'secretkey')

    UI.alert('creden', cloudname + '-' + apikey + '-' + secretkey)
    intializeCloudinary(cloudname, apikey, secretkey);
  }
}