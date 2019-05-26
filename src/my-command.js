// import sketch from 'sketch'
import createSettingsWindow from './utils';

// const { DataSupplier, UI, Settings } = sketch

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

  // var last_email = NSUserDefaults.standardUserDefaults().objectForKey('email')
  // var last_password = NSUserDefaults.standardUserDefaults().objectForKey('password')

  var popup = createSettingsWindow(context, '', '')

  var alert = popup[0];
  var inputs = popup[1];
  var response = alert.runModal();

  // save button was pressed
  if ( response === 1000 ) {
    var email = inputs[0].stringValue()
    var password = inputs[1].stringValue()
    NSUserDefaults.standardUserDefaults().setObject_forKey(email, 'email')
    NSUserDefaults.standardUserDefaults().setObject_forKey(password, 'password')
  }
}