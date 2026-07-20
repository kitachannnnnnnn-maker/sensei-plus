// ========== ユーザー管理 ==========
// 認証は homepage/auth.js で管理（このファイルでは不要）

let currentTeacher = null;
let recordsData = [];

// ========== ログアウト処理（homepage の認証をクリア） ==========
function handleLogout() {
    if (confirm('ログアウトしてもよろしいですか？')) {
        sessionStorage.removeItem('currentTeacher');
        handleAuthLogout(); // homepage/auth.js の関数を呼び出し
    }
}

// ========== データ管理 ==========
function getTeacherStorageKey() {
    return `records_${currentTeacher}`;
}

function loadTeacherData() {
    const storageKey = getTeacherStorageKey();
    const jsonData = localStorage.getItem(storageKey);

    if (jsonData) {
        try {
            recordsData = JSON.parse(jsonData);
        } catch (e) {
            console.warn('データの読み込みに失敗しました。新しいデータから開始します。');
            recordsData = [];
        }
    } else {
        recordsData = [];
    }
}

function saveData() {
    const storageKey = getTeacherStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(recordsData));
}

// ========== 記録機能 ==========
function addRecord(e) {
    // e.preventDefault() は必要に応じて
    if (e && e.preventDefault) {
        e.preventDefault();
    }

    const studentId = document.getElementById('student-id').value.trim();
    const category = document.getElementById('category').value;
    const memo = document.getElementById('memo').value.trim();

    if (!studentId) {
        alert('出席番号またはイニシャルを入力してください');
        return;
    }

    if (!memo) {
        alert('メモを入力してください');
        return;
    }

    recordsData.unshift({
        id: Date.now(),
        studentId: studentId,
        category: category,
        memo: memo,
        date: new Date().toLocaleDateString('ja-JP'),
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    });

    saveData();
    clearForm();
    renderRecords();
}

function removeRecord(id) {
    recordsData = recordsData.filter(r => r.id !== id);
    saveData();
    renderRecords();
}

function renderRecords() {
    const container = document.getElementById('records-container');
    container.innerHTML = '';

    if (recordsData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 20px;">まだ記録がありません</p>';
        return;
    }

    recordsData.forEach(record => {
        const categoryIcons = {
            'good': '✨ 良いこと',
            'guidance': '📢 指導',
            'other': '📝 その他'
        };

        const card = document.createElement('div');
        card.className = `record-card ${record.category}`;
        card.innerHTML = `
            <div class="record-info">
                <div class="record-header">
                    <span class="record-id">${record.studentId}</span>
                    <span class="record-category ${record.category}">${categoryIcons[record.category]}</span>
                </div>
                <div class="record-memo">${record.memo}</div>
                <div class="record-time">${record.time}</div>
            </div>
            <button class="record-remove" onclick="removeRecord(${record.id})">削除</button>
        `;
        container.appendChild(card);
    });
}

function clearForm() {
    document.getElementById('student-id').value = '';
    document.getElementById('category').value = 'good';
    document.getElementById('memo').value = '';
}

function saveData() {
    const storageKey = getTeacherStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(recordsData));
}

function exportData() {
    const categoryMap = {
        'good': '良いこと',
        'guidance': '指導',
        'other': 'その他'
    };

    let csv = '出席番号,カテゴリ,メモ,日付,時刻\n';
    recordsData.forEach(record => {
        csv += `"${record.studentId}","${categoryMap[record.category]}","${record.memo}","${record.date}","${record.time}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `student-records_${currentTeacher}_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function clearData() {
    if (confirm('この教員のすべての記録を削除してもいいですか？')) {
        recordsData = [];
        saveData();
        renderRecords();
    }
}

// ========== ツール側での認証チェックは index.html で実行 ==========
