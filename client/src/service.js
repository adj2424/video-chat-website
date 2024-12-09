const baseUrl = import.meta.env.VITE_DOCKER_URL || 'http://localhost:3001';

export const getAllRooms = async () => {
  console.log('baseUrl', baseUrl, import.meta.env.VITE_DOCKER_URL);
  const url = `${baseUrl}/room/all`;
  return await fetch(url, { method: 'GET' }).then(response => response.json());
};

export const getRoomById = async id => {
  const url = `${baseUrl}/room/${id}`;
  try {
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error('There was no room with the id');
  }
};
