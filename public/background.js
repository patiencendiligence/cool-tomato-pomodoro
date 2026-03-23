// Toggle widget visibility when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Skip restricted URLs
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
    console.log('Cannot inject on restricted page:', tab.url);
    return;
  }

  try {
    // Try to send message to existing content script
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
  } catch (error) {
    // Content script not loaded yet, inject it first
    console.log('Content script not found, injecting...');
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      });
      // Wait a bit for script to initialize, then toggle
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
        } catch (e) {
          console.log('Failed to toggle after injection:', e);
        }
      }, 100);
    } catch (injectError) {
      console.log('Failed to inject content script:', injectError);
    }
  }
});
