document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const croppingArea = document.getElementById('croppingArea');
    const downloadArea = document.getElementById('downloadArea');
    
    const imageToCrop = document.getElementById('imageToCrop');
    let cropper = null;
    let originalFile = null;

    // --- Control Buttons ---
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const flipHorizontalBtn = document.getElementById('flipHorizontalBtn');
    const flipVerticalBtn = document.getElementById('flipVerticalBtn');
    const cropBtn = document.getElementById('cropBtn');
    
    const croppedPreview = document.getElementById('croppedPreview');
    const downloadLink = document.getElementById('downloadLink');
    const startOverBtn = document.getElementById('startOverBtn');

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

    // --- Cropper Initialization ---
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imageToCrop.src = e.target.result;
            
            uploadArea.classList.add('d-none');
            croppingArea.classList.remove('d-none');
            downloadArea.classList.add('d-none');

            // Destroy previous cropper instance if it exists
            if (cropper) {
                cropper.destroy();
            }

            // Initialize Cropper.js
            cropper = new Cropper(imageToCrop, {
                aspectRatio: NaN, // Free crop
                viewMode: 1,      // Restrict crop box to be within the canvas
                autoCropArea: 0.8,
                responsive: true,
                background: false,
            });
        };
        reader.readAsDataURL(file);
    }

    // --- Cropper Actions ---
    zoomInBtn.addEventListener('click', () => cropper && cropper.zoom(0.1));
    zoomOutBtn.addEventListener('click', () => cropper && cropper.zoom(-0.1));
    rotateLeftBtn.addEventListener('click', () => cropper && cropper.rotate(-45));
    rotateRightBtn.addEventListener('click', () => cropper && cropper.rotate(45));
    
    let scaleX = 1;
    let scaleY = 1;
    flipHorizontalBtn.addEventListener('click', () => {
        if(cropper) {
            scaleX = -scaleX;
            cropper.scaleX(scaleX);
        }
    });
    flipVerticalBtn.addEventListener('click', () => {
        if(cropper) {
            scaleY = -scaleY;
            cropper.scaleY(scaleY);
        }
    });
    
    // --- Crop and Download ---
    cropBtn.addEventListener('click', () => {
        if (!cropper) {
            alert('Cropper is not initialized.');
            return;
        }

        const canvas = cropper.getCroppedCanvas({
            // Optional: specify cropped image dimensions
            // width: 1024,
            // height: 768,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            
            croppedPreview.src = url;
            downloadLink.href = url;

            const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
            const fileExtension = originalFile.name.split('.').pop();
            downloadLink.download = `${originalFileName}-cropped.${fileExtension}`;

            croppingArea.classList.add('d-none');
            downloadArea.classList.remove('d-none');

        }, originalFile.type);
    });


    // --- Reset Functionality ---
    function resetTool() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        originalFile = null;
        fileInput.value = '';
        scaleX = 1;
        scaleY = 1;

        uploadArea.classList.remove('d-none');
        croppingArea.classList.add('d-none');
        downloadArea.classList.add('d-none');
        
        imageToCrop.src = '#';
        downloadLink.href = '#';
        croppedPreview.src = '#';
    }

    startOverBtn.addEventListener('click', resetTool);
});
