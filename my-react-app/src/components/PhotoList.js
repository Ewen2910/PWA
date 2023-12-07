import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhotoList = ({ count }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const responses = await Promise.all(
          Array.from({ length: count }, (_, index) =>
            axios.get('https://picsum.photos/200/300')
          )
        );

        const photoURLs = responses.map((response) => response.request.responseURL);
        setPhotos(photoURLs);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [count]);

  return (
    <div>
      <h2>Random Photos</h2>
      <div>
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Random Photo ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default PhotoList;
