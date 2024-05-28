// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Save API key to cookie
document.getElementById('key-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('api-key-input').value;
    setCookie('imgbbApiKey', apiKey, 365);
    alert('API Key saved successfully!');
});

// Upload image
document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const apiKey = getCookie('imgbbApiKey');
    if (!apiKey) {
        alert('Please enter and save your ImgBB API key first.');
        return;
    }

    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        alert('Please select an image to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    const progressContainer = document.getElementById('progress-container');
    const uploadProgress = document.getElementById('upload-progress');
    progressContainer.style.display = 'block';

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
            onUploadProgress: function(progressEvent) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress.value = percentCompleted;
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        const imageUrl = data.data.url;

        const imageUrlElement = document.getElementById('image-url');
        imageUrlElement.href = imageUrl;
        imageUrlElement.textContent = imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
    } finally {
        progressContainer.style.display = 'none';
    }
});

// Populate API key field if it exists
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = getCookie('imgbbApiKey');
    if (apiKey) {
        document.getElementById('api-key-input').value = apiKey;
    }

    // Check if cookies have been accepted
    if (!getCookie('cookiesAccepted')) {
        document.getElementById('cookie-notice').style.display = 'block';
    }
});

// Accept cookies
document.getElementById('accept-cookies').addEventListener('click', function(event) {
    event.preventDefault();
    setCookie('cookiesAccepted', 'true', 365);
    document.getElementById('cookie-notice').style.display = 'none';
});
