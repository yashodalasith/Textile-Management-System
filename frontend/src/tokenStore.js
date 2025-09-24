let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (t) => { accessToken = t; };
export const clearAccessToken = () => { accessToken = null; };
