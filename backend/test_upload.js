const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function test() {
  try {
    // 1. Login to get token (using a known user or registering one)
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'priya.sharma@campuslearn.edu', // from the screenshot ("Prof. Priya Sharma")
      password: 'password123'
    }).catch(e => {
       console.log("Login failed, trying to register");
       return axios.post('http://localhost:5001/api/auth/register', {
         name: 'Priya Sharma',
         email: 'priya.sharma@campuslearn.edu',
         password: 'password123',
         role: 'faculty'
       });
    });

    const token = loginRes.data?.data?.accessToken || loginRes.data?.token || loginRes.data?.accessToken;
    if (!token) {
       console.log("Could not get token:", loginRes.data);
       return;
    }
    console.log("Got token");

    // 2. Create Course
    const courseRes = await axios.post('http://localhost:5001/api/courses', {
      title: 'Test Course ' + Date.now(),
      description: 'Test Description',
      credits: 3,
      department: '65abcde12345678901234567' // dummy object ID
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(e => {
       console.log("Failed to create course", e.response?.data);
       return null;
    });

    if (!courseRes) return;
    const courseId = courseRes.data.data._id;
    console.log("Created course", courseId);

    // 3. Create Module
    const moduleRes = await axios.post('http://localhost:5001/api/modules', {
      title: 'Test Module',
      course: courseId,
      order: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(e => {
       console.log("Failed to create module", e.response?.data);
       return null;
    });

    if (!moduleRes) return;
    const moduleId = moduleRes.data.data._id;
    console.log("Created module", moduleId);

    // 4. Upload PDF
    fs.writeFileSync('test.pdf', 'dummy pdf content');
    const form = new FormData();
    form.append('title', 'Test PDF Note');
    form.append('document', fs.createReadStream('test.pdf'));
    form.append('module', moduleId);
    form.append('course', courseId);
    
    const uploadRes = await axios.post('http://localhost:5001/api/modules/lessons/document', form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${token}` 
      }
    }).catch(e => {
       console.log("Failed to upload PDF", e.response?.data);
       return null;
    });

    if (uploadRes) {
      console.log("Upload successful!", uploadRes.data);
    }
  } catch (err) {
    console.error(err);
  }
}

test();
