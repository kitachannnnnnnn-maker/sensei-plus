// しりとり用単語データベース
const shiritori = {
    あ: ['あり', 'あいこくしん', 'あさ', 'あたたか', 'あたまいたい'],
    い: ['いぬ', 'いえ', 'いろ', 'いぶき', 'いちご'],
    う: ['うどん', 'うみ', 'うし', 'うどんや', 'うれしい'],
    え: ['えき', 'えんぴつ', 'えほん', 'えのぐ', 'えり'],
    お: ['おかし', 'おに', 'おくさん', 'おもちゃ', 'おうさま'],
    か: ['かき', 'かえる', 'かさ', 'かなしい', 'かたつむり'],
    き: ['きつね', 'きのこ', 'きいろ', 'きって', 'きーぼーど'],
    く: ['くま', 'くじら', 'くつ', 'くだもの', 'くさい'],
    け: ['けいさん', 'けこみ', 'けむり', 'けがわ', 'けんどう'],
    こ: ['こあら', 'こひつじ', 'こんやく', 'こびと', 'こんにちは'],
    さ: ['さけ', 'さくら', 'さぬき', 'さをし', 'さんぽ'],
    し: ['しかた', 'しお', 'しゅっぱつ', 'しあわせ', 'しりとり'],
    す: ['すいか', 'すうがく', 'すもう', 'すっぱい', 'すこし'],
    せ: ['せんせい', 'せみ', 'せんぷうき', 'せかい', 'せんたく'],
    そ: ['そよかぜ', 'そらまめ', 'そろばん', 'そで', 'そば'],
    た: ['たこ', 'たぬき', 'ただし', 'たべもの', 'たこやき'],
    ち: ['ちいさい', 'ちゅうがっこう', 'ちてき', 'ちょうちょう', 'ちすじ'],
    つ: ['つき', 'つる', 'つくえ', 'つめ', 'つゆ'],
    て: ['てんき', 'てぬぐい', 'てづくり', 'ててした', 'てくび'],
    と: ['とり', 'とかげ', 'ときめく', 'ともだち', 'とうもろこし'],
    な: ['なす', 'なまけもの', 'なまこ', 'なつみかん', 'なべやき'],
    に: ['にほんご', 'にんじん', 'にわとり', 'にじ', 'におい'],
    ぬ: ['ぬりえ', 'ぬいぐるみ', 'ぬか', 'ぬのじ', 'ぬかみそ'],
    ね: ['ねこ', 'ねずみ', 'ねじ', 'ねっこ', 'ねはん'],
    の: ['のうりょく', 'のこぎり', 'ののしり', 'のんびり', 'のぞき'],
    は: ['はい', 'はな', 'はし', 'はじめ', 'はなび'],
    ひ: ['ひいろ', 'ひこうき', 'ひかり', 'ひこうきぐも', 'ひらがな'],
    ふ: ['ふね', 'ふくろう', 'ふさ', 'ふきのとう', 'ふぐ'],
    へ: ['へび', 'へや', 'へちま', 'へりのしるし', 'へい'],
    ほ: ['ほし', 'ほんだな', 'ほたる', 'ほうほう', 'ほどよい'],
    ま: ['まくら', 'ままごと', 'まがい', 'まめ', 'ますく'],
    み: ['みかん', 'みかん', 'みずすまし', 'みにくい', 'みるく'],
    む: ['むかし', 'むし', 'むらさき', 'むえん', 'むねたり'],
    め: ['めだか', 'めくら', 'めろん', 'めうし', 'めだ'],
    も: ['もみじ', 'もち', 'もぐら', 'ものさし', 'もくせい'],
    や: ['やま', 'やぎ', 'やさい', 'やまあらし', 'やきとり'],
    ゆ: ['ゆめ', 'ゆうれい', 'ゆうがお', 'ゆめみがち', 'ゆきだるま'],
    よ: ['よこ', 'よっぱらい', 'よこくせつ', 'よなおし', 'よろいむし'],
    ら: ['らいおん', 'らっぱ', 'ラッパ', 'らくご', 'らんぷ'],
    り: ['りんご', 'りょうり', 'りす', 'りんりん', 'りゅうがく'],
    る: ['るくしゅくじゃう', 'ルビー', 'ルール', 'るくずえん'],
    れ: ['れいぞうこ', 'れきし', 'れんがわ', 'れんり', 'れい'],
    ろ: ['ろぼっと', 'ろびん', 'ろ', 'ろうそく', 'ろっぱい'],
    わ: ['わに', 'わたし', 'わたしたち', 'わたるどり', 'わくせい'],
    を: ['をたく', 'をりがみ', 'をさなご', 'をすまし'],
    ん: []
};

let gameState = {
    playerName: '',
    currentWord: '',
    nextChar: '',
    wins: 0,
    points: 0,
    started: false
};

function init() {
    showScreen('title');
    updateRankingDisplay();
}

function startGame() {
    showScreen('config');
}

function startShiritori() {
    const playerName = document.getElementById('player-name').value || 'プレイヤー';
    if (!playerName.trim()) {
        alert('プレイヤー名を入力してください');
        return;
    }

    gameState.playerName = playerName;
    gameState.currentWord = '';
    gameState.nextChar = '';
    gameState.wins = 0;
    gameState.points = 0;
    gameState.started = true;

    showScreen('game');
    startNewRound();
}

function startNewRound() {
    gameState.currentWord = '';
    gameState.nextChar = '';
    document.getElementById('current-word').textContent = '-';
    document.getElementById('ai-word').textContent = '-';
    document.getElementById('next-char').textContent = 'ん';
    document.getElementById('player-word').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('player-word').focus();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        submitWord();
    }
}

function submitWord() {
    const playerWord = document.getElementById('player-word').value.trim();

    if (!playerWord) {
        showFeedback('単語を入力してください', 'incorrect');
        return;
    }

    // 前の単語がない場合は任意の単語でOK
    if (gameState.currentWord === '') {
        gameState.currentWord = playerWord;
        gameState.nextChar = playerWord.slice(-1);
        document.getElementById('current-word').textContent = playerWord;
        document.getElementById('next-char').textContent = gameState.nextChar;
        document.getElementById('player-word').value = '';

        // AIの返答
        setTimeout(getAIResponse, 800);
    } else {
        // プレイヤーの単語が正しいかチェック
        const firstChar = playerWord.charAt(0);
        if (firstChar !== gameState.nextChar) {
            showFeedback(`「${gameState.nextChar}」で始まっていません`, 'incorrect');
            return;
        }

        if (playerWord === gameState.currentWord) {
            showFeedback('同じ単語は使えません', 'incorrect');
            return;
        }

        gameState.currentWord = playerWord;
        gameState.nextChar = playerWord.slice(-1);
        document.getElementById('current-word').textContent = playerWord;
        document.getElementById('next-char').textContent = gameState.nextChar;
        document.getElementById('player-word').value = '';
        showFeedback('✓ 正解！', 'correct');

        if (gameState.nextChar === 'ん') {
            showFeedback('✗ 「ん」で終わりました！プレイヤーの勝ち！', 'correct');
            gameState.wins++;
            gameState.points += 10;
            document.getElementById('game-score').textContent = gameState.wins + '/3';

            if (gameState.wins >= 3) {
                endGame(true);
            } else {
                setTimeout(() => {
                    startNewRound();
                }, 2000);
            }
        } else {
            setTimeout(getAIResponse, 800);
        }
    }
}

function getAIResponse() {
    const possibleWords = shiritori[gameState.nextChar] || [];

    if (possibleWords.length === 0) {
        showFeedback('✓ プレイヤーの勝ち！（AIに返す単語がありません）', 'correct');
        gameState.wins++;
        gameState.points += 10;
        document.getElementById('game-score').textContent = gameState.wins + '/3';

        if (gameState.wins >= 3) {
            endGame(true);
        } else {
            setTimeout(() => {
                startNewRound();
            }, 2000);
        }
        return;
    }

    const aiWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    document.getElementById('ai-word').textContent = aiWord;
    gameState.currentWord = aiWord;
    gameState.nextChar = aiWord.slice(-1);

    if (gameState.nextChar === 'ん') {
        showFeedback('✗ AIが「ん」で終わりました！AIの負け！プレイヤーの勝ち！', 'correct');
        gameState.wins++;
        gameState.points += 10;
        document.getElementById('game-score').textContent = gameState.wins + '/3';

        if (gameState.wins >= 3) {
            endGame(true);
        } else {
            setTimeout(() => {
                startNewRound();
            }, 2000);
        }
    } else {
        document.getElementById('next-char').textContent = gameState.nextChar;
        document.getElementById('player-word').focus();
    }
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = 'feedback ' + type;
}

function endGame(playerWon) {
    const message = playerWon ?
        `🎉 すばらしい！${gameState.wins}回の勝利おめでとう！` :
        `🎮 ゲーム終了。${gameState.wins}勝できました！`;

    document.getElementById('result-title').textContent = playerWon ? '🎉 プレイヤー勝利！' : 'ゲーム終了';
    document.getElementById('result-message').textContent = message;
    document.getElementById('final-score').textContent = gameState.wins;
    document.getElementById('total-points').textContent = gameState.points;

    saveScore({
        name: gameState.playerName,
        score: gameState.points,
        wins: gameState.wins,
        date: new Date().toLocaleDateString('ja-JP')
    });

    showScreen('result');
}

function saveScore(scoreData) {
    let rankings = JSON.parse(localStorage.getItem('wordGameRanking') || '[]');
    rankings.push(scoreData);
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 20);
    localStorage.setItem('wordGameRanking', JSON.stringify(rankings));
    updateRankingDisplay();
}

function updateRankingDisplay() {
    const rankings = JSON.parse(localStorage.getItem('wordGameRanking') || '[]');
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    rankings.slice(0, 10).forEach((score, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'ranking-item';
        rankItem.innerHTML = `
            <span class="ranking-rank">${index + 1}位</span>
            <span class="ranking-name">${score.name}</span>
            <span class="ranking-score">${score.wins}勝</span>
        `;
        rankingList.appendChild(rankItem);
    });

    if (rankings.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: #999;">まだランキングがありません</div>';
    }
}

function shareResult() {
    const text = `しりとりゲームで${gameState.wins}勝獲得しました！ポイントは${gameState.points}点です。🎮`;
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenName).classList.add('active');
}

function backToTitle() {
    document.getElementById('player-name').value = '';
    gameState.started = false;
    showScreen('title');
}

init();
