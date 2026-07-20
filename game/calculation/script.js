// ===== ゲーム状態管理 =====
let gameState = {
    difficulty: 'normal',
    playerName: '',
    questionCount: 10,
    timeLimit: 20,
    currentQuestion: 0,
    score: 0,
    correctCount: 0,
    questions: [],
    startTime: 0,
    timeRemaining: 0,
    gameActive: false,
    timerInterval: null,
    currentAnswer: null
};

// ===== 問題生成エンジン =====
function generateQuestion() {
    let num1, num2, operator, result;

    if (gameState.difficulty === 'easy') {
        // かんたん：1～9の足し算のみ
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        operator = '+';
        result = num1 + num2;
    } else if (gameState.difficulty === 'normal') {
        // ふつう：1～99の四則演算
        num1 = Math.floor(Math.random() * 99) + 1;
        num2 = Math.floor(Math.random() * 99) + 1;
        const operators = ['+', '-', '×', '÷'];
        operator = operators[Math.floor(Math.random() * operators.length)];

        if (operator === '+') {
            result = num1 + num2;
        } else if (operator === '-') {
            result = num1 - num2;
        } else if (operator === '×') {
            result = num1 * num2;
        } else { // ÷
            // 割り切れるように調整
            result = Math.floor(Math.random() * 10) + 1;
            num1 = result * num2;
        }
    } else {
        // むずかしい：1～999の四則演算
        num1 = Math.floor(Math.random() * 999) + 1;
        num2 = Math.floor(Math.random() * 999) + 1;
        const operators = ['+', '-', '×'];
        operator = operators[Math.floor(Math.random() * operators.length)];

        if (operator === '+') {
            result = num1 + num2;
        } else if (operator === '-') {
            result = num1 - num2;
        } else {
            result = num1 * num2;
        }
    }

    return {
        num1: num1,
        num2: num2,
        operator: operator,
        answer: result,
        question: `${num1} ${operator} ${num2} = ?`
    };
}

// ===== 画面遷移 =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function backToTitle() {
    gameState = {
        difficulty: 'normal',
        playerName: '',
        questionCount: 10,
        timeLimit: 20,
        currentQuestion: 0,
        score: 0,
        correctCount: 0,
        questions: [],
        startTime: 0,
        timeRemaining: 0,
        gameActive: false,
        timerInterval: null,
        currentAnswer: null
    };
    updateRankingDisplay();
    showScreen('title-screen');
}

// ===== 難易度選択 =====
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        gameState.difficulty = this.dataset.difficulty;
        showScreen('config-screen');
    });
});

// ===== ゲーム開始 =====
function startGame() {
    const playerName = document.getElementById('player-name').value.trim() || 'アノニマス';
    const questionCount = parseInt(document.getElementById('question-count').value);
    const timeLimit = parseInt(document.getElementById('time-limit').value);

    gameState.playerName = playerName;
    gameState.questionCount = questionCount;
    gameState.timeLimit = timeLimit;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.correctCount = 0;
    gameState.questions = [];
    gameState.gameActive = true;

    // 問題を事前生成
    for (let i = 0; i < questionCount; i++) {
        gameState.questions.push(generateQuestion());
    }

    gameState.startTime = Date.now();
    gameState.timeRemaining = timeLimit;

    showScreen('game-screen');
    showNextQuestion();
    startTimer();
}

// ===== 次の問題表示 =====
function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
        return;
    }

    const question = gameState.questions[gameState.currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('question-number').textContent = `${gameState.currentQuestion + 1}/${gameState.questionCount}`;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').className = 'answer-input';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('answer-input').focus();

    gameState.timeRemaining = gameState.timeLimit;
}

// ===== 回答送信 =====
function submitAnswer() {
    if (!gameState.gameActive) return;

    const answerInput = document.getElementById('answer-input');
    const userAnswer = parseInt(answerInput.value);
    const question = gameState.questions[gameState.currentQuestion];
    const correctAnswer = question.answer;

    if (isNaN(userAnswer)) {
        document.getElementById('feedback').textContent = '数字を入力してください';
        document.getElementById('feedback').className = 'feedback';
        return;
    }

    // 回答判定
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
        gameState.correctCount++;
        gameState.score += calculatePoints(gameState.timeRemaining);
        answerInput.className = 'answer-input correct';
        document.getElementById('feedback').textContent = '✓ 正解！';
        document.getElementById('feedback').className = 'feedback correct';
    } else {
        answerInput.className = 'answer-input incorrect';
        document.getElementById('feedback').textContent = `✗ 不正解。答えは ${correctAnswer} です`;
        document.getElementById('feedback').className = 'feedback incorrect';
    }

    document.getElementById('score-display').textContent = gameState.score;
    document.getElementById('submit-btn').disabled = true;

    // 1.5秒後に次の問題へ
    setTimeout(() => {
        gameState.currentQuestion++;
        showNextQuestion();
    }, 1500);
}

