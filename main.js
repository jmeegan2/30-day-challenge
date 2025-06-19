const rows = 5, cols = 6, key = 'checkboxGrid', goalsKey = 'goalsText';
const saved = JSON.parse(localStorage.getItem(key) || '{}');
let savedGoals = JSON.parse(localStorage.getItem(goalsKey) || '[]');
// Render grid
let html = '';
for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < cols; j++) {
        const id = `c${i}-${j}`;
        html += `<td><input type='checkbox' id='${id}'${saved[id] ? ' checked' : ''}></td>`;
    }
    html += '</tr>';
}
document.getElementById('checkbox-grid').innerHTML = html;
// --- Goals logic ---
const goalsList = document.getElementById('goals-list');
const addGoalBtn = document.getElementById('add-goal');
const saveEditBtn = document.getElementById('save-edit-goals');
let isEditing = true;
function renderGoals(goals, readOnly) {
    goalsList.innerHTML = '';
    goals.forEach((goal, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'goal-input';
        input.value = goal;
        input.readOnly = readOnly;
        input.style.marginBottom = '4px';
        input.setAttribute('data-idx', idx);
        // Conditional styling for readOnly mode
        if (readOnly) {
            input.style.background = '#232946';
            input.style.color = '#b8c1ec';
            input.style.border = 'none';
        }
        wrapper.appendChild(input);
        if (!readOnly) {
            input.style.color = 'black'
            input.style.background = '#fff';
            const delBtn = document.createElement('button');
            delBtn.textContent = 'X';
            delBtn.className = 'delete-goal-btn';
            delBtn.style.marginLeft = '8px';
            delBtn.onclick = function() {
                savedGoals.splice(idx, 1);
                renderGoals(savedGoals, false);
            };
            wrapper.appendChild(delBtn);
        } 
        goalsList.appendChild(wrapper);
    });
}
function saveGoals() {
    const goals = Array.from(document.querySelectorAll('.goal-input')).map(input => input.value);
    localStorage.setItem(goalsKey, JSON.stringify(goals));
    savedGoals = goals;
}
function setEditing(editing) {
    isEditing = editing;
    renderGoals(savedGoals, !editing);
    addGoalBtn.style.display = editing ? '' : 'none';
    saveEditBtn.textContent = editing ? 'Save Goals' : 'Edit Goals';
}
// Initial render
if (!Array.isArray(savedGoals) || savedGoals.length === 0) savedGoals = ['', '', ''];
setEditing(false);
// Add goal
addGoalBtn.onclick = function() {
    // Save current input values before adding a new one
    savedGoals = Array.from(document.querySelectorAll('.goal-input')).map(input => input.value);
    savedGoals.push('');
    renderGoals(savedGoals, false);
};
// Save/Edit toggle
document.getElementById('goals-form').onsubmit = function(e) {
    e.preventDefault();
    if (isEditing) {
        saveGoals();
        setEditing(false);
    } else {
        setEditing(true);
    }
};
// Save grid state
document.querySelectorAll('#checkbox-grid input').forEach(cb => {
    cb.addEventListener('change', () => {
        saved[cb.id] = cb.checked;
        localStorage.setItem(key, JSON.stringify(saved));
    });
});