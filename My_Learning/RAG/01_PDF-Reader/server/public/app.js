document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const pineconeStatusDot = document.getElementById('pineconeStatusDot');
  const indexNameLabel = document.getElementById('indexNameLabel');
  const embeddingModelLabel = document.getElementById('embeddingModelLabel');
  const pineconeStateLabel = document.getElementById('pineconeStateLabel');
  const docFileName = document.getElementById('docFileName');
  const docFileSize = document.getElementById('docFileSize');
  const ingestBtn = document.getElementById('ingestBtn');
  const dropZone = document.getElementById('dropZone');
  const pdfFileInput = document.getElementById('pdfFileInput');
  const alertBanner = document.getElementById('alertBanner');
  const alertMessage = document.getElementById('alertMessage');
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const inspectorDrawer = document.getElementById('inspectorDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const sourceChunksList = document.getElementById('sourceChunksList');

  let currentSources = [];

  // Fetch Initial Status
  async function fetchStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();

      if (data.success) {
        indexNameLabel.textContent = data.system.indexName || '01-pdf-reader-rag';
        embeddingModelLabel.textContent = data.system.embeddingProvider === 'mistral' ? 'Mistral AI' : 'MiniLM-L6-v2 (Local)';

        if (data.vectorStore && data.vectorStore.connected) {
          pineconeStatusDot.className = 'status-indicator pulse-green';
          pineconeStateLabel.textContent = 'Connected';
        } else {
          pineconeStatusDot.className = 'status-indicator';
          pineconeStateLabel.textContent = 'Not Connected';
        }

        if (data.pdfDocument && data.pdfDocument.exists) {
          docFileName.textContent = data.pdfDocument.fileName;
          docFileSize.textContent = `${(data.pdfDocument.sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
        }
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
      pineconeStateLabel.textContent = 'Error connecting';
    }
  }

  fetchStatus();

  // Alert Banner Helper
  function showAlert(msg, isError = false) {
    alertBanner.classList.remove('hidden');
    alertMessage.textContent = msg;
    const icon = alertBanner.querySelector('.alert-icon');
    if (isError) {
      icon.className = 'fa-solid fa-circle-exclamation alert-icon';
      alertBanner.style.background = 'rgba(255, 71, 87, 0.15)';
      alertBanner.style.borderColor = 'rgba(255, 71, 87, 0.3)';
      alertBanner.style.color = '#ff4757';
    } else {
      icon.className = 'fa-solid fa-circle-notch fa-spin alert-icon';
      alertBanner.style.background = 'rgba(0, 242, 254, 0.15)';
      alertBanner.style.borderColor = 'rgba(0, 242, 254, 0.3)';
      alertBanner.style.color = '#00f2fe';
    }
  }

  function hideAlert() {
    alertBanner.classList.add('hidden');
  }

  // Ingest Document
  ingestBtn.addEventListener('click', async () => {
    ingestBtn.disabled = true;
    showAlert('Ingesting PDF into Pinecone vector index... Please wait (this may take a minute for embeddings calculation).');

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunkSize: 1000, chunkOverlap: 200 }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert(`✅ ${data.message}`);
        setTimeout(hideAlert, 4000);
        appendBotMessage(`🎉 <strong>Ingestion Successful!</strong> Processed ${data.details.totalPages} pages into ${data.details.totalChunks} chunks and stored vectors in Pinecone. You can now ask questions about the document!`);
        fetchStatus();
      } else {
        showAlert(`❌ Ingestion Failed: ${data.error}`, true);
      }
    } catch (err) {
      showAlert(`❌ Ingestion Error: ${err.message}`, true);
    } finally {
      ingestBtn.disabled = false;
    }
  });

  // Custom PDF Upload
  dropZone.addEventListener('click', () => pdfFileInput.click());

  pdfFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    docFileName.textContent = file.name;
    docFileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    showAlert(`Uploading and processing '${file.name}'...`);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: base64, fileName: file.name }),
        });

        const data = await res.json();
        if (data.success) {
          showAlert(`✅ Uploaded & Ingested ${file.name} successfully!`);
          setTimeout(hideAlert, 4000);
          appendBotMessage(`📁 <strong>Uploaded & Indexed '${file.name}'!</strong> Created ${data.details.totalChunks} vector chunks. Fire away with your questions!`);
          fetchStatus();
        } else {
          showAlert(`❌ Upload Failed: ${data.error}`, true);
        }
      } catch (err) {
        showAlert(`❌ Upload Error: ${err.message}`, true);
      }
    };
    reader.readAsDataURL(file);
  });

  // Chat Submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    appendUserMessage(query);
    userInput.value = '';
    sendBtn.disabled = true;

    // Add typing indicator
    const typingBubble = appendTypingIndicator();

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, topK: 4 }),
      });

      const data = await res.json();
      typingBubble.remove();

      if (data.success && data.data) {
        const rag = data.data;
        currentSources = rag.sources || [];
        appendBotMessage(formatAnswer(rag.answer), rag.sources, rag.modelUsed);
      } else {
        appendBotMessage(`⚠️ Error processing query: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      typingBubble.remove();
      appendBotMessage(`❌ Communication error: ${err.message}`);
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Sample Prompt Chips
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('prompt-chip')) {
      const prompt = e.target.getAttribute('data-prompt');
      if (prompt) {
        userInput.value = prompt;
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Clear Chat
  clearChatBtn.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    appendBotMessage(`Conversation cleared. What else would you like to know about your PDF document?`);
  });

  // Inspector Drawer Controls
  closeDrawerBtn.addEventListener('click', () => {
    inspectorDrawer.classList.remove('open');
  });

  function openInspector(sources) {
    sourceChunksList.innerHTML = '';
    if (!sources || sources.length === 0) {
      sourceChunksList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>No source chunks retrieved for this query.</p></div>`;
    } else {
      sources.forEach((chunk, index) => {
        const scorePct = (chunk.score * 100).toFixed(1);
        const pageNum = chunk.metadata?.loc?.pageNumber || chunk.metadata?.page || 'N/A';
        const card = document.createElement('div');
        card.className = 'chunk-card';
        card.innerHTML = `
          <div class="chunk-header">
            <span>Chunk #${index + 1} (Page ${pageNum})</span>
            <span class="score-badge">${scorePct}% Match</span>
          </div>
          <div class="chunk-body">${escapeHtml(chunk.content)}</div>
        `;
        sourceChunksList.appendChild(card);
      });
    }
    inspectorDrawer.classList.add('open');
  }

  // Helpers
  function appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user-bubble';
    bubble.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-user"></i></div>
      <div class="bubble-content">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function appendBotMessage(htmlContent, sources = [], model = '') {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot-bubble';
    
    let sourceButton = '';
    if (sources && sources.length > 0) {
      sourceButton = `
        <div class="source-tag" onclick='window.openChunkDrawer()'>
          <i class="fa-solid fa-layer-group"></i> Inspect ${sources.length} Context Chunks
        </div>
      `;
    }

    bubble.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="bubble-content">
        ${htmlContent}
        ${sourceButton}
      </div>
    `;

    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    window.openChunkDrawer = () => openInspector(sources);
  }

  function appendTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot-bubble';
    bubble.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="bubble-content">
        <p><i class="fa-solid fa-circle-notch fa-spin"></i> Searching vector database & generating answer...</p>
      </div>
    `;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return bubble;
  }

  function formatAnswer(text) {
    // Basic Markdown formatting
    let formatted = escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n- /g, '<br/>• ');
    return `<p>${formatted}</p>`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
