import './style.css';
import { format, isSameDay, isYesterday } from 'date-fns';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  initializeChecklist();
  checkResetTime();
  updateStreak();
});

// Update the current date display
function updateDate() {
  const dateElement = document.getElementById('current-date');
  const today = new Date();
  dateElement.textContent = format(today, 'EEEE, MMMM d, yyyy');
}

// Initialize checklist items
function initializeChecklist() {
  const sections = document.querySelectorAll('.checklist-section');
  
  sections.forEach(section => {
    const checkbox = section.querySelector('input[type="checkbox"]');
    const id = checkbox.id;
    const timeElement = section.querySelector('.checklist-time');
    
    // Load saved state
    const savedState = loadItemState(id);
    checkbox.checked = savedState.checked;
    if (savedState.checked) {
      section.classList.add('checked');
      timeElement.textContent = format(new Date(savedState.time), 'h:mm a');
    }
    
    // Handle tap/click
    section.addEventListener('click', () => {
      const newState = !checkbox.checked;
      checkbox.checked = newState;
      
      if (newState) {
        section.classList.add('checked');
        const now = new Date();
        timeElement.textContent = format(now, 'h:mm a');
        saveItemState(id, { checked: true, time: now.toISOString() });
      } else {
        section.classList.remove('checked');
        timeElement.textContent = '';
        saveItemState(id, { checked: false, time: null });
      }
      
      updateStreak();
      saveHistory(id, newState);
    });
  });
}

// Save item state to localStorage
function saveItemState(id, state) {
  const allState = JSON.parse(localStorage.getItem('checklistState') || '{}');
  allState[id] = state;
  localStorage.setItem('checklistState', JSON.stringify(allState));
}

// Load item state from localStorage
function loadItemState(id) {
  const state = JSON.parse(localStorage.getItem('checklistState') || '{}');
  return state[id] || { checked: false, time: null };
}

// Save history of item completion
function saveHistory(id, checked) {
  const history = JSON.parse(localStorage.getItem('checklistHistory') || '{}');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  if (!history[today]) {
    history[today] = {};
  }
  
  history[today][id] = checked;
  localStorage.setItem('checklistHistory', JSON.stringify(history));
}

// Calculate and update streak
function updateStreak() {
  const history = JSON.parse(localStorage.getItem('checklistHistory') || '{}');
  const dates = Object.keys(history).sort();
  let streak = 0;
  
  // Check if today is complete
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayComplete = isTodayComplete(history[today]);
  
  // If today is complete, start counting from today
  if (todayComplete) {
    streak = 1;
    let currentDate = new Date();
    
    // Count backwards through completed days
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      if (history[dateStr] && isDayComplete(history[dateStr])) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  // Update streak display
  const streakElement = document.getElementById('streak');
  if (streakElement) {
    streakElement.textContent = `Current Streak: ${streak} days`;
  }
}

// Check if all items for today are complete
function isTodayComplete(todayItems) {
  if (!todayItems) return false;
  
  const allItems = getAllItems();
  return allItems.every(item => todayItems[item] === true);
}

// Check if all items for a specific day are complete
function isDayComplete(dayItems) {
  if (!dayItems) return false;
  
  const allItems = getAllItems();
  return allItems.every(item => dayItems[item] === true);
}

// Get all item IDs
function getAllItems() {
  return [
    'wake-check',
    'morning-check',
    'breakfast-check',
    'afternoon-check',
    'dinner-check',
    'evening-check',
    'night-check'
  ];
}

// Check if it's time to reset the checklist (3 AM)
function checkResetTime() {
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(3, 0, 0, 0);
  
  // If it's past 3 AM and we haven't reset today
  if (now > resetTime) {
    const lastReset = localStorage.getItem('lastReset');
    const today = format(now, 'yyyy-MM-dd');
    
    if (lastReset !== today) {
      resetChecklist();
      localStorage.setItem('lastReset', today);
    }
  }
}

// Reset all checklist items
function resetChecklist() {
  localStorage.removeItem('checklistState');
  const sections = document.querySelectorAll('.checklist-section');
  sections.forEach(section => {
    section.classList.remove('checked');
    const checkbox = section.querySelector('input[type="checkbox"]');
    checkbox.checked = false;
    const timeElement = section.querySelector('.checklist-time');
    timeElement.textContent = '';
  });
} 