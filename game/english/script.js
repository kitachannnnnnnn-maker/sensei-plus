// 英単語問題データ
const englishQuestions = {
    easy: [
        { word: 'apple', correct: 'りんご', choices: ['りんご', 'みかん', 'いちご', 'ぶどう'] },
        { word: 'book', correct: '本', choices: ['本', 'ノート', 'ペン', 'けしゴム'] },
        { word: 'cat', correct: 'ねこ', choices: ['ねこ', 'いぬ', 'とり', 'さかな'] },
        { word: 'dog', correct: 'いぬ', choices: ['いぬ', 'ねこ', 'トラ', 'ライオン'] },
        { word: 'eye', correct: '目', choices: ['目', '鼻', '耳', '口'] },
        { word: 'fish', correct: '魚', choices: ['魚', '鳥', 'ねこ', 'いぬ'] },
        { word: 'hand', correct: '手', choices: ['手', '足', '頭', '体'] },
        { word: 'ice', correct: '氷', choices: ['氷', 'みず', 'ゆき', '塩'] },
        { word: 'jump', correct: 'とぶ', choices: ['とぶ', '走る', '歩く', '寝る'] },
        { word: 'king', correct: 'おう', choices: ['おう', '王妃', '王子', 'お姫さま'] },
        { word: 'leaf', correct: '葉', choices: ['葉', '花', '根', '幹'] },
        { word: 'moon', correct: '月', choices: ['月', '太陽', '星', '惑星'] },
        { word: 'nose', correct: '鼻', choices: ['鼻', '耳', '目', '口'] },
        { word: 'orange', correct: 'オレンジ', choices: ['オレンジ', 'レモン', 'いちご', 'みかん'] },
        { word: 'pig', correct: 'ぶた', choices: ['ぶた', 'うし', 'ひつじ', 'ヤギ'] }
    ],
    normal: [
        { word: 'beautiful', correct: '美しい', choices: ['美しい', '醜い', 'つまらない', '汚い'] },
        { word: 'computer', correct: 'パソコン', choices: ['パソコン', 'テレビ', '電話', 'ラジオ'] },
        { word: 'dictionary', correct: '辞書', choices: ['辞書', '教科書', 'ノート', '雑誌'] },
        { word: 'education', correct: '教育', choices: ['教育', '学問', '勉強', 'テスト'] },
        { word: 'family', correct: '家族', choices: ['家族', '両親', '兄弟', '親戚'] },
        { word: 'geography', correct: '地理', choices: ['地理', '歴史', '社会', '世界'] },
        { word: 'hospital', correct: '病院', choices: ['病院', 'クリニック', '薬局', '医者'] },
        { word: 'important', correct: '重要な', choices: ['重要な', '大事な', 'つまらない', 'くだらない'] },
        { word: 'jewelry', correct: '宝石', choices: ['宝石', 'アクセサリー', '金', 'お金'] },
        { word: 'kitchen', correct: '台所', choices: ['台所', 'リビング', '寝室', 'トイレ'] },
        { word: 'language', correct: '言語', choices: ['言語', '言葉', '文字', '文法'] },
        { word: 'music', correct: '音楽', choices: ['音楽', 'うた', 'メロディー', 'リズム'] },
        { word: 'newspaper', correct: '新聞', choices: ['新聞', '雑誌', 'テレビ', 'インターネット'] },
        { word: 'ocean', correct: '海', choices: ['海', '川', 'みず', '湖'] },
        { word: 'patience', correct: '忍耐', choices: ['忍耐', '我慢', 'しんぼう', '根気'] }
    ],
    hard: [
        { word: 'abstract', correct: '抽象的な', choices: ['抽象的な', '具体的な', '曖昧な', '不明確な'] },
        { word: 'abolish', correct: '廃止する', choices: ['廃止する', '確立する', '設立する', '変更する'] },
        { word: 'ambiguous', correct: 'あいまいな', choices: ['あいまいな', '明確な', 'はっきりした', 'ぼんやりした'] },
        { word: 'catastrophe', correct: '大惨事', choices: ['大惨事', '事故', 'いざこざ', '問題'] },
        { word: 'diligent', correct: '勤勉な', choices: ['勤勉な', '怠け者の', 'さぼり好きな', '不精な'] },
        { word: 'eloquent', correct: '雄弁な', choices: ['雄弁な', '寡黙な', 'しゃべくり', 'うるさい'] },
        { word: 'flourish', correct: '栄える', choices: ['栄える', '衰える', '減る', 'しおれる'] },
        { word: 'garrison', correct: '駐屯地', choices: ['駐屯地', '要塞', '砦', '城'] },
        { word: 'humane', correct: '人道的な', choices: ['人道的な', '冷酷な', '残酷な', '無情な'] },
        { word: 'integrity', correct: '誠実さ', choices: ['誠実さ', 'うそつき', 'いかさま', 'ペテン'] }
    ]
};

let gameState = {
    difficulty: 'normal',
    playerName: '',
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    correctCount: 0,
    startTime: 0,
    currentQuestions: []
};

function init() {
    showScreen('title');
    updateRankingDisplay();
}

function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    showScreen('config');
}

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

    const availableQuestions = englishQuestions[gameState.difficulty];
    gameState.currentQuestions = [];
    const indices = [];
    while (gameState.currentQuestions.length < questionCount && gameState.currentQuestions.length < availableQuestions.length) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * availableQuestions.length);
        } while (indices.includes(randomIndex));
        indices.push(randomIndex);
        gameState.currentQuestions.push(availableQuestions[randomIndex]);
    }

    gameState.startTime = Date.now();
    showScreen('game');
    showNextQuestion();
}

function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.currentQuestions.length) {
        endGame();
        return;
    }

    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;

    const question = gameState.currentQuestions[gameState.currentQuestion];
    document.getElementById('question-text').textContent = question.word;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    const choices = question.choices.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) {
        const btn = document.querySelectorAll('.choice-btn')[i];
        btn.textContent = choices[i];
        btn.onclick = () => selectAnswer(choices[i], question.correct, btn);
        btn.className = 'choice-btn';
        btn.disabled = false;
    }
}

function selectAnswer(selectedText, correctText, btn) {
    const allBtns = document.querySelectorAll('.choice-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedText === correctText;

    if (isCorrect) {
        btn.classList.add('correct');
        document.getElementById('feedback').textContent = '✓ 正解！';
        document.getElementById('feedback').className = 'feedback correct';
        gameState.score += 10;
        gameState.correctCount++;
    } else {
        btn.classList.add('incorrect');
        document.getElementById('feedback').textContent = `✗ 不正解。答え：${correctText}`;
        document.getElementById('feedback').className = 'feedback incorrect';
    }

    document.getElementById('game-score').textContent = gameState.score;

    setTimeout(() => {
        gameState.currentQuestion++;
        showNextQuestion();
    }, 1500);
}

function endGame() {
    const accuracy = Math.round((gameState.correctCount / gameState.totalQuestions) * 100);

    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('correct-count').textContent = gameState.correctCount;
    document.getElementById('accuracy').textContent = accuracy;

    let message = '';
    if (accuracy >= 90) {
        message = '🌟 素晴らしい！英語マスターです！';
    } else if (accuracy >= 70) {
        message = '👍 よくできました！もう少し頑張れば完璧です！';
    } else if (accuracy >= 50) {
        message = '📚 もう少し練習が必要です。毎日の学習が大切です！';
    } else {
        message = '💪 基本から復習してみましょう。頑張ってください！';
    }
    document.getElementById('result-message').textContent = message;

    saveScore({
        name: gameState.playerName,
        score: gameState.score,
        correctCount: gameState.correctCount,
        accuracy: accuracy,
        difficulty: gameState.difficulty,
        date: new Date().toLocaleDateString('ja-JP')
    });

    showScreen('result');
}

function saveScore(scoreData) {
    let rankings = JSON.parse(localStorage.getItem('englishGameRanking') || '[]');
    rankings.push(scoreData);
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 20);
    localStorage.setItem('englishGameRanking', JSON.stringify(rankings));
    updateRankingDisplay();
}

function updateRankingDisplay() {
    const rankings = JSON.parse(localStorage.getItem('englishGameRanking') || '[]');
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

function shareResult() {
    const accuracy = Math.round((gameState.correctCount / gameState.totalQuestions) * 100);
    const text = `英単語ゲームで${gameState.score}点を獲得しました！正解率は${accuracy}%です。🌍`;
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenName).classList.add('active');
}

function backToTitle() {
    document.getElementById('player-name').value = '';
    showScreen('title');
}

init();
