export const getBaseUrl = () => {
  if (import.meta.env.VITE_PROD_URL) {
    return import.meta.env.VITE_PROD_URL;
  }
  return import.meta.env.VITE_DOCKER_URL || 'http://localhost:3001';
};
