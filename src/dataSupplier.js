import sketch from 'sketch'
import upload from './upload';
import search from './search';
import getPhotoById from './cloudinary';

const { DataSupplier } = sketch;

export const onStartup = () => {
  DataSupplier.registerDataSupplier('public.image', 'Add photo by public Id', 'SupplyPhotoById')
  DataSupplier.registerDataSupplier('public.image', 'Search Photo…', 'SearchPhoto')
  DataSupplier.registerDataSupplier('public.image', 'Upload artboard to Cloudinary', 'UploadPhoto')
}

export const onShutdown = () => {
    // Deregister the plugin
    DataSupplier.deregisterDataSuppliers()
}

export const onSearchPhoto = () => search();

export const onUploadPhoto = () => upload();

export const onGetPhotoById = () => getPhotoById();