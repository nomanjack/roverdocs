// Inject "Copy Page" and "Share feedback" buttons below table of contents
(function() {
  function injectTocActions() {
    // Find the table of contents list/container
    const toc = document.querySelector('#table-of-contents') || 
                document.querySelector('[data-table-of-contents]') ||
                document.querySelector('aside[aria-label*="table"]') ||
                document.querySelector('aside nav');
    
    if (!toc) return;
    
    // Find the TOC list (where TOC items are)
    const tocList = toc.querySelector('ul, nav, [role="list"]') || toc;
    
    // Check if buttons already exist
    if (document.querySelector('.toc-action-item')) return;
    
    // Create divider
    const divider = document.createElement('li');
    divider.className = 'toc-actions-divider';
    divider.style.listStyle = 'none';
    // Margin, padding, and border are handled by CSS
    
    // Create "Copy Page" item styled like TOC item
    const copyItem = document.createElement('li');
    copyItem.className = 'toc-item toc-action-item';
    const copyLink = document.createElement('a');
    copyLink.href = '#';
    copyLink.className = 'toc-action-link';
    copyLink.style.cursor = 'pointer';
    copyLink.style.display = 'flex';
    copyLink.style.alignItems = 'center';
    copyLink.style.gap = '0.5rem';
    
    // Create copy icon using Lucide's clipboard format
    const copyIcon = document.createElement('span');
    copyIcon.className = 'toc-action-icon';
    copyIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>';
    
    // Create checkmark icon (hidden initially) using Lucide's check format
    const checkIcon = document.createElement('span');
    checkIcon.className = 'toc-action-icon toc-action-checkmark';
    checkIcon.style.display = 'none';
    checkIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
    
    const copyText = document.createElement('span');
    copyText.textContent = 'Copy Page';
    
    copyLink.appendChild(copyIcon);
    copyLink.appendChild(checkIcon);
    copyLink.appendChild(copyText);
    
    copyLink.addEventListener('click', async function(e) {
      e.preventDefault();
      try {
        // Get text content from the page (not HTML)
        const pageContent = document.querySelector('.mdx-content, [data-mdx-content], main article, main .prose') || document.querySelector('main');
        
        if (pageContent) {
          // Extract text content preserving structure
          let textContent = '';
          
          // Get page title
          const pageTitle = document.querySelector('h1, [data-page-title]')?.textContent?.trim() || '';
          if (pageTitle) {
            textContent += pageTitle + '\n\n';
          }
          
          // Extract text from all elements, preserving some structure
          const walker = document.createTreeWalker(
            pageContent,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let node;
          let lastElement = null;
          while (node = walker.nextNode()) {
            const parent = node.parentElement;
            if (parent && parent.tagName) {
              const tagName = parent.tagName.toLowerCase();
              
              // Add line breaks for block elements
              if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'DIV'].includes(parent.tagName)) {
                if (lastElement && lastElement !== parent) {
                  textContent += '\n';
                }
              }
              
              // Add heading markers
              if (tagName.match(/^h[1-6]$/)) {
                const level = parseInt(tagName[1]);
                textContent += '#'.repeat(level) + ' ';
              }
              
              textContent += node.textContent.trim();
              lastElement = parent;
            }
          }
          
          // Clean up extra whitespace
          textContent = textContent.replace(/\n{3,}/g, '\n\n').trim();
          
          await navigator.clipboard.writeText(textContent);
          
          // Animate to checkmark
          copyIcon.style.display = 'none';
          checkIcon.style.display = 'block';
          checkIcon.style.animation = 'checkmarkFadeIn 0.3s ease-in-out';
          
          setTimeout(() => {
            checkIcon.style.display = 'none';
            copyIcon.style.display = 'block';
          }, 2000);
        } else {
          // Fallback: use innerText
          const pageText = document.body.innerText || document.body.textContent;
          await navigator.clipboard.writeText(pageText);
          
          // Animate to checkmark
          copyIcon.style.display = 'none';
          checkIcon.style.display = 'block';
          checkIcon.style.animation = 'checkmarkFadeIn 0.3s ease-in-out';
          
          setTimeout(() => {
            checkIcon.style.display = 'none';
            copyIcon.style.display = 'block';
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy page:', err);
      }
    });
    
    copyItem.appendChild(copyLink);
    
    // Create "Share feedback" item styled like TOC item
    const feedbackItem = document.createElement('li');
    feedbackItem.className = 'toc-item toc-action-item';
    const feedbackLink = document.createElement('a');
    feedbackLink.href = '#';
    feedbackLink.className = 'toc-action-link';
    feedbackLink.style.cursor = 'pointer';
    feedbackLink.style.display = 'flex';
    feedbackLink.style.alignItems = 'center';
    feedbackLink.style.gap = '0.5rem';
    
    // Create feedback icon using Lucide's message-square
    const feedbackIcon = document.createElement('span');
    feedbackIcon.className = 'toc-action-icon';
    // Lucide message-square icon SVG (14x14) - matching Lucide format
    feedbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    
    // Create checkmark icon (hidden initially) using Lucide's check format
    const feedbackCheckIcon = document.createElement('span');
    feedbackCheckIcon.className = 'toc-action-icon toc-action-checkmark';
    feedbackCheckIcon.style.display = 'none';
    feedbackCheckIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
    
    const feedbackText = document.createElement('span');
    feedbackText.textContent = 'Share feedback';
    
    feedbackLink.appendChild(feedbackIcon);
    feedbackLink.appendChild(feedbackCheckIcon);
    feedbackLink.appendChild(feedbackText);
    
    feedbackLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Trigger Mintlify's feedback form
      const feedbackTrigger = document.querySelector('[data-feedback-trigger], button[aria-label*="feedback" i], [data-feedback-button]');
      
      if (feedbackTrigger) {
        feedbackTrigger.click();
      } else {
        // Try to find feedback thumbs buttons and click the feedback area
        const thumbsUp = document.querySelector('[data-feedback-thumbs-up], button[aria-label*="thumbs up" i]');
        const thumbsDown = document.querySelector('[data-feedback-thumbs-down], button[aria-label*="thumbs down" i]');
        const feedbackArea = document.querySelector('[data-feedback-area], .feedback-area, [class*="feedback"]');
        
        if (thumbsUp || thumbsDown || feedbackArea) {
          (thumbsUp || thumbsDown || feedbackArea)?.click();
        } else {
          // Fallback: try to find any feedback-related element
          const feedbackElements = document.querySelectorAll('button, [role="button"], [data-feedback]');
          for (let el of feedbackElements) {
            const text = (el.textContent || '').toLowerCase();
            const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
            if (text.includes('feedback') || ariaLabel.includes('feedback') || 
                text.includes('thumbs') || ariaLabel.includes('thumbs')) {
              el.click();
              break;
            }
          }
        }
      }
      
      // Animate to checkmark
      feedbackIcon.style.display = 'none';
      feedbackCheckIcon.style.display = 'block';
      feedbackCheckIcon.style.animation = 'checkmarkFadeIn 0.3s ease-in-out';
      
      setTimeout(() => {
        feedbackCheckIcon.style.display = 'none';
        feedbackIcon.style.display = 'block';
      }, 2000);
    });
    
    feedbackItem.appendChild(feedbackLink);
    
    // Insert divider and items into TOC list
    if (tocList.tagName === 'UL' || tocList.querySelector('ul')) {
      const list = tocList.tagName === 'UL' ? tocList : tocList.querySelector('ul');
      list.appendChild(divider);
      list.appendChild(copyItem);
      list.appendChild(feedbackItem);
    } else {
      // If no ul, create one or append to container
      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.padding = '0';
      list.style.margin = '0';
      list.appendChild(divider);
      list.appendChild(copyItem);
      list.appendChild(feedbackItem);
      tocList.appendChild(list);
    }
  }
  
  // Try to inject immediately
  injectTocActions();
  
  // Also try after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTocActions);
  }
  
  // Also try after delays to catch dynamically loaded content
  setTimeout(injectTocActions, 500);
  setTimeout(injectTocActions, 1000);
  setTimeout(injectTocActions, 2000);
  
  // Watch for TOC changes
  const observer = new MutationObserver(function(mutations) {
    if (!document.querySelector('.toc-actions-container')) {
      injectTocActions();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

