document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processingArea = document.getElementById('processingArea');
    const downloadArea = document.getElementById('downloadArea');
    
    const previewImage = document.getElementById('previewImage');
    const originalDimensions = document.getElementById('originalDimensions');
    
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const aspectRatioLock = document.getElementById('aspectRatioLock');
    
    const resizeBtn = document.getElementById('resizeBtn');
    const downloadLink = document.getElementById('downloadLink');
    const startOverBtn = document.getElementById('startOverBtn');

    const resizedPreview = document.getElementById('resizedPreview');
    const newDimensions = document.getElementById('newDimensions');

    let originalFile = null;
    let imageAspectRatio = 0;
    let originalWidth = 0;
    let originalHeight = 0;

    // --- Event Listeners ---
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    // Aspect ratio calculation
    widthInput.addEventListener('input', () => {
        if (aspectRatioLock.checked) {
            const width = parseInt(widthInput.value, 10);
            if (!isNaN(width) && imageAspectRatio > 0) {
                heightInput.value = Math.round(width / imageAspectRatio);
            }
        }
    });

    heightInput.addEventListener('input', () => {
        if (aspectRatioLock.checked) {
            const height = parseInt(heightInput.value, 10);
            if (!isNaN(height) && imageAspectRatio > 0) {
                widthInput.value = Math.round(height * imageAspectRatio);
            }
        }
    });

    // --- Main Logic ---
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        originalFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalWidth = img.width;
                originalHeight = img.height;
                imageAspectRatio = originalWidth / originalHeight;
                
                previewImage.src = e.target.result;
                originalDimensions.textContent = `${originalWidth} x ${originalHeight} px`;
                widthInput.value = originalWidth;
                heightInput.value = originalHeight;
                
                uploadArea.classList.add('d-none');
                processingArea.classList.remove('d-none');
                downloadArea.classList.add('d-none');
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }

    // --- Resizing and Download ---
    resizeBtn.addEventListener('click', () => {
        if (!originalFile) {
            alert('Something went wrong. Please upload the file again.');
            return;
        }

        const newWidth = parseInt(widthInput.value, 10);
        const newHeight = parseInt(heightInput.value, 10);

        if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
            alert('Please enter valid positive numbers for width and height.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                const dataUrl = canvas.toDataURL(originalFile.type);
                
                resizedPreview.src = dataUrl;
                newDimensions.textContent = `${newWidth} x ${newHeight} px`;

                const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
                const fileExtension = originalFile.name.split('.').pop();
                downloadLink.href = dataUrl;
                downloadLink.download = `${originalFileName}-${newWidth}x${newHeight}.${fileExtension}`;

                processingArea.classList.add('d-none');
                downloadArea.classList.remove('d-none');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(originalFile);
    });

    // --- Reset Functionality ---
    startOverBtn.addEventListener('click', () => {
        originalFile = null;
        imageAspectRatio = 0;
        fileInput.value = '';
        
        uploadArea.classList.remove('d-none');
        processingArea.classList.add('d-none');
        downloadArea.classList.add('d-none');
        
        previewImage.src = '#';
        downloadLink.href = '#';
        resizedPreview.src = '#';
        widthInput.value = '';
        heightInput.value = '';
    });
});
