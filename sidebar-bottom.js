// Inject custom section at bottom of sidebar
(function() {
  function injectSidebarBottom() {
    // Find the sidebar container
    const sidebar = document.querySelector('#sidebar') || 
                    document.querySelector('#sidebar-content') ||
                    document.querySelector('[data-sidebar]') ||
                    document.querySelector('aside[aria-label*="Sidebar"]');
    
    if (!sidebar) return;
    
    // Check if custom section already exists
    if (document.querySelector('.sidebar-bottom-section')) return;
    
    // Find the Contact section in the navigation - search more broadly
    const navigationItems = document.querySelector('#navigation-items') || 
                           document.querySelector('[data-navigation-items]') ||
                           sidebar.querySelector('nav') ||
                           sidebar.querySelector('[class*="navigation"]') ||
                           sidebar;
    
    if (!navigationItems) return;
    
    // Find the Contact group - try multiple strategies
    let contactGroup = null;
    
    // Strategy 1: Look for elements containing "Contact" text anywhere
    const allElements = navigationItems.querySelectorAll('*');
    for (let el of allElements) {
      const text = el.textContent || '';
      if (text.trim() === 'Contact' || text.trim() === 'CONTACT') {
        // Find the parent group container
        let parent = el.parentElement;
        while (parent && parent !== navigationItems) {
          // Check if this looks like a group container
          if (parent.querySelector('.sidebar-group-header') || 
              parent.querySelector('.sidebar-title') ||
              parent.querySelector('a[href*="contact"]')) {
            contactGroup = parent;
            break;
          }
          parent = parent.parentElement;
        }
        if (contactGroup) break;
      }
    }
    
    // Strategy 2: Look for links with "contact" in href
    if (!contactGroup) {
      const contactLinks = navigationItems.querySelectorAll('a[href*="contact"], a[href*="Contact"]');
      if (contactLinks.length > 0) {
        let parent = contactLinks[0].parentElement;
        while (parent && parent !== navigationItems) {
          if (parent.querySelector('.sidebar-group-header') || 
              parent.querySelectorAll('a[href*="contact"]').length > 1) {
            contactGroup = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }
    
    // Strategy 3: Look for groups by structure
    if (!contactGroup) {
      const groups = navigationItems.querySelectorAll('[data-group], .sidebar-group, nav > div, nav > section, div[class*="group"]');
      for (let group of groups) {
        const header = group.querySelector('.sidebar-group-header, h3, h4, [class*="header"]');
        if (header && (header.textContent.includes('Contact') || header.textContent.includes('CONTACT'))) {
          contactGroup = group;
          break;
        }
      }
    }
    
    // Strategy 4: Use the last group as fallback
    if (!contactGroup) {
      const groups = navigationItems.querySelectorAll('[data-group], .sidebar-group, nav > div, nav > section');
      if (groups.length > 0) {
        contactGroup = groups[groups.length - 1];
      }
    }
    
    // Create the custom bottom section
    const bottomSection = document.createElement('div');
    bottomSection.className = 'sidebar-bottom-section';
    
    // Add divider
    const divider = document.createElement('div');
    divider.className = 'sidebar-bottom-divider';
    
    // Add content container
    const content = document.createElement('div');
    content.className = 'sidebar-bottom-content';
    
    // Clone the Contact group if found
    if (contactGroup) {
      const clonedGroup = contactGroup.cloneNode(true);
      // Remove any existing dividers from the clone
      const existingDividers = clonedGroup.querySelectorAll('.sidebar-bottom-divider, [class*="divider"]');
      existingDividers.forEach(d => d.remove());
      content.appendChild(clonedGroup);
      
      // Hide the original Contact group
      contactGroup.style.display = 'none';
    } else {
      // Fallback: Create Contact section manually if not found
      const contactSection = document.createElement('div');
      contactSection.className = 'sidebar-group';
      
      const header = document.createElement('div');
      header.className = 'sidebar-group-header';
      header.textContent = 'Contact';
      contactSection.appendChild(header);
      
      const links = [
        { text: 'Talk to us', href: '/contact/talk-to-us' },
        { text: 'Slack', href: '/contact/slack' },
        { text: 'Email', href: '/contact/email' }
      ];
      
      links.forEach(link => {
        const linkEl = document.createElement('a');
        linkEl.href = link.href;
        linkEl.className = 'sidebar-title';
        linkEl.textContent = link.text;
        contactSection.appendChild(linkEl);
      });
      
      content.appendChild(contactSection);
    }
    
    bottomSection.appendChild(divider);
    bottomSection.appendChild(content);
    
    // Append to sidebar
    sidebar.appendChild(bottomSection);
  }
  
  // Try to inject immediately
  injectSidebarBottom();
  
  // Also try after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSidebarBottom);
  }
  
  // Also try after delays to catch dynamically loaded content
  setTimeout(injectSidebarBottom, 500);
  setTimeout(injectSidebarBottom, 1000);
  setTimeout(injectSidebarBottom, 2000);
  
  // Watch for sidebar changes
  const observer = new MutationObserver(function(mutations) {
    if (!document.querySelector('.sidebar-bottom-section')) {
      injectSidebarBottom();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

