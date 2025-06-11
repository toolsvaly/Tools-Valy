document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements from the DOM
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processingArea = document.getElementById('processingArea');
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const flipHorizontalBtn = document.getElementById('flipHorizontalBtn');
    const flipVerticalBtn = document.getElementById('flipVerticalBtn');
    
    const downloadBtn = document.getElementById('downloadBtn');
    const startOverBtn = document.getElementById('startOverBtn');

    let image = null;
    let originalFile = null;
    let rotation = 0;
    let scaleX = 1;
    let scaleY = 1;

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
            alert('Please upload a valid image file.');
            return;
        }
        originalFile = file;

        const reader = new FileReader();
        reader.onload = function(e) {
            image = new Image();
            image.onload = function() {
                resetTransformations();
                drawImage();
                uploadArea.classList.add('d-none');
                processingArea.classList.remove('d-none');
            };
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
    
    function resetTransformations() {
        rotation = 0;
        scaleX = 1;
        scaleY = 1;
    }

    function drawImage() {
        if (!image) return;

        // Swap dimensions for 90/270 degree rotations
        const isSwapped = (Math.abs(rotation) / 90) % 2 === 1;
        const w = isSwapped ? image.height : image.width;
        const h = isSwapped ? image.width : image.height;

        canvas.width = w;
        canvas.height = h;
        
        ctx.save();
        // Translate to the center of the canvas
        ctx.translate(w / 2, h / 2);
        // Apply transformations
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(scaleX, scaleY);
        // Draw the image centered
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }

    // --- Control Button Listeners ---
    rotateLeftBtn.addEventListener('click', () => {
        rotation = (rotation - 90) % 360;
        drawImage();
    });

    rotateRightBtn.addEventListener('click', () => {
        rotation = (rotation + 90) % 360;
        drawImage();
    });
    
    flipHorizontalBtn.addEventListener('click', () => {
        scaleX *= -1;
        drawImage();
    });

    flipVerticalBtn.addEventListener('click', () => {
        scaleY *= -1;
        drawImage();
    });
    
    // --- Download Functionality ---
    downloadBtn.addEventListener('click', () => {
        if (!image) return;

        const link = document.createElement('a');
        const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
        const fileExtension = originalFile.name.split('.').pop();
        
        link.download = `${originalFileName}-edited.${fileExtension}`;
        link.href = canvas.toDataURL(originalFile.type);
        link.click();
    });

    // --- Reset Functionality ---
    function resetTool() {
        image = null;
        originalFile = null;
        fileInput.value = '';
        resetTransformations();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        uploadArea.classList.remove('d-none');
        processingArea.classList.add('d-none');
    }
    startOverBtn.addEventListener('click', resetTool);
});
