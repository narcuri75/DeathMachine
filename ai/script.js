function getImages() {
    // Send an AJAX request to fetch the list of images
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/images', true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // Parse the response JSON and build the gallery HTML
            const images = JSON.parse(this.responseText);
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            images.forEach(image => {
                const img = document.createElement('img');
                img.src = '/images/' + image.filename;
                gallery.appendChild(img);
            });
        }
    };
    xhr.send();
}

// Call getImages() once to populate the gallery initially
getImages();

// Call getImages() every 10 seconds to refresh the gallery
setInterval(getImages, 10000);
