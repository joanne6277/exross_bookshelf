function initReadingGoal() {
    const settingBtn = document.getElementById('reading-goal-setting-btn');
    const cancelBtn = document.getElementById('cancel-reading-goal');
    const saveBtn = document.getElementById('save-reading-goal');
    const displayDiv = document.getElementById('reading-goal-display');
    const settingDiv = document.getElementById('reading-goal-setting');
    const goalInput = document.getElementById('reading-goal-input');

    const currentReadingTimeEl = document.getElementById('current-reading-time');
    const totalReadingGoalEl = document.getElementById('total-reading-goal');
    const progressBar = document.getElementById('reading-progress-bar');
    const progressText = document.getElementById('reading-progress-text');

    settingBtn.addEventListener('click', () => {
        displayDiv.classList.add('hidden');
        settingDiv.classList.remove('hidden');
        goalInput.value = totalReadingGoalEl.textContent;
    });

    cancelBtn.addEventListener('click', () => {
        displayDiv.classList.remove('hidden');
        settingDiv.classList.add('hidden');
    });

    saveBtn.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value, 10);
        if (!isNaN(newGoal) && newGoal > 0) {
            totalReadingGoalEl.textContent = newGoal;
            updateProgress();
        }
        displayDiv.classList.remove('hidden');
        settingDiv.classList.add('hidden');
    });

    function updateProgress() {
        const currentTime = parseInt(currentReadingTimeEl.textContent, 10);
        const totalGoal = parseInt(totalReadingGoalEl.textContent, 10);
        const percentage = Math.min(Math.round((currentTime / totalGoal) * 100), 100);
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `已達成 ${percentage}%`;
    }
}

export { initReadingGoal };
