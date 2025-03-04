import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Upload } from 'lucide-react';

interface Photo {
  id: number;
  src: string;
  caption: string;
  location: string;
}

const Gallery: React.FC = () => {
  // Default photos from Unsplash
  const defaultPhotos: Photo[] = [
    {
      id: 1,
      src: "gallery/3.jpg",
      caption: "Извор водовода на планини изнад села Шебет",
      location: "Извор"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      caption: "Главни резервоар за воду капацитета 50.000 литара",
      location: "Резервоар"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1584824388878-91a76c1dc4e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      caption: "Централна пумпна станица која обезбеђује притисак у мрежи",
      location: "Пумпна станица"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1543674892-7d64d45facad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      caption: "Јавна чесма у центру села - омиљено место окупљања",
      location: "Јавна чесма"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1588796388882-a634d398a6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      caption: "Лабораторија за контролу квалитета воде",
      location: "Лабораторија"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1590496793929-36417d3117de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      caption: "Мештани током акције одржавања водоводне мреже",
      location: "Одржавање"
    }
  ];

  const [photos, setPhotos] = useState<Photo[]>(defaultPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // This would be implemented to fetch uploaded photos in a real application
  // For this demo, we're just using the default photos
  useEffect(() => {
    // In a real application, you would fetch photos from the server here
    // For example:
    // fetch('/api/gallery-photos')
    //   .then(response => response.json())
    //   .then(data => {
    //     // Combine default photos with uploaded photos
    //     setPhotos([...defaultPhotos, ...data]);
    //   })
    //   .catch(error => console.error('Error fetching gallery photos:', error));
  }, []);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openUploadModal = () => {
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const openUploadTool = () => {
    // In a real application, this would redirect to the upload tool
    window.open('http://localhost:3000', '_blank');
  };

  return (
    <section id="galerija" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Галерија водовода</h2>
          <button 
            onClick={openUploadModal}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            Додај фотографију
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => openLightbox(index)}
            >
              <div className="relative h-64">
                <img 
                  src={photo.src} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white font-bold">{photo.location}</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-gray-800">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={goToPrevious}
            >
              <ChevronLeft size={32} />
            </button>
            
            <div className="max-w-4xl max-h-[80vh] relative">
              <img 
                src={photos[currentPhotoIndex].src} 
                alt={photos[currentPhotoIndex].caption} 
                className="max-h-[70vh] max-w-full"
              />
              <div className="text-white text-center mt-4 text-xl">
                {photos[currentPhotoIndex].caption}
              </div>
            </div>
            
            <button 
              className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={goToNext}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Додавање фотографија</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeUploadModal}
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="mb-6">
                За додавање нових фотографија у галерију, користите наш алат за отпремање. 
                Кликните на дугме испод да бисте отворили алат у новом прозору.
              </p>
              
              <div className="flex justify-center">
                <button 
                  onClick={openUploadTool}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Upload size={18} className="mr-2" />
                  Отвори алат за отпремање
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                Напомена: Отпремљене фотографије ће бити прегледане пре објављивања.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
