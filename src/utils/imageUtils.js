/**
 * Utility para construir URLs de imágenes del servidor
 */

const getServerBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace('/api', '');
  }
  return 'http://localhost:5000';
};

/**
 * Construye la URL completa para una imagen
 * @param {string} imagePath - Ruta de la imagen (ej: "/uploads/imagen.jpg")
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Construir URL completa
  const baseUrl = getServerBaseUrl();
  return `${baseUrl}${imagePath}`;
};

/**
 * Verifica si una imagen existe y puede cargarse
 * @param {string} imagePath - Ruta de la imagen
 * @returns {Promise<boolean>} True si la imagen existe
 */
export const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    if (!imagePath) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getImageUrl(imagePath);
  });
};

export default {
  getImageUrl,
  checkImageExists,
  getServerBaseUrl
};