// 漢字問題データ
const kanjiQuestions = {
    reading: [
        {
            kanji: '木',
            correct: 'き',
            choices: ['き', 'もく', 'きで', 'もくぎ']
        },
        {
            kanji: '火',
            correct: 'ひ',
            choices: ['ひ', 'か', 'ほ', 'ふ']
        },
        {
            kanji: '山',
            correct: 'やま',
            choices: ['やま', 'せん', 'さん', 'やん']
        },
        {
            kanji: '水',
            correct: 'みず',
            choices: ['みず', 'すい', 'さっぷ', 'のれん']
        },
        {
            kanji: '日',
            correct: 'ひ',
            choices: ['ひ', 'び', 'じ', 'ち']
        },
        {
            kanji: '学',
            correct: 'がく',
            choices: ['がく', 'がっ', 'たなか', 'きぎ']
        },
        {
            kanji: '生',
            correct: 'い・きる',
            choices: ['い・きる', 'して', 'ねいる', 'まこと']
        },
        {
            kanji: '月',
            correct: 'つき',
            choices: ['つき', 'がつ', 'たき', 'れき']
        },
        {
            kanji: '人',
            correct: 'ひと',
            choices: ['ひと', 'にん', 'じん', 'てん']
        },
        {
            kanji: '手',
            correct: 'て',
            choices: ['て', 'しゅ', 'し', 'ちゅ']
        },
        {
            kanji: '目',
            correct: 'め',
            choices: ['め', 'もく', 'ぼく', 'なみだ']
        },
        {
            kanji: '口',
            correct: 'くち',
            choices: ['くち', 'こう', 'ぐち', 'こ']
        },
        {
            kanji: '足',
            correct: 'あし',
            choices: ['あし', 'ぞく', 'たり', 'ます']
        },
        {
            kanji: '食',
            correct: 'たべる',
            choices: ['たべる', 'しょく', 'しょっ', 'かじ']
        },
        {
            kanji: '動',
            correct: 'うごく',
            choices: ['うごく', 'どう', 'まわる', 'ゆる']
        }
    ],
    meaning: [
        {
            kanji: '木',
            correct: 'き・がい・きのき',
            choices: ['き・がい・きのき', 'かたこと・つち', 'みず・つめたい', 'ひ・あつい']
        },
        {
            kanji: '火',
            correct: 'ひ・あつい・ほのお',
            choices: ['ひ・あつい・ほのお', 'みず・さむい', 'かぜ・そよ風', 'り・こおり']
        },
        {
            kanji: '山',
            correct: 'たかい・やまやあ',
            choices: ['たかい・やまやあ', 'ひくい・たに', 'ひろい・のっぱら', 'おおきい・しろ']
        },
        {
            kanji: '水',
            correct: 'みず・ながれる',
            choices: ['みず・ながれる', 'ひ・あつい', 'かぜ・ふく', 'ち・あかい']
        },
        {
            kanji: '学',
            correct: 'ならう・まなぶ・ちゅう',
            choices: ['ならう・まなぶ・ちゅう', 'おしえる・して', 'なんど・かん', 'むかし・とうむ']
        },
        {
            kanji: '生',
            correct: 'いきる・うむ・なま',
            choices: ['いきる・うむ・なま', 'しぬ・おわり', 'かう・ある', 'のむ・たべ']
        },
        {
            kanji: '月',
            correct: 'つき・ゆう・げつ',
            choices: ['つき・ゆう・げつ', 'ひ・あけ・ぎゃく', 'ほし・きら', 'そら・あお']
        },
        {
            kanji: '人',
            correct: 'ひと・にん・じん',
            choices: ['ひと・にん・じん', 'けもの・えんぶ', 'もの・かた', 'ようせい・しき']
        },
        {
            kanji: '手',
            correct: 'て・しゅ・たまご',
            choices: ['て・しゅ・たまご', 'あし・きゃく', 'あたま・ずけん', 'から・ぜんり']
        },
        {
            kanji: '目',
            correct: 'め・まなこ・もく',
            choices: ['め・まなこ・もく', 'くち・せき', 'はな・はなみち', 'あだ・あたい']
        },
        {
            kanji: '口',
            correct: 'くち・こう・ぐち',
            choices: ['くち・こう・ぐち', 'め・まなこ', 'はな・はなみち', 'した・べろ']
        },
        {
            kanji: '足',
            correct: 'あし・あしる・ぞく',
            choices: ['あし・あしる・ぞく', 'て・しゅ', 'あたま・ずけん', 'からだ・み']
        },
        {
            kanji: '食',
            correct: 'たべる・くう・しょく',
            choices: ['たべる・くう・しょく', 'のむ・いやす', 'もつ・がた', 'なす・する']
        },
        {
            kanji: '動',
            correct: 'うごく・どう・ゆく',
            choices: ['うごく・どう・ゆく', 'やすむ・とまる', 'ねむる・ねて', 'おきる・せめ']
        },
        {
            kanji: '車',
            correct: 'くるま・しゃ・ぐるま',
            choices: ['くるま・しゃ・ぐるま', 'けし・ひくい', 'ぶね・ふね', 'ひこきあるく']
        }
    ]
};

let gameState = {
    mode: 'reading',
    playerName: '',
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    correctCount: 0,
    startTime: 0,
    currentQuestions: []
};

// ゲーム初期化
function init() {
    showScreen('title');
    updateRankingDisplay();
}

// モード設定
function setMode(mode) {
    gameState.mode = mode;
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

    // 問題をシャッフルして選択
    const availableQuestions = kanjiQuestions[gameState.mode];
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

// 次の問題を表示
function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.currentQuestions.length) {
        endGame();
        return;
    }

    document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;

    const question = gameState.currentQuestions[gameState.currentQuestion];
    document.getElementById('question-text').textContent = question.kanji;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    // 選択肢をシャッフル
    const choices = question.choices.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) {
        const btn = document.querySelectorAll('.choice-btn')[i];
        btn.textContent = choices[i];
        btn.onclick = () => selectAnswer(choices[i], question.correct, btn);
        btn.className = 'choice-btn';
        btn.disabled = false;
    }
}

// 回答選択
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

    // 次の問題へ
    setTimeout(() => {
        gameState.currentQuestion++;
        showNextQuestion();
    }, 1500);
}

// ゲーム終了
function endGame() {
    const accuracy = Math.round((gameState.correctCount / gameState.totalQuestions) * 100);

    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('correct-count').textContent = gameState.correctCount;
    document.getElementById('accuracy').textContent = accuracy;

    // メッセージ生成
    let message = '';
    if (accuracy >= 90) {
        message = '🌟 素晴らしい！漢字博士です！';
    } else if (accuracy >= 70) {
        message = '👍 よくできました！もう少し頑張れば完璧です！';
    } else if (accuracy >= 50) {
        message = '📚 もう少し練習が必要です。毎日の学習が大切です！';
    } else {
        message = '💪 基本から復習してみましょう。頑張ってください！';
    }
    document.getElementById('result-message').textContent = message;

    // スコア保存
    saveScore({
        name: gameState.playerName,
        score: gameState.score,
        correctCount: gameState.correctCount,
        accuracy: accuracy,
        mode: gameState.mode,
        date: new Date().toLocaleDateString('ja-JP')
    });

    showScreen('result');
}

// スコア保存
function saveScore(scoreData) {
    let rankings = JSON.parse(localStorage.getItem('kanjiGameRanking') || '[]');
    rankings.push(scoreData);
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 20);
    localStorage.setItem('kanjiGameRanking', JSON.stringify(rankings));
    updateRankingDisplay();
}

// ランキング表示更新
function updateRankingDisplay() {
    const rankings = JSON.parse(localStorage.getItem('kanjiGameRanking') || '[]');
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
    const accuracy = Math.round((gameState.correctCount / gameState.totalQuestions) * 100);
    const text = `漢字学習ゲームで${gameState.score}点を獲得しました！正解率は${accuracy}%です。🈯`;
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

// 初期化
init();
