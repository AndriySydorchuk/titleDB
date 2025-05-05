let parts = JSON.parse(localStorage.getItem('parts')) || [];

function saveParts() {
    localStorage.setItem('parts', JSON.stringify(parts));
}

function addPart() {
    const title = document.getElementById('title').value;

    if (!title) {
        alert('Please fill in the title.');
        return;
    }

    const part = { title };
    parts.push(part);
    saveParts();
    renderParts();

    document.getElementById('title').value = '';
}

function renderParts() {
    const recordsDiv = document.getElementById('records');
    recordsDiv.innerHTML = '';

    parts.forEach((part, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';

        const span = document.createElement('span');
        span.textContent = part.title;
        span.style.cursor = 'pointer';
        span.onclick = () => copyToClipboard(part.title);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // важливо! не дає події йти вгору до div.record
            deletePart(index);
        };

        recordDiv.appendChild(span);
        recordDiv.appendChild(deleteButton);
        recordsDiv.appendChild(recordDiv);
    });
}


document.querySelectorAll('.sidebar .record').forEach(record => {
    record.addEventListener('click', () => {
        const text = record.textContent.trim();
        navigator.clipboard.writeText(text).catch(err => {
            alert('Failed to copy: ' + err);
        });
    });
});

function deletePart(index) {
    if (confirm('Are you sure you want to delete this part?')) {
        parts.splice(index, 1);
        saveParts();
        renderParts();
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

function searchParts() {
    const searchValue = document.getElementById('search').value.toLowerCase().trim();
    const searchWords = searchValue.split(/\s+/);

    const filteredParts = parts.filter(part => {
        const titleWords = part.title.toLowerCase().split(/\s+/);
        return searchWords.every(word => titleWords.some(titleWord => titleWord.includes(word)));
    });

    const recordsDiv = document.getElementById('records');
    recordsDiv.innerHTML = '';

    filteredParts.forEach((part, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';

        const span = document.createElement('span');
        span.textContent = part.title;
        span.style.cursor = 'pointer';
        span.onclick = () => copyToClipboard(part.title);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deletePartByTitle(part.title);
        };

        recordDiv.appendChild(span);
        recordDiv.appendChild(deleteButton);
        recordsDiv.appendChild(recordDiv);
    });
}


function deletePartByTitle(title) {
    const index = parts.findIndex(part => part.title === title);
    if (index !== -1) {
        if (confirm('Are you sure you want to delete this part?')) {
            parts.splice(index, 1);
            saveParts();
            renderParts();
            searchParts();
        }
    }
}

function exportParts() {
    const dataStr = JSON.stringify(parts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parts.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importParts() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedParts = JSON.parse(e.target.result);
            if (Array.isArray(importedParts)) {
                parts = importedParts;
                saveParts();
                renderParts();
            } else {
                alert('Invalid file format.');
            }
        } catch (error) {
            alert('Error reading file.');
        }
    };
    reader.readAsText(file);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopiedToast(); // опціонально
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

function showCopiedToast() {
    const toast = document.getElementById('copy-toast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 1000);
}



renderParts();
