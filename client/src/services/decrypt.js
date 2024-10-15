import Security from "../security/security";

export const decryptData = async (response) => {  
  try {
    if (response.data.mac !== undefined) {      
      response.data = await new Security().decrypt(response);
      console.log("response",response.data);
      return response.data;
    }
    return response;
  } catch (error) {
    console.error(error)
  }
}