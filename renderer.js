// Tab management state
let tabs = [];
let activeTabId = null;

// Tab management functions
function createTab(filePath = null, content = '') {
  const tabId = Date.now().toString();
  const tab = {
    id: tabId,
    filePath: filePath,
    content: content,
    isUnsaved: false
  };
  tabs.push(tab);
  return tab;
}

function createTabElement(tab) {
  const tabElement = document.createElement('div');
  tabElement.className = 'tab';
  tabElement.dataset.tabId = tab.id;
  
  const tabName = document.createElement('span');
  tabName.textContent = tab.filePath ? tab.filePath.split('/').pop() : 'Untitled';
  tabElement.appendChild(tabName);
  
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '<i class="bx bx-x"></i>';
  closeBtn.className = 'tab-close';
  tabElement.appendChild(closeBtn);
  
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tab.id);
  });
  
  tabElement.addEventListener('click', () => switchTab(tab.id));
  return tabElement;
}

function switchTab(tabId) {
  const oldTab = tabs.find(t => t.id === activeTabId);
  if (oldTab) {
    oldTab.content = document.getElementById('text-area').value;
    document.querySelector(`.tab[data-tab-id="${oldTab.id}"]`).classList.remove('active');
  }
  
  activeTabId = tabId;
  const newTab = tabs.find(t => t.id === tabId);
  document.getElementById('text-area').value = newTab.content;
  document.querySelector(`.tab[data-tab-id="${tabId}"]`).classList.add('active');
}

function closeTab(tabId) {
  const tabIndex = tabs.findIndex(t => t.id === tabId);
  if (tabIndex === -1) return;
  
  const tab = tabs[tabIndex];
  if (tab.isUnsaved) {
    const shouldClose = confirm('This tab has unsaved changes. Close anyway?');
    if (!shouldClose) return;
  }
  
  document.querySelector(`.tab[data-tab-id="${tabId}"]`).remove();
  tabs.splice(tabIndex, 1);
  
  if (activeTabId === tabId) {
    if (tabs.length > 0) {
      switchTab(tabs[tabs.length - 1].id);
    } else {
      const newTab = createTab();
      addTabToUI(newTab);
      switchTab(newTab.id);
    }
  }
}

function addTabToUI(tab) {
  const tabsHeader = document.querySelector('.tabs-header');
  const newTabBtn = document.getElementById('new-tab-btn');
  const tabElement = createTabElement(tab);
  tabsHeader.insertBefore(tabElement, newTabBtn);
  switchTab(tab.id);
}

// Initialize first tab
const initialTab = createTab();
addTabToUI(initialTab);

// Event Listeners
document.getElementById('new-tab-btn').addEventListener('click', () => {
  const newTab = createTab();
  addTabToUI(newTab);
});

document.getElementById('text-area').addEventListener('input', () => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) {
    tab.isUnsaved = true;
    document.querySelector(`.tab[data-tab-id="${tab.id}"]`).classList.add('unsaved');
  }
});

window.electronAPI.fileOpened((event, data) => {
  const newTab = createTab(data.filePath, data.content);
  addTabToUI(newTab);
});

// listen for ctrl+s or cmd+s and save the file
document.addEventListener("keydown", async (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    
    const content = document.getElementById("text-area").value;
    const filePath = await window.electronAPI.saveFile(content);
    if (filePath) {
      tab.filePath = filePath;
      tab.isUnsaved = false;
      document.querySelector(`.tab[data-tab-id="${tab.id}"]`).classList.remove('unsaved');
      const tabName = document.querySelector(`.tab[data-tab-id="${tab.id}"] span`);
      tabName.textContent = filePath.split('/').pop();
    }
  }
});
