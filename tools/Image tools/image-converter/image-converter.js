document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const downloadArea = document.getElementById('downloadArea');
    const downloadLink = document.getElementById('downloadLink');
    const startOverBtn = document.getElementById('startOverBtn');

    let originalFile = null;

    // --- Event Listeners ---

    // Trigger file input when the upload area is clicked
    uploadArea.addEventListener('click', () => fileInput.click());

    // Handle file selection through the input
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // --- Drag and Drop Event Listeners ---
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default browser behavior
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault(); // Prevent default browser behavior
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // --- Main Logic Functions ---

    /**
     * Handles the selected file, displays the preview, and updates the UI.
     * @param {File} file The image file selected by the user.
     */
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        originalFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            // Switch from upload view to preview/options view
            uploadArea.classList.add('d-none');
            imagePreview.classList.remove('d-none');
            downloadArea.classList.add('d-none'); // Hide download area if it was visible
        }
        reader.readAsDataURL(file);
    }

    // --- Conversion and Download ---

    // Listen for click on the "Convert" button
    convertBtn.addEventListener('click', () => {
        if (!originalFile) {
            alert('Something went wrong. Please upload the file again.');
            return;
        }

        const selectedFormat = formatSelect.value;
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Create a canvas to draw the image on
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Convert canvas to the selected format
                const mimeType = `image/${selectedFormat}`;
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    
                    // Set up the download link
                    const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
                    downloadLink.href = url;
                    downloadLink.download = `${originalFileName}.${selectedFormat}`;

                    // Show the download area
                    downloadArea.classList.remove('d-none');
                    imagePreview.classList.add('d-none');

                }, mimeType, 1); // The '1' is for quality (for JPEG/WEBP)
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(originalFile);
    });

    // --- Reset Functionality ---

    // Listen for click on the "Convert Another Image" button
    startOverBtn.addEventListener('click', () => {
        // Reset all state and UI to the initial view
        originalFile = null;
        fileInput.value = ''; // Clear the file input
        uploadArea.classList.remove('d-none');
        imagePreview.classList.add('d-none');
        downloadArea.classList.add('d-none');
        previewImage.src = '#';
        downloadLink.href = '#';
    });
});
