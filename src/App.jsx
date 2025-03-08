import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Initialize electron from window object
  const electron = window.electron;
  const [tabs, setTabs] = useState([{ id: Date.now(), name: 'untitled', content: '', unsaved: false, filePath: null }]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    // Set up file open handler
    if (electron) {
      electron.onFileOpen((data) => {
        const { content, filePath } = data;
        const newTab = {
          id: tabs.length + 1,
          name: filePath.split(/[\\\/]/).pop(),
          content,
          unsaved: false,
          filePath
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab.id);
      });

      electron.onFileSaved((data) => {
        const { filePath } = data;
        setTabs(tabs.map(tab => {
          if (tab.id === activeTab) {
            return { ...tab, unsaved: false, filePath, name: filePath.split(/[\\\/]/).pop() };
          }
          return tab;
        }));
      });
    }
  }, []);

  const createNewTab = () => {
    const newTab = {
      id: Date.now(),
      name: 'untitled',
      content: '',
      unsaved: false
    };
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const handleContentChange = (id, newContent) => {
    setTabs(tabs.map(tab => {
      if (tab.id === id) {
        return { ...tab, content: newContent, unsaved: true };
      }
      return tab;
    }));
  };

  const handleSave = async (saveAs = false) => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab && electron) {
      try {
        await electron.saveFile({
          content: currentTab.content,
          filePath: currentTab.filePath,
          saveAs
        });
      } catch (error) {
        console.error('Failed to save file:', error);
      }
    }
  };
  useEffect(() => {
    if (electron) {
      const handleKeyPress = (e) => {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          handleSave(e.shiftKey); // If Shift is pressed, trigger Save As
        }
      };
      const handleMenuSave = () => handleSave(false);
      const handleMenuSaveAs = () => handleSave(true);
      window.addEventListener('keydown', handleKeyPress);
      electron.onMenuSave(handleMenuSave);
      electron.onMenuSaveAs(handleMenuSaveAs);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        electron.removeAllListeners('menu-save');
        electron.removeAllListeners('menu-save-as');
      };
    }
  }, [handleSave, electron]);
  return (
    <div className="tab-container">
      <div className="tabs-header">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.unsaved ? 'unsaved' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}</span>
            <span
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              ×
            </span>
          </div>
        ))}
        <button className="new-tab-button" onClick={createNewTab}>+</button>
      </div>
      <div className="menu-bar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.unsaved ? 'unsaved' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}</span>
            <span
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              ×
            </span>
          </div>
        ))}
        <button className="new-tab-button" onClick={createNewTab}>+</button>
      </div>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
        >
          <textarea
            value={tab.content}
            onChange={(e) => handleContentChange(tab.id, e.target.value)}
            spellCheck="false"
          />
        </div>
      ))}
    </div>
  );
};

export default App;