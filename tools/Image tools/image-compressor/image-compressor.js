document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processingArea = document.getElementById('processingArea');
    const downloadArea = document.getElementById('downloadArea');
    
    const previewImage = document.getElementById('previewImage');
    const originalSize = document.getElementById('originalSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    
    const compressBtn = document.getElementById('compressBtn');
    const downloadLink = document.getElementById('downloadLink');
    const startOverBtn = document.getElementById('startOverBtn');

    const originalResult = document.getElementById('originalResult');
    const newSizeResult = document.getElementById('newSizeResult');
    const reductionResult = document.getElementById('reductionResult');

    let originalFile = null;
    let originalFileSize = 0;

    // --- Utility Function ---
    /**
     * Formats bytes into a human-readable string (KB, MB).
     * @param {number} bytes The file size in bytes.
     * @returns {string} The formatted file size.
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- Event Listeners ---

    // Trigger file input when the upload area is clicked
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
    
    // Update slider value display
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    // --- Main Logic Functions ---

    /**
     * Handles the selected file, displays the preview, and updates the UI.
     * @param {File} file The image file selected by the user.
     */
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file (JPG, PNG, WEBP).');
            return;
        }

        originalFile = file;
        originalFileSize = file.size;

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            originalSize.textContent = formatFileSize(originalFileSize);
            
            // Switch UI to processing view
            uploadArea.classList.add('d-none');
            processingArea.classList.remove('d-none');
            downloadArea.classList.add('d-none');
        }
        reader.readAsDataURL(file);
    }

    // --- Compression and Download ---

    compressBtn.addEventListener('click', () => {
        if (!originalFile) {
            alert('Something went wrong. Please upload the file again.');
            return;
        }

        const quality = parseFloat(qualitySlider.value);
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Convert canvas to a blob with specified quality
                canvas.toBlob((blob) => {
                    const compressedFileSize = blob.size;
                    const reduction = 100 - (compressedFileSize / originalFileSize) * 100;
                    
                    const url = URL.createObjectURL(blob);
                    
                    // Populate results and download link
                    originalResult.textContent = formatFileSize(originalFileSize);
                    newSizeResult.textContent = formatFileSize(compressedFileSize);
                    reductionResult.textContent = `${reduction.toFixed(1)}%`;
                    
                    const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
                    downloadLink.href = url;
                    downloadLink.download = `${originalFileName}-compressed.jpg`;

                    // Switch UI to download view
                    processingArea.classList.add('d-none');
                    downloadArea.classList.remove('d-none');

                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(originalFile);
    });

    // --- Reset Functionality ---
    startOverBtn.addEventListener('click', () => {
        originalFile = null;
        originalFileSize = 0;
        fileInput.value = '';
        
        uploadArea.classList.remove('d-none');
        processingArea.classList.add('d-none');
        downloadArea.classList.add('d-none');
        
        previewImage.src = '#';
        downloadLink.href = '#';
        qualitySlider.value = '0.8';
        qualityValue.textContent = '0.8';
    });
});
