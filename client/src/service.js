import { getBaseUrl } from './config.js';

let baseUrl = getBaseUrl();

export const ping = async () => {
  const url = `${baseUrl}/room`;
  return await fetch(url, { method: 'GET' });
};

export const getAllRooms = async () => {
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

export const getRtcToken = async (roomId, userName) => {
  const url = `${baseUrl}/rtc/${roomId}/audience/uid/${userName}`;
  try {
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();
    return data.rtcToken;
  } catch (error) {
    throw new Error('error getting rtc token');
  }
};

export const clearMessages = async roomId => {
  const url = `${baseUrl}/room/${roomId}`;
  await fetch(url, { method: 'DELETE' });
};
