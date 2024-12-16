document.addEventListener('DOMContentLoaded', () => {
    const setupDropZone = (dropZone, fileInput) => {
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-over');
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            fileInput.files = files;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        };

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('click', () => fileInput.click());
    };

    const handleFileChange = (fileInput, resultDiv) => {
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            const fileNames = files.map(file => file.name).join(', ');
            const dropZone = fileInput.closest('.drop-zone');
            dropZone.querySelector('p').textContent = fileNames || 'Drag and drop your file here or click to browse';
        });
    };

    const handleFormSubmit = (form, loadingDiv, resultDiv) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            try {
                // Show loading state
                submitButton.disabled = true;
                loadingDiv.classList.add('visible');
                resultDiv.classList.remove('visible');
                resultDiv.innerHTML = '';

                const response = await fetch(form.action || form.getAttribute('data-action'), {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <div class="success">
                            <p>${data.message}</p>
                            ${data.downloadUrl ? `<a href="${data.downloadUrl}" class="download-link">Download File</a>` : ''}
                        </div>
                    `;
                } else {
                    throw new Error(data.error || 'Conversion failed');
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            } finally {
                // Reset loading state
                submitButton.disabled = false;
                loadingDiv.classList.remove('visible');
                resultDiv.classList.add('visible');
            }
        });
    };

    // Setup CSV form
    const csvForm = document.getElementById('csvForm');
    const csvDropZone = document.getElementById('csvDropZone');
    const csvFileInput = document.getElementById('csvFile');
    const csvLoading = document.getElementById('csvLoading');
    const csvResult = document.getElementById('csvResult');

    setupDropZone(csvDropZone, csvFileInput);
    handleFileChange(csvFileInput, csvResult);
    handleFormSubmit(csvForm, csvLoading, csvResult);

    // Setup Shapefile form
    const shapefileForm = document.getElementById('shapefileForm');
    const shapefileDropZone = document.getElementById('shapefileDropZone');
    const shapefileInput = shapefileForm.querySelector('input[type="file"]');
    const shapefileLoading = document.getElementById('shapefileLoading');
    const shapefileResult = document.getElementById('shapefileResult');

    setupDropZone(shapefileDropZone, shapefileInput);
    handleFileChange(shapefileInput, shapefileResult);
    handleFormSubmit(shapefileForm, shapefileLoading, shapefileResult);
});