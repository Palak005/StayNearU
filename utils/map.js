const ExpressError = require("./ExpressError");

let getAccessToken = async()=> {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
  
    const tokenResponse = await fetch("https://outpost.mapmyindia.com/api/security/oauth/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
    });
  
    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  }

async function getEloc(address) {
  let eloc = {};
  try {
    // Call the function and wait for the token
    const accessToken = await getAccessToken();

    // Use the token in the Authorization header
    const response = await fetch(`https://atlas.mapmyindia.com/api/places/geocode?address=mapmyindia${address}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Correctly use the token
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new ExpressError(response.status, `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);  
    eloc = data.copResults.eLoc;       // Assigning the data to eloc

  } catch (err) {
    console.log(err);
  } 

  return eloc;  // Return the eloc object once the asynchronous function runs completely
}

module.exports = getEloc;
