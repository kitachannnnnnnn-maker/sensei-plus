let timerState = {
    isRunning: false,
    isPaused: false,
    totalSeconds: 0,
    remainingSeconds: 0,
    currentActivity: '',
    activities: []
};

let timerInterval = null;

function startTimer() {
    const activityName = document.getElementById('activity-name-input').value || 'アクティビティ';
    const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
    const seconds = parseInt(document.getElementById('seconds-input').value) || 0;

    if (minutes === 0 && seconds === 0) {
        alert('時間を設定してください');
        return;
    }

    timerState.totalSeconds = minutes * 60 + seconds;
    timerState.remainingSeconds = timerState.totalSeconds;
    timerState.currentActivity = activityName;
    timerState.isRunning = true;
    timerState.isPaused = false;

    document.getElementById('activity-name').textContent = activityName;

    // 入力フィールドを無効化
    document.getElementById('activity-name-input').disabled = true;
    document.getElementById('minutes-input').disabled = true;
    document.getElementById('seconds-input').disabled = true;

    runTimer();
}

function runTimer() {
    timerInterval = setInterval(() => {
        if (timerState.remainingSeconds > 0) {
            timerState.remainingSeconds--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerState.isRunning = false;
            completeActivity();
        }
    }, 1000);
}

function pauseTimer() {
    if (timerState.isRunning) {
        clearInterval(timerInterval);
        timerState.isRunning = false;
        timerState.isPaused = true;
    }
}

function resumeTimer() {
    if (timerState.isPaused && timerState.remainingSeconds > 0) {
        timerState.isRunning = true;
        timerState.isPaused = false;
        runTimer();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.remainingSeconds = 0;

    document.getElementById('time-display').textContent = '00:00';
    document.getElementById('activity-name').textContent = 'アクティビティなし';

    // 入力フィールドを有効化
    document.getElementById('activity-name-input').disabled = false;
    document.getElementById('minutes-input').disabled = false;
    document.getElementById('seconds-input').disabled = false;
}

function setTimer(minutes, seconds) {
    document.getElementById('minutes-input').value = minutes;
    document.getElementById('seconds-input').value = seconds;
}

function updateDisplay() {
    const minutes = Math.floor(timerState.remainingSeconds / 60);
    const seconds = timerState.remainingSeconds % 60;
    document.getElementById('time-display').textContent =
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    // 時間が少なくなったら警告色に
    if (timerState.remainingSeconds <= 10) {
        document.querySelector('.timer-display').style.background =
            'linear-gradient(135deg, #ef4444, #fca5a5)';
    } else if (timerState.remainingSeconds <= 30) {
        document.querySelector('.timer-display').style.background =
            'linear-gradient(135deg, #f59e0b, #fcd34d)';
    }
}

function completeActivity() {
    // 完了音を鳴らす（複数回）
    playSound();

    // アクティビティをログに追加
    const startTime = new Date();
    startTime.setSeconds(startTime.getSeconds() - timerState.totalSeconds);

    timerState.activities.push({
        name: timerState.currentActivity,
        duration: timerState.totalSeconds,
        completedAt: new Date().toLocaleTimeString('ja-JP')
    });

    updateActivityLog();

    // リセット
    resetTimer();
    alert(`✓ "${timerState.currentActivity}" の時間が終了しました！`);
}

function playSound() {
    // Web Audio API を使用して音を生成
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function updateActivityLog() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    timerState.activities.reverse().forEach((activity, index) => {
        const minutes = Math.floor(activity.duration / 60);
        const seconds = activity.duration % 60;
        const durationStr = `${minutes}分${seconds}秒`;

        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-item-name">${activity.name}</div>
            <div class="activity-item-time">${durationStr} - ${activity.completedAt}</div>
        `;
        activityList.appendChild(item);
    });
}
