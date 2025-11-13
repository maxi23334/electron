// Import PDF-lib (will be loaded from node_modules)
const { PDFDocument, degrees } = require('pdf-lib');

// State
let currentTool = null;
let selectedFiles = [];

// DOM Elements
const toolsSection = document.getElementById('toolsSection');
const workArea = document.getElementById('workArea');
const workAreaTitle = document.getElementById('workAreaTitle');
const backBtn = document.getElementById('backBtn');
const selectFilesBtn = document.getElementById('selectFilesBtn');
const processBtn = document.getElementById('processBtn');
const fileList = document.getElementById('fileList');
const fileCount = document.getElementById('fileCount');
const pageSelection = document.getElementById('pageSelection');
const pageInput = document.getElementById('pageInput');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Tool configurations
const toolConfigs = {
  merge: {
    title: 'Fusionar PDF',
    description: 'Combinar múltiples PDFs en uno solo',
    needsMultipleFiles: true,
    showPageSelection: false
  },
  split: {
    title: 'Dividir PDF',
    description: 'Dividir un PDF en múltiples archivos',
    needsMultipleFiles: false,
    showPageSelection: true
  },
  compress: {
    title: 'Comprimir PDF',
    description: 'Reducir el tamaño del archivo PDF',
    needsMultipleFiles: false,
    showPageSelection: false
  },
  rotate: {
    title: 'Rotar PDF',
    description: 'Rotar todas las páginas del PDF',
    needsMultipleFiles: false,
    showPageSelection: false
  },
  extract: {
    title: 'Extraer Páginas',
    description: 'Extraer páginas específicas del PDF',
    needsMultipleFiles: false,
    showPageSelection: true
  },
  delete: {
    title: 'Eliminar Páginas',
    description: 'Eliminar páginas del PDF',
    needsMultipleFiles: false,
    showPageSelection: true
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeTools();
  initializeEventListeners();
});

function initializeTools() {
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', () => {
      const tool = card.dataset.tool;
      selectTool(tool);
    });
  });
}

function initializeEventListeners() {
  backBtn.addEventListener('click', goBackToTools);
  selectFilesBtn.addEventListener('click', selectFiles);
  processBtn.addEventListener('click', processFiles);

  // Page selection mode change
  const pageModesRadios = document.querySelectorAll('input[name="pageMode"]');
  pageModesRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'range' || e.target.value === 'specific') {
        pageInput.style.display = 'block';
      } else {
        pageInput.style.display = 'none';
      }
    });
  });
}

function selectTool(tool) {
  currentTool = tool;
  const config = toolConfigs[tool];

  workAreaTitle.textContent = config.title;
  toolsSection.style.display = 'none';
  workArea.style.display = 'block';

  // Show/hide page selection
  if (config.showPageSelection) {
    pageSelection.style.display = 'block';
  } else {
    pageSelection.style.display = 'none';
  }

  // Reset state
  selectedFiles = [];
  updateFileList();
  updateProcessButton();
}

function goBackToTools() {
  currentTool = null;
  selectedFiles = [];
  toolsSection.style.display = 'block';
  workArea.style.display = 'none';
  progressContainer.style.display = 'none';
}

async function selectFiles() {
  try {
    const files = await window.electronAPI.selectPdfFiles();

    if (files.length > 0) {
      const config = toolConfigs[currentTool];

      if (!config.needsMultipleFiles && files.length > 1) {
        await window.electronAPI.showMessage({
          type: 'warning',
          title: 'Advertencia',
          message: 'Esta herramienta solo acepta un archivo a la vez. Se utilizará el primero seleccionado.'
        });
        selectedFiles = [files[0]];
      } else {
        selectedFiles = files;
      }

      updateFileList();
      updateProcessButton();
    }
  } catch (error) {
    console.error('Error selecting files:', error);
    showError('Error al seleccionar archivos');
  }
}

