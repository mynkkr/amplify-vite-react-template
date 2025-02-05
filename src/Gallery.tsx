import { useState, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';
import './Gallery.css'
const Gallery = () => {
    const [imageUrls, setImageUrls] = useState<URL[]>([]);
    const [loading, setLoading] = useState(true);

    const pictures = [
        { path: 'profile-pictures/12/landscapeImage6.jpeg' },
        { path: 'profile-pictures/12/landscapeImage6 (1).jpeg' },
        { path: 'profile-pictures/12/landscapeImage5 (1).jpeg' },
        { path: 'profile-pictures/12/landscapeImage4.jpeg' },
        { path: 'profile-pictures/12/landscapeImage4 (1).jpeg' },
        { path: 'profile-pictures/12/landscapeImage3 (1).jpeg' },
        { path: 'profile-pictures/12/landscapeImage2.jpeg' },
        { path: 'profile-pictures/12/landscapeImage1.jpeg' },
        // { path: 'profile-pictures/12/landscapeImage1 (1).jpeg' },
    ];

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetching multiple image URLs from S3
                const urls = await Promise.all(
                    pictures.map(async (item) => {
                        const result = await getUrl({ path: item.path });
                        console.log(result.url); // Log the actual URL
                        console.log(typeof result.url);
                        return result.url; // Extract and return only the URL
                    })
                );

                setImageUrls(urls); // Set the URLs in state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []); // Empty dependency array, so it only runs once

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gallery-container">
            {imageUrls.length > 0 ? (
                imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url.toString()}
                        alt={`Profile ${index + 1}`}
                        style={{
                            width: '200px', // Set a fixed width
                            height: 'auto', // Maintain aspect ratio
                            borderRadius: '8px', // Optional: rounded corners for style
                            margin: '10px', // Optional: spacing between images
                        }}
                    />
                ))
            ) : (
                <p>No profile pictures found.</p>
            )}
        </div>
    );
};

export default Gallery;
