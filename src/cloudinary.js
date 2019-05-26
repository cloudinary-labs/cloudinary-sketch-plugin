import cloudinary from 'cloudinary-core';

export function intializeCloudinary(cloudName, apiKey, secretKey) {
    if (!cloudName || !apiKey || !secretKey) return -1;

    cloudinary.config({ 
        cloud_name: cloudName, 
        secure: true,
        // api_key: apiKey, 
        // api_secret: secretKey 
    });
}

export default intializeCloudinary;