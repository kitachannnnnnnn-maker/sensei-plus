// タイピングゲームのテキストデータ
const typingTexts = {
    easy: [
        "あいうえお",
        "かきくけこ",
        "あさひがでた",
        "みずは つめたい",
        "きょうは いい てんきです",
        "ねこが あります",
        "すうじを よむ",
        "ぶんしょうを タイプする",
        "さくら が きれい",
        "えんぴつ と けしゴム"
    ],
    normal: [
        "毎日、学校に行きます。",
        "昨日は天気が良かったです。",
        "友達と一緒に公園で遊びました。",
        "勉強は大切なことです。",
        "先生は丁寧に説明しました。",
        "図書館で本を読みます。",
        "朝日が東の山から昇ります。",
        "私たちは力を合わせて頑張ります。",
        "桜の花が満開になりました。",
        "毎週、家族で食事をします。"
    ],
    hard: [
        "言葉の力は非常に重要であり、私たちの日常生活に深い影響を与えています。",
        "教育は子どもたちの将来を形作る基盤となるため、最大限の努力が必要です。",
        "情報社会において、正確な情報を見分ける能力はますます重要になっています。",
        "持続可能な社会の実現のために、私たちが取るべき行動は多くあります。",
        "文化的多様性を尊重し、異なる背景を持つ人々と理解し合うことが大切です。",
        "科学技術の進歩は私たちの生活を豊かにしていますが、同時に新たな課題も生み出しています。",
        "読書は知識を深めるだけでなく、想像力や思考力を養う重要な習慣です。",
        "環境問題に対する関心を高め、個人的な取り組みから社会全体への変化をもたらすことが必要です。"
    ]
};

let gameState = {
    difficulty: 'normal',
    playerName: '',
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    correctCount: 0,
    totalTyped: 0,
    totalAccuracy: 0,
    startTime: 0,
    currentTexts: []
};

// ゲーム初期化
function init() {
    showScreen('title');
    updateRankingDisplay();
}

// 難度設定
function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    showScreen('config');
}

// ゲーム開始
function startGame() {
    const playerName = document.getElementById('player-name').value || 'プレイヤー';
    const questionCount = parseInt(document.getElementById('question-count').value);

    if (!playerName.trim()) {
        alert('プレイヤー名を入力してください');
        return;
    }

    gameState.playerName = playerName;
    gameState.totalQuestions = questionCount;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.correctCount = 0;
    gameState.totalTyped = 0;
    gameState.totalAccuracy = 0;

    // 問題をシャッフルして選択
    const availableTexts = typingTexts[gameState.difficulty];
    gameState.currentTexts = [];
    while (gameState.currentTexts.length < questionCount && gameState.currentTexts.length < availableTexts.length) {
        const randomText = availableTexts[Math.floor(Math.random() * availableTexts.length)];
        if (!gameState.currentTexts.includes(randomText)) {
            gameState.currentTexts.push(randomText);
        }
    }

    gameState.startTime = Date.now();
    showScreen('game');
    showNextQuestion();
}

// 次の問題を表示
function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.currentTexts.length) {
        endGame();
        return;
    }

    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;

    const targetText = gameState.currentTexts[gameState.currentQuestion];
    document.getElementById('target-text').textContent = targetText;
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').focus();
    document.getElementById('typing-input').classList.remove('error');
    document.getElementById('progress-bar').style.width = '0%';

    // 入力イベントリスナー設定
    document.getElementById('typing-input').oninput = checkTyping;
}

