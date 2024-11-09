import axios from "axios";
export const baseUrl = "http://localhost:8000/api"; //our backend api

/**
 * Makes a POST request to the server with the given URL and body, and
 * returns the response. If the response contains an error, returns an
 * object with error = true and message = response.data.message.
 */
export const postRequest = async (url, body, additionalHeaders = {}) => {
  const response = await axios.post(
    `${baseUrl}${url}`,
    body,
    additionalHeaders
  );

  if (response.data.error) {
    return { error: true, message: response.data.message };
  }

  return response.data;
};

/**
 * Uploads a file to the server and returns the response from the server.
 * The response may contain an error message if the upload failed.
 *
 * @param {File} file The file to upload
 * @return {Promise<Object>} The response from the server, or an object with
 * error = true and message = response.data.message if the response contains an
 * error.
 */
export const uploadFile = async (file) => {
  const data = new FormData();
  data.append("file", file);

  const response = await axios.post(`${baseUrl}/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("User")).token}`,
    },
  });

  if (response.data.error) {
    return { error: true, message: response.data.message };
  }

  return response.data;
};

/**
 * Makes a GET request to the server with the given URL and headers, and
 * returns the response. If the response contains an error, returns an
 * object with error = true and message = response.data.message.

 */
export const getRequest = async (url, additionalHeaders = {}) => {
  const response = await axios.get(url, {
    headers: {
      "content-type": "application/json",
      ...additionalHeaders,
    },
  });

  if (response.data.error) {
    let message = "An error occured...";
    if (response.data?.message) {
      message = response.data.message;
    }
    return { error: true, message };
  }
  return response.data;
};
