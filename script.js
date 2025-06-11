document.addEventListener('DOMContentLoaded', function () {
    // Data structure for all tools, categorized
    const toolsData = {
        "🖼️ Image Tools": {
            subheading: "Convert, resize, and optimize your images with ease.",
            icon: "bi-images",
            tools: [
                { name: "Image Converter", desc: "Convert images to JPG, PNG, WEBP, etc.", link: "./tools/Image tools/image-converter/image-converter.html" },
                { name: "Image Compressor", desc: "Reduce image file size without losing quality.", link: "./tools/Image tools/image-compressor/image-compressor.html" },
                { name: "Image Resizer", desc: "Change the dimensions of your images.", link: "./tools/Image tools/image-resizer/image-resizer.html" },
                { name: "Image Cropper", desc: "Crop images to a specific area.", link: "./tools/Image tools/image-cropper/image-cropper.html" },
                { name: "Image to Text (OCR)", desc: "Extract text from any image.", link: "./tools/Image tools/image-to-text/image-to-text.html" },
                { name: "Image Rotator/Flipper", desc: "Rotate or flip your images.", link: "./tools/Image tools/image-rotator/image-rotator.html" }
            ]
        },
        "✨ Video & Audio Tools": {
            subheading: "Manipulate your video and audio files effortlessly.",
            icon: "bi-film",
            tools: [
                { name: "Video to MP3 Converter", desc: "Extract audio from your video files.", link: "#" },
                { name: "MP3 to Video Converter", desc: "Create a simple video from an audio file.", link: "#" },
                { name: "Video Compressor", desc: "Reduce video file size.", link: "#" },
                { name: "Audio Compressor", desc: "Compress your audio files.", link: "#" },
                { name: "Video Resizer", desc: "Adjust the resolution of your videos.", link: "#" },
                { name: "Voice to text Converter", desc: "Transcribe speech from audio files.", link: "#" }
            ]
        },
        "📄 Document Tools": {
            subheading: "Manage your PDF and other documents seamlessly.",
            icon: "bi-file-earmark-zip-fill",
            tools: [
                { name: "PDF to Word / Word to PDF", desc: "Convert documents between formats.", link: "#" },
                { name: "PDF Compressor", desc: "Make your PDF files smaller.", link: "#" },
                { name: "PDF Merger & Splitter", desc: "Combine or separate PDF pages.", link: "#" },
                { name: "Document Converter", desc: "Convert various document types.", link: "#" },
                { name: "PDF Lock/Unlock", desc: "Add or remove passwords from PDFs.", link: "#" },
                { name: "eSign PDF", desc: "Sign your PDF documents electronically.", link: "#" }
            ]
        },
        "🧮 Calculator Tools": {
            subheading: "Perform calculations for finance, health, and more.",
            icon: "bi-calculator-fill",
            tools: [
                { name: "Scientific Calculator", desc: "For complex mathematical calculations.", link: "#" },
                { name: "Age Calculator", desc: "Find your exact age.", link: "#" },
                { name: "BMI Calculator", desc: "Calculate your Body Mass Index.", link: "#" },
                { name: "Loan EMI Calculator", desc: "Estimate your loan payments.", link: "#" },
                { name: "GST Calculator", desc: "Calculate Goods and Services Tax.", link: "#" },
                { name: "Currency Converter", desc: "Get the latest exchange rates.", link: "#" }
            ]
        },
        "🔤 Text Tools": {
            subheading: "Format, analyze, and manipulate your text.",
            icon: "bi-file-text-fill",
            tools: [
                { name: "Text Case Converter", desc: "Change text to uppercase, lowercase, etc.", link: "#" },
                { name: "Word & Character Counter", desc: "Count words and characters in your text.", link: "./tools/Text Tools/word-counter/word-counter.html" },
                { name: "Remove Duplicate Lines", desc: "Eliminate repeated lines from a list.", link: "#" },
                { name: "Text Sorter", desc: "Sort lines of text alphabetically.", link: "#" },
                { name: "Text Reverser", desc: "Reverse your text.", link: "#" },
                { name: "Text Encryptor/Decryptor", desc: "Secure your text with encryption.", link: "#" }
            ]
        },
        "🌐 Web/Developer Tools": {
            subheading: "Essential tools for web developers and programmers.",
            icon: "bi-code-slash",
            tools: [
                { name: "HTML/CSS/JS Minifier", desc: "Minify your code for faster loading.", link: "#" },
                { name: "JSON Formatter & Validator", desc: "Beautify and validate JSON data.", link: "#" },
                { name: "Base64 Encoder/Decoder", desc: "Encode or decode data in Base64.", link: "#" },
                { name: "URL Encoder/Decoder", desc: "Encode or decode URLs.", link: "#" },
                { name: "Color Picker & Converter", desc: "Pick colors and convert between formats.", link: "#" },
                { name: "Regex Tester", desc: "Test your regular expressions.", link: "#" }
            ]
        },
        "🎨 Color Tools": {
            subheading: "Create and manage your color palettes.",
            icon: "bi-palette-fill",
            tools: [
                { name: "Color Picker from Image", desc: "Extract colors from an uploaded image.", link: "#" },
                { name: "HEX to RGB Converter", desc: "Convert HEX color codes to RGB.", link: "#" },
                { name: "Gradient Generator", desc: "Create beautiful CSS gradients.", link: "#" },
                { name: "Contrast Checker", desc: "Check color contrast for accessibility.", link: "#" },
                { name: "Palette Generator", desc: "Generate color palettes from a single color.", link: "#" },
                { name: "Color Blindness Simulator", desc: "Simulate how your colors appear to others.", link: "#" }
            ]
        },
        "✨ SEO & Keyword Tools": {
        subheading: "Optimize your content and improve search rankings.",
        icon: "bi-key",
        tools: [
            { name: "Keyword Position", desc: "Check the ranking of your keywords in search results.", link: "#" },
            { name: "Keywords Density Checker", desc: "Analyze the density of keywords in your content.", link: "#" },
            { name: "Keywords Suggestions", desc: "Get new keyword ideas for your content.", link: "#" },
            { name: "Keyword Research", desc: "Discover valuable keywords for your niche.", link: "#" },
            { name: "Keyword Competition", desc: "Assess the competition for your target keywords.", link: "#" },
            { name: "Related Keywords Finder", desc: "Find keywords related to your main topic.", link: "#" },
            { name: "Long Tail Keyword Suggestion", desc: "Get suggestions for long-tail keywords.", link: "#" },
            { name: "Keywords Rich Domains Suggestions", desc: "Find domain names rich with your keywords.", link: "#" },
            { name: "SEO Keyword Competition Analysis", desc: "Analyze the SEO competition for keywords.", link: "#" },
            { name: "Live Keyword Analyzer", desc: "Analyze keywords in real-time.", link: "#" },
            { name: "Keyword Overview", desc: "Get a comprehensive overview of a keyword.", link: "#" },
            { name: "Keyword Difficulty", desc: "Determine the difficulty of ranking for a keyword.", link: "#" },
            { name: "Paid Keyword Finder", desc: "Find paid keywords for your campaigns.", link: "#" }
        ]
    },
    "✨ Meta & Social Tools": {
        subheading: "Analyze and generate meta tags for SEO and social sharing.",
        icon: "bi-tags",
        tools: [
            { name: "Meta Tags Analyzer", desc: "Analyze the meta tags of any web page.", link: "#" },
            { name: "Meta Tag Generator", desc: "Create SEO-friendly meta title and description tags.", link: "#" },
            { name: "Open Graph Checker", desc: "Check and debug your Open Graph tags for social media.", link: "#" },
            { name: "Open Graph Generator", desc: "Create Open Graph tags for rich social media sharing.", link: "#" },
            { name: "Twitter Card Generator", desc: "Generate Twitter Card markup for enhanced tweets.", link: "#" }
        ]
    },
    "✨ Website Analysis Tools": {
        subheading: "Analyze and optimize your website's performance and SEO.",
        icon: "bi-bar-chart-line",
        tools: [
            { name: "Website SEO Score Checker", desc: "Check the overall SEO score of your website.", link: "#" },
            { name: "Google PageRank Checker", desc: "Check the Google PageRank of your website.", link: "#" },
            { name: "Page Speed Test", desc: "Test the loading speed of your web pages.", link: "#" },
            { name: "Website Page Size Checker", desc: "Check the size of your website's pages.", link: "#" },
            { name: "Website Page Snooper", desc: "Get a behind-the-scenes look at any website.", link: "#" },
            { name: "Website Hit Counter", desc: "Track the number of visits to your website.", link: "#" },
            { name: "URL Rewriting Tool", desc: "Create SEO-friendly URLs for your website.", link: "#" },
            { name: "URL Encoder Decoder", desc: "Encode or decode URLs for safe transmission.", link: "#" },
            { name: "Mobile-Friendly Test", desc: "Test if your website is mobile-friendly.", link: "#" }
        ]
    },
    "✨ Social Media Downloader": {
        subheading: "Download videos and GIFs from your favorite social platforms.",
        icon: "bi-download",
        tools: [
            { name: "YouTube Video Downloader", desc: "Save videos from YouTube in various qualities.", link: "#" },
            { name: "Facebook Video Downloader", desc: "Download videos directly from Facebook.", link: "#" },
            { name: "Facebook Reels Downloader", desc: "Save your favorite Reels from Facebook.", link: "#" },
            { name: "Instagram Reels Downloader", desc: "Download entertaining Reels from Instagram.", link: "#" },
            { name: "Pinterest Video Downloader", desc: "Download videos from Pinterest pins.", link: "#" },
            { name: "Twitter Video Downloader", desc: "Save videos and media from Twitter.", link: "#" },
            { name: "Reddit Video Downloader", desc: "Download videos posted on Reddit.", link: "#" },
            { name: "TikTok Video Downloader", desc: "Download TikTok videos, with or without watermark.", link: "#" },
            { name: "Twitter GIF Downloader", desc: "Save animated GIFs from tweets.", link: "#" }
        ]
    },
        "🛠️ Utility Tools": {
            subheading: "A collection of handy utilities for various tasks.",
            icon: "bi-tools",
            tools: [
                { name: "QR Code Generator & Scanner", desc: "Create and read QR codes.", link: "#" },
                { name: "Barcode Generator", desc: "Generate barcodes in various formats.", link: "#" },
                { name: "UUID Generator", desc: "Generate universally unique identifiers.", link: "#" },
                { name: "Unit Converter", desc: "Convert between different units.", link: "#" },
                { name: "Time Zone Converter", desc: "Convert time between different time zones.", link: "#" },
                { name: "Password Generator", desc: "Create random, secure passwords.", link: "#" }
            ]
        },
    };

    const toolsContainer = document.getElementById('tools');

    // Function to render all tool cards into the DOM
    function renderTools() {
        let content = '';
        // Iterate over each category in the data
        for (const category in toolsData) {
            const section = toolsData[category];
            // Added a data-category attribute to the section for easier selection
            content += `
                <section class="tool-section" data-category="${category}">
                    <h2 class="section-heading text-center">${category}</h2>
                    <p class="section-subheading text-center">${section.subheading}</p>
                    <div class="row g-4 tool-list">
            `;

            // Iterate over each tool in the category
            section.tools.forEach(tool => {
                // Create a card for each tool
                content += `
                    <div class="col-md-6 col-lg-4 tool-item" data-keywords="${tool.name.toLowerCase()} ${tool.desc.toLowerCase()}">
                        <div class="card tool-card p-2">
                            <div class="card-body text-center">
                                <div>
                                    <div class="tool-card-icon mb-3">
                                        <i class="bi ${section.icon}"></i>
                                    </div>
                                    <h5 class="card-title">${tool.name}</h5>
                                    <p class="card-text mb-4">${tool.desc}</p>
                                </div>
                                <a href="${tool.link}" class="btn btn-outline-primary-custom mt-auto">Use Tool</a>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            content += '</div></section>';
        }
        toolsContainer.innerHTML = content;
    }

    // Initial render of all tools
    renderTools();

    // Live Search Functionality
    const searchInput = document.getElementById('toolSearch');
    searchInput.addEventListener('keyup', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const toolSections = document.querySelectorAll('.tool-section');
        
        // Loop through each tool section
        toolSections.forEach(section => {
            const toolItems = section.querySelectorAll('.tool-item');
            let sectionHasVisibleItems = false;

            // Loop through all tool cards in the section
            toolItems.forEach(item => {
                const keywords = item.dataset.keywords;
                if (keywords.includes(searchTerm)) {
                    item.style.display = 'block';
                    sectionHasVisibleItems = true; // Mark that this section has at least one match
                } else {
                    item.style.display = 'none';
                }
            });

            // Now, show or hide the entire section based on whether it has visible items
            if (sectionHasVisibleItems) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });

});