function updateFileList() {
  fileCount.textContent = `${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''} seleccionado${selectedFiles.length !== 1 ? 's' : ''}`;

  if (selectedFiles.length === 0) {
    fileList.innerHTML = `
      <div class="empty-state">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="20" y="15" width="40" height="50" rx="4" stroke="#ccc" stroke-width="3" fill="none"/>
          <path d="M30 30 L50 30 M30 40 L50 40 M30 50 L50 50" stroke="#ccc" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <p>No hay archivos seleccionados</p>
        <button class="btn btn-secondary" onclick="document.getElementById('selectFilesBtn').click()">
          Seleccionar Archivos PDF
        </button>
      </div>
    `;
  } else {
    const fileItemsHtml = selectedFiles.map((file, index) => `
      <div class="file-item">
        <div class="file-info">
          <div class="file-icon">PDF</div>
          <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
          </div>
        </div>
        <div class="file-actions">
          <button class="btn-icon" onclick="removeFile(${index})" title="Eliminar">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    fileList.innerHTML = `<div class="file-items">${fileItemsHtml}</div>`;
  }
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFileList();
  updateProcessButton();
}

function updateProcessButton() {
  processBtn.disabled = selectedFiles.length === 0;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function processFiles() {
  try {
    showProgress('Procesando...');

    switch (currentTool) {
      case 'merge':
        await mergePDFs();
        break;
      case 'split':
        await splitPDF();
        break;
      case 'compress':
        await compressPDF();
        break;
      case 'rotate':
        await rotatePDF();
        break;
      case 'extract':
        await extractPages();
        break;
      case 'delete':
        await deletePages();
        break;
    }

    hideProgress();
  } catch (error) {
    console.error('Error processing files:', error);
    hideProgress();
    showError('Error al procesar los archivos: ' + error.message);
  }
}

async function mergePDFs() {
  updateProgress(0, 'Creando PDF combinado...');

  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < selectedFiles.length; i++) {
    updateProgress((i / selectedFiles.length) * 100, `Procesando ${selectedFiles[i].name}...`);

    const pdfBytes = await window.electronAPI.readPdfFile(selectedFiles[i].path);
    const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  updateProgress(100, 'Guardando PDF...');
  const mergedPdfBytes = await mergedPdf.save();

  const savedPath = await window.electronAPI.savePdfFile(
    Array.from(mergedPdfBytes),
    'pdf-fusionado.pdf'
  );

  if (savedPath) {
    await showSuccess(`PDF fusionado guardado exitosamente en:\n${savedPath}`);
  }
}

async function splitPDF() {
  const file = selectedFiles[0];
  updateProgress(0, 'Cargando PDF...');

  const pdfBytes = await window.electronAPI.readPdfFile(file.path);
  const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));
  const totalPages = pdf.getPageCount();

  const pageMode = document.querySelector('input[name="pageMode"]:checked').value;
  let pagesToSplit = [];

  if (pageMode === 'all') {
    // Split into individual pages
    for (let i = 0; i < totalPages; i++) {
      pagesToSplit.push([i]);
    }
  } else {
    const ranges = parsePageRange(document.getElementById('pageRange').value, totalPages);
    if (ranges.length === 0) {
      throw new Error('No se especificaron páginas válidas');
    }
    pagesToSplit = ranges;
  }

  for (let i = 0; i < pagesToSplit.length; i++) {
    updateProgress((i / pagesToSplit.length) * 100, `Creando documento ${i + 1} de ${pagesToSplit.length}...`);

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, pagesToSplit[i]);
    pages.forEach(page => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    await window.electronAPI.savePdfFile(
      Array.from(newPdfBytes),
      `pdf-dividido-${i + 1}.pdf`
    );
  }

  await showSuccess(`PDF dividido en ${pagesToSplit.length} archivo(s)`);
}

async function compressPDF() {
  const file = selectedFiles[0];
  updateProgress(0, 'Comprimiendo PDF...');

  const pdfBytes = await window.electronAPI.readPdfFile(file.path);
  const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));

  updateProgress(50, 'Optimizando...');

  // Save with compression options
  const compressedBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50
  });

  updateProgress(100, 'Guardando...');

  const savedPath = await window.electronAPI.savePdfFile(
    Array.from(compressedBytes),
    'pdf-comprimido.pdf'
  );

  if (savedPath) {
    const originalSize = file.size;
    const compressedSize = compressedBytes.length;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    await showSuccess(
      `PDF comprimido exitosamente\n` +
      `Tamaño original: ${formatFileSize(originalSize)}\n` +
      `Tamaño comprimido: ${formatFileSize(compressedSize)}\n` +
      `Reducción: ${reduction}%`
    );
  }
}

async function rotatePDF() {
  const file = selectedFiles[0];
  updateProgress(0, 'Rotando páginas...');

  const pdfBytes = await window.electronAPI.readPdfFile(file.path);
  const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));

  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    updateProgress((index / pages.length) * 100, `Rotando página ${index + 1}...`);
    page.setRotation(degrees(90));
  });

  updateProgress(100, 'Guardando...');
  const rotatedBytes = await pdf.save();

  const savedPath = await window.electronAPI.savePdfFile(
    Array.from(rotatedBytes),
    'pdf-rotado.pdf'
  );

  if (savedPath) {
    await showSuccess(`PDF rotado exitosamente`);
  }
}

async function extractPages() {
  const file = selectedFiles[0];
  updateProgress(0, 'Extrayendo páginas...');

  const pdfBytes = await window.electronAPI.readPdfFile(file.path);
  const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));
  const totalPages = pdf.getPageCount();

  const pageRange = document.getElementById('pageRange').value;
  const pageIndices = parsePageRange(pageRange, totalPages);

  if (pageIndices.length === 0 || pageIndices[0].length === 0) {
    throw new Error('No se especificaron páginas válidas para extraer');
  }

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pageIndices[0]);

  updateProgress(50, 'Creando nuevo PDF...');
  pages.forEach(page => newPdf.addPage(page));

  updateProgress(100, 'Guardando...');
  const extractedBytes = await newPdf.save();

  const savedPath = await window.electronAPI.savePdfFile(
    Array.from(extractedBytes),
    'pdf-extraido.pdf'
  );

  if (savedPath) {
    await showSuccess(`Páginas extraídas exitosamente`);
  }
}

async function deletePages() {
  const file = selectedFiles[0];
  updateProgress(0, 'Eliminando páginas...');

  const pdfBytes = await window.electronAPI.readPdfFile(file.path);
  const pdf = await PDFDocument.load(new Uint8Array(pdfBytes));
  const totalPages = pdf.getPageCount();

  const pageRange = document.getElementById('pageRange').value;
  const pagesToDelete = parsePageRange(pageRange, totalPages)[0] || [];

  if (pagesToDelete.length === 0) {
    throw new Error('No se especificaron páginas válidas para eliminar');
  }

  // Create array of pages to keep
  const pagesToKeep = [];
  for (let i = 0; i < totalPages; i++) {
    if (!pagesToDelete.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error('No se pueden eliminar todas las páginas del PDF');
  }

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pagesToKeep);

  updateProgress(50, 'Creando nuevo PDF...');
  pages.forEach(page => newPdf.addPage(page));

  updateProgress(100, 'Guardando...');
  const newBytes = await newPdf.save();

  const savedPath = await window.electronAPI.savePdfFile(
    Array.from(newBytes),
    'pdf-modificado.pdf'
  );

  if (savedPath) {
    await showSuccess(`${pagesToDelete.length} página(s) eliminada(s) exitosamente`);
  }
}

function parsePageRange(rangeString, totalPages) {
  if (!rangeString || rangeString.trim() === '') {
    return [[]];
  }

  const parts = rangeString.split(',').map(s => s.trim());
  const allIndices = [];

  for (const part of parts) {
    if (part.includes('-')) {
      // Range like "1-5"
      const [start, end] = part.split('-').map(s => parseInt(s.trim()));
      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        continue;
      }
      for (let i = start - 1; i < end; i++) {
        if (!allIndices.includes(i)) {
          allIndices.push(i);
        }
      }
    } else {
      // Single page
      const page = parseInt(part);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        if (!allIndices.includes(page - 1)) {
          allIndices.push(page - 1);
        }
      }
    }
  }

  return [allIndices.sort((a, b) => a - b)];
}

function showProgress(message) {
  progressContainer.style.display = 'block';
  progressText.textContent = message;
  progressFill.style.width = '0%';
}

function updateProgress(percent, message) {
  progressFill.style.width = percent + '%';
  progressText.textContent = message;
}

function hideProgress() {
  progressContainer.style.display = 'none';
}

async function showSuccess(message) {
  await window.electronAPI.showMessage({
    type: 'info',
    title: 'Éxito',
    message: message
  });
}

async function showError(message) {
  await window.electronAPI.showMessage({
    type: 'error',
    title: 'Error',
    message: message
  });
}

// Make removeFile function global
window.removeFile = removeFile;