// ===== ポイント計算 =====
function calculatePoints(timeRemaining) {
    // 残り時間が多いほどボーナス
    const basePoints = 10;
    const timeBonus = Math.max(0, timeRemaining) * 5;
    return basePoints + timeBonus;
}

// ===== タイマー =====
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;

        const timeDisplay = document.getElementById('time-display');
        timeDisplay.textContent = gameState.timeRemaining;

        // 時間が少なくなったら色変更
        if (gameState.timeRemaining <= 5) {
            timeDisplay.classList.add('danger');
        } else if (gameState.timeRemaining <= 10) {
            timeDisplay.classList.add('warning');
        }

        // 時間切れ
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);

            // 自動で次の問題へ（または終了）
            document.getElementById('submit-btn').disabled = true;
            gameState.currentQuestion++;

            setTimeout(() => {
                gameState.timeRemaining = gameState.timeLimit;
                if (gameState.currentQuestion >= gameState.questions.length) {
                    endGame();
                } else {
                    showNextQuestion();
                    startTimer();
                }
            }, 1000);
        }
    }, 1000);
}

// ===== ゲーム終了 =====
function endGame() {
    clearInterval(gameState.timerInterval);
    gameState.gameActive = false;

    const correctCount = gameState.correctCount;
    const totalQuestions = gameState.questionCount;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // スコアをランキングに追加
    saveScore(gameState.playerName, gameState.score, correctCount, accuracy, gameState.difficulty);

    // 結果表示
    document.getElementById('result-correct').textContent = `${correctCount}/${totalQuestions}`;
    document.getElementById('result-score').textContent = `${gameState.score}点`;
    document.getElementById('result-accuracy').textContent = `${accuracy}%`;

    // メッセージ
    const message = getResultMessage(accuracy);
    document.getElementById('result-message').textContent = message;

    showScreen('result-screen');
}

// ===== リザルトメッセージ =====
function getResultMessage(accuracy) {
    if (accuracy === 100) {
        return '🌟 すばらしい！全問正解です！';
    } else if (accuracy >= 90) {
        return '🎉 えらい！ほとんど正解しました！';
    } else if (accuracy >= 70) {
        return '😊 よくできました！';
    } else if (accuracy >= 50) {
        return '👍 もう少しです。もう1回挑戦してみて！';
    } else {
        return '💪 まだまだこれから。頑張ろう！';
    }
}

// ===== スコア保存 =====
function saveScore(playerName, score, correctCount, accuracy, difficulty) {
    let ranking = JSON.parse(localStorage.getItem('calculationGameRanking') || '[]');

    ranking.push({
        name: playerName,
        score: score,
        correctCount: correctCount,
        accuracy: accuracy,
        difficulty: difficulty,
        date: new Date().toLocaleString('ja-JP')
    });

    // スコアの高い順にソート
    ranking.sort((a, b) => b.score - a.score);

    // 上位20件のみ保存
    ranking = ranking.slice(0, 20);

    localStorage.setItem('calculationGameRanking', JSON.stringify(ranking));
}

// ===== ランキング表示 =====
function updateRankingDisplay() {
    const ranking = JSON.parse(localStorage.getItem('calculationGameRanking') || '[]');
    const rankingList = document.getElementById('ranking-list');

    if (ranking.length === 0) {
        rankingList.innerHTML = '<p class="no-data">まだスコアがありません</p>';
        return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    rankingList.innerHTML = ranking.slice(0, 10).map((item, index) => {
        const medal = medals[index] || '  ';
        return `
            <div class="ranking-item">
                <span class="ranking-medal">${medal}</span>
                <div class="ranking-info">
                    <div class="ranking-name">${escapeHtml(item.name)}</div>
                    <div class="ranking-score">${item.correctCount}問正解 / ${item.accuracy}%</div>
                </div>
                <div class="ranking-value">${item.score}点</div>
            </div>
        `;
    }).join('');
}

// ===== XSS対策 =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== ゲーム中止 =====
function quitGame() {
    if (confirm('ゲームを中止してもいいですか？')) {
        clearInterval(gameState.timerInterval);
        backToTitle();
    }
}

// ===== シェア機能 =====
function shareSNS() {
    const correctCount = document.getElementById('result-correct').textContent;
    const score = document.getElementById('result-score').textContent;
    const text = `計算ゲームで${score}を獲得しました！${correctCount}正解しました！センセイplusで遊んでね！`;

    if (navigator.share) {
        navigator.share({
            title: '計算ゲーム',
            text: text
        }).catch(err => console.log('シェアがキャンセルされました'));
    } else {
        // フォールバック
        alert(text + '\n\nこのテキストをコピーしてシェアしてください');
    }
}

// ===== Enterキーで送信 =====
document.addEventListener('DOMContentLoaded', () => {
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('submit-btn').disabled) {
                submitAnswer();
            }
        });
    }

    updateRankingDisplay();
});
