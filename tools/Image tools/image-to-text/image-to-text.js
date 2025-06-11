document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processingArea = document.getElementById('processingArea');
    const resultArea = document.getElementById('resultArea');
    
    const previewImage = document.getElementById('previewImage');
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const startOverBtn = document.getElementById('startOverBtn');
    
    const notificationArea = document.getElementById('notificationArea');

    // --- Notification Function ---
    function showNotification(message, type = 'danger') {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        notificationArea.innerHTML = ''; // Clear previous notifications
        notificationArea.append(wrapper);
    }

    // --- Event Listeners ---
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    // --- Main Logic ---
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Please upload a valid image file.', 'warning');
            return;
        }
        notificationArea.innerHTML = '';

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadArea.classList.add('d-none');
            processingArea.classList.remove('d-none');
            resultArea.classList.add('d-none');
            runOCR(file);
        }
        reader.readAsDataURL(file);
    }

    // --- Tesseract.js OCR Function ---
    async function runOCR(file) {
        progressStatus.textContent = 'Preparing OCR engine...';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        try {
            // Explicitly define paths to worker and language data to avoid cross-origin issues
            const worker = await Tesseract.createWorker('eng', 1, {
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
                langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
                corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        progressBar.style.width = `${progress}%`;
                        progressBar.textContent = `${progress}%`;
                        progressStatus.textContent = 'Recognizing Text...';
                    } else {
                        const statusText = m.status.replace(/_/g, ' ');
                        progressStatus.textContent = statusText.charAt(0).toUpperCase() + statusText.slice(1) + '...';
                    }
                },
            });

            const { data: { text } } = await worker.recognize(file);
            
            resultText.value = text;
            processingArea.classList.add('d-none');
            resultArea.classList.remove('d-none');
            
            await worker.terminate();

        } catch (error) {
            console.error(error);
            const errorMessage = `An OCR error occurred: ${error.message || 'Unknown error'}. Please check your internet connection and try again.`;
            showNotification(errorMessage, 'danger');
            resetTool();
        }
    }

    // --- Utility Buttons ---
    copyBtn.addEventListener('click', () => {
        if (resultText.value) {
            navigator.clipboard.writeText(resultText.value)
                .then(() => showNotification('Text copied to clipboard!', 'success'))
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showNotification('Could not copy text to clipboard.', 'danger');
                });
        }
    });

    // --- Reset Functionality ---
    function resetTool() {
        fileInput.value = '';
        uploadArea.classList.remove('d-none');
        processingArea.classList.add('d-none');
        resultArea.classList.add('d-none');
        previewImage.src = '#';
        resultText.value = '';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        progressStatus.textContent = 'Initializing...';
    }

    startOverBtn.addEventListener('click', () => {
        notificationArea.innerHTML = '';
        resetTool();
    });
});