// タイピング入力をチェック
function checkTyping() {
    const input = document.getElementById('typing-input');
    const targetText = gameState.currentTexts[gameState.currentQuestion];
    const inputValue = input.value;
    const progress = (inputValue.length / targetText.length) * 100;

    document.getElementById('progress-bar').style.width = Math.min(progress, 100) + '%';

    if (inputValue === targetText) {
        // 正解
        const timeTaken = (Date.now() - gameState.questionStartTime) / 1000;
        const accuracy = 100;
        const points = Math.max(10, Math.round(20 - timeTaken));

        gameState.score += points;
        gameState.correctCount++;
        gameState.totalTyped += targetText.length;
        gameState.totalAccuracy += accuracy;

        document.getElementById('game-score').textContent = gameState.score;
        document.getElementById('accuracy').textContent = Math.round(gameState.totalAccuracy / (gameState.currentQuestion + 1));

        // 次の問題へ
        setTimeout(() => {
            gameState.currentQuestion++;
            showNextQuestion();
        }, 500);
    } else if (inputValue.length > 0 && targetText.substring(0, inputValue.length) !== inputValue) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// ゲーム終了
function endGame() {
    const totalTime = (Date.now() - gameState.startTime) / 1000;
    const avgWPM = Math.round((gameState.totalTyped / 5) / (totalTime / 60));

    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-accuracy').textContent = Math.round(gameState.totalAccuracy / gameState.currentQuestion);
    document.getElementById('final-wpm').textContent = avgWPM;
    document.getElementById('correct-count').textContent = gameState.correctCount;

    // メッセージ生成
    const accuracy = Math.round(gameState.totalAccuracy / gameState.currentQuestion);
    let message = '';
    if (accuracy >= 95) {
        message = '🌟 素晴らしい！完璧なタイピングです！';
    } else if (accuracy >= 85) {
        message = '👍 よくできました！正確性が高いです！';
    } else if (accuracy >= 70) {
        message = '📝 もう少し練習して精度を上げましょう';
    } else {
        message = '💪 頑張りましょう！毎日の練習が大切です';
    }
    document.getElementById('result-message').textContent = message;

    // スコア保存
    saveScore({
        name: gameState.playerName,
        score: gameState.score,
        correctCount: gameState.correctCount,
        accuracy: Math.round(gameState.totalAccuracy / gameState.currentQuestion),
        difficulty: gameState.difficulty,
        wpm: avgWPM,
        date: new Date().toLocaleDateString('ja-JP')
    });

    showScreen('result');
}

// スコア保存
function saveScore(scoreData) {
    let rankings = JSON.parse(localStorage.getItem('typingGameRanking') || '[]');
    rankings.push(scoreData);
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 20);
    localStorage.setItem('typingGameRanking', JSON.stringify(rankings));
    updateRankingDisplay();
}

// ランキング表示更新
function updateRankingDisplay() {
    const rankings = JSON.parse(localStorage.getItem('typingGameRanking') || '[]');
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    rankings.slice(0, 10).forEach((score, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'ranking-item';
        rankItem.innerHTML = `
            <span class="ranking-rank">${index + 1}位</span>
            <span class="ranking-name">${score.name}</span>
            <span class="ranking-score">${score.score}点</span>
        `;
        rankingList.appendChild(rankItem);
    });

    if (rankings.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: #999;">まだランキングがありません</div>';
    }
}

// SNSシェア
function shareResult() {
    const accuracy = Math.round(gameState.totalAccuracy / gameState.currentQuestion);
    const text = `タイピングゲームで${gameState.score}点を獲得しました！精度は${accuracy}%です。🎮`;
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

// 画面表示切り替え
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenName).classList.add('active');
}

// タイトルに戻る
function backToTitle() {
    document.getElementById('player-name').value = '';
    showScreen('title');
}

// ゲーム開始時刻を記録
function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.currentTexts.length) {
        endGame();
        return;
    }

    gameState.questionStartTime = Date.now();
    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;

    const targetText = gameState.currentTexts[gameState.currentQuestion];
    document.getElementById('target-text').textContent = targetText;
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-input').focus();
    document.getElementById('typing-input').classList.remove('error');
    document.getElementById('progress-bar').style.width = '0%';

    document.getElementById('typing-input').oninput = checkTyping;
}

// 初期化
init();
