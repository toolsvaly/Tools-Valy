document.addEventListener('DOMContentLoaded', function() {
    // Check for the required secure context (Cross-Origin Isolation)
    if (!crossOriginIsolated) {
        const notificationArea = document.getElementById('notificationArea');
        const uploadArea = document.getElementById('uploadArea');
        
        // Display a persistent and clear error message
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Environment Error!</h4>
                <p>This tool cannot run because your browser is not in a secure (cross-origin isolated) state. This is a security requirement for processing video files directly in the browser.</p>
                <hr>
                <p class="mb-0">This is usually fixed by hosting the website on a server that sends specific COOP/COEP headers. The tool is disabled until this condition is met.</p>
            </div>
        `;
        notificationArea.append(wrapper);

        // Disable the tool to prevent it from being used in a broken state
        uploadArea.style.pointerEvents = 'none';
        uploadArea.style.opacity = '0.5';
        
        // Stop the rest of the script from running
        return;
    }

    const { FFmpeg } = FFmpegWASM;
    const { fetchFile } = FFmpegUtil;

    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processingArea = document.getElementById('processingArea');
    const downloadArea = document.getElementById('downloadArea');
    const notificationArea = document.getElementById('notificationArea');
    const fileNameElem = document.getElementById('fileName');
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    const downloadLink = document.getElementById('downloadLink');
    const startOverBtn = document.getElementById('startOverBtn');

    let ffmpeg = null;

    // --- FFmpeg Setup ---
    const loadFFmpeg = async () => {
        if (ffmpeg && ffmpeg.loaded) {
            return ffmpeg;
        }
        
        ffmpeg = new FFmpeg();
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });

        ffmpeg.on('progress', ({ progress }) => {
            const p = Math.round(progress * 100);
            if (p >= 0 && p <= 100) {
                progressBar.style.width = `${p}%`;
                progressBar.textContent = `${p}%`;
            }
        });

        progressStatus.textContent = 'Loading conversion engine...';
        
        // CORRECTED: The versions now match the HTML file (0.12.10)
        await ffmpeg.load({
            coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
            wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
            workerURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.worker.js'
        });
        
        return ffmpeg;
    };
    
    // --- UI Functions ---
    function showNotification(message, type = 'danger') {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        notificationArea.innerHTML = '';
        notificationArea.append(wrapper);
    }

    function resetTool() {
        fileInput.value = '';
        uploadArea.classList.remove('d-none');
        processingArea.classList.add('d-none');
        downloadArea.classList.add('d-none');
        notificationArea.innerHTML = '';
    }

    // --- Event Listeners ---
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });
    startOverBtn.addEventListener('click', resetTool);

    // --- Main Logic ---
    const handleFile = async (file) => {
        if (!file || !file.type.startsWith('video/')) {
            showNotification('Please upload a valid video file.', 'warning');
            return;
        }
        resetTool();
        
        uploadArea.classList.add('d-none');
        processingArea.classList.remove('d-none');
        fileNameElem.textContent = file.name;
        
        try {
            const ffmpegInstance = await loadFFmpeg();
            
            progressStatus.textContent = 'Writing file to memory...';
            progressBar.style.width = '0%';
            progressBar.textContent = '...';

            const inputFileName = 'input.video';
            const outputFileName = 'output.mp3';
            
            await ffmpegInstance.writeFile(inputFileName, await fetchFile(file));

            progressStatus.textContent = 'Converting...';
            
            await ffmpegInstance.exec(['-i', inputFileName, '-q:a', '0', '-map', 'a', outputFileName]);
            
            progressStatus.textContent = 'Finalizing...';
            const data = await ffmpegInstance.readFile(outputFileName);

            const mp3Blob = new Blob([data.buffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(mp3Blob);

            const originalFileName = file.name.split('.').slice(0, -1).join('.');
            downloadLink.href = url;
            downloadLink.download = `${originalFileName}.mp3`;

            processingArea.classList.add('d-none');
            downloadArea.classList.remove('d-none');

            await ffmpegInstance.deleteFile(inputFileName);
            await ffmpegInstance.deleteFile(outputFileName);

        } catch (error) {
            console.error(error);
            showNotification('An error occurred during conversion. The video format might not be supported or the file is too large.', 'danger');
            resetTool();
        }
    };
});
