import sketch from 'sketch'
import search from './search';
import getPhotoById from './cloudinary';

const { DataSupplier } = sketch;

export const onStartup = () => {
  DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
  DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
}

export const onShutdown = () => {
    // Deregister the plugin
    DataSupplier.deregisterDataSuppliers()
}

export const onSearchPhoto = () => search();

export const onGetPhotoById = () => getPhotoById();