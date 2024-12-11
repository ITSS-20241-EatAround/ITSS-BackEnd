const axios = require('axios');
const baseURL = process.env.DEFAULT_GW || 'http://localhost:7200/api/v1';

exports.getMethod = async (req, endpoint) => {
    try {
        const response = await axios.get(baseURL + endpoint, {
            headers: {
                Authorization: req.headers.authorization || '',
                Accept: 'application/json'
            }
        });


        return response.data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.postMethod = async (req, endpoint, body) => {
    try {
        const response = await axios.post(baseURL + endpoint, body, {
            headers: {
                Authorization: req.headers.authorization || '',
                Accept: 'application/json'
            }
        });
        
        return response.data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.putMethod = async (req, endpoint, body) => {
    try {
        const response = await axios.put(baseURL + endpoint, body, {
            headers: {
                Authorization: req.headers.authorization || '',
                Accept: 'application/json'
            }
        });
        
        return response.data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}