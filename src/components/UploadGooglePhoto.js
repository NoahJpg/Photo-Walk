import React, { useState } from 'react';
import { google } from 'googleapis';
import axios from 'axios';

const ImageUploadWithGooglePhotos = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      // Upload the image to Google Photos
      const auth = new google.auth.GoogleAuth({
        keyFile: REACT_APP_GPHOTO_KEY,
        scopes: ['https://www.googleapis.com/auth/photoslibrary'],
      });

      const token = await auth.getAccessToken();

      const response = await axios.post(
        'https://photoslibrary.googleapis.com/v1/uploads',
        selectedFile,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploadToken = response.data;

      // Create a new media item with the uploaded image
      const mediaItem = {
        description: 'Uploaded from ImageUploadWithGooglePhotos',
        simpleMediaItem: {
          uploadToken,
        },
      };

      const createResponse = await axios.post(
        'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        {
          newMediaItems: [mediaItem],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Image uploaded successfully!', createResponse.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image to Google Photos</button>
    </div>
  );
};

export default ImageUploadWithGooglePhotos;
