// ========== Google Sheets 同期機能 ==========

// 設定ファイルからデプロイメント URL を取得
// sheets-config.js で定義: GOOGLE_SHEETS_CONFIG.deploymentUrl

let isOnline = navigator.onLine;

// ========== ネットワーク状態を監視 ==========
window.addEventListener('online', () => {
    isOnline = true;
    console.log('オンライン接続 - Google Sheets と同期開始');
    syncToSheets();
});

window.addEventListener('offline', () => {
    isOnline = false;
    console.log('オフライン状態 - ローカルストレージで動作');
});

// ========== Google Sheets に記録を追加 ==========
async function addRecordToSheets(teacherId, record) {
    if (!isOnline) {
        console.log('オフライン: ローカルストレージのみに保存');
        return false;
    }

    try {
        const url = new URL(GOOGLE_SHEETS_CONFIG.deploymentUrl);
        url.searchParams.append('action', 'add');
        url.searchParams.append('teacherId', teacherId);
        url.searchParams.append('studentId', record.studentId);
        url.searchParams.append('category', record.category);
        url.searchParams.append('memo', record.memo);
        url.searchParams.append('date', record.date);
        url.searchParams.append('time', record.time);

        const response = await fetch(url, {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            console.log('Google Sheets に記録を追加:', record);
            return true;
        } else {
            console.error('Google Sheets への追加に失敗:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Google Sheets 同期エラー:', error);
        return false;
    }
}

// ========== Google Sheets から記録を取得 ==========
async function getRecordsFromSheets(teacherId) {
    if (!isOnline) {
        console.log('オフライン: ローカルストレージから取得');
        return null;
    }

    try {
        const url = new URL(GOOGLE_SHEETS_CONFIG.deploymentUrl);
        url.searchParams.append('action', 'get');
        url.searchParams.append('teacherId', teacherId);

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.records) {
            console.log('Google Sheets から記録を取得:', result.records.length);
            return result.records;
        } else {
            console.error('Google Sheets から取得に失敗:', result.error);
            return null;
        }
    } catch (error) {
        console.error('Google Sheets 取得エラー:', error);
        return null;
    }
}

// ========== ローカルと Google Sheets を同期 ==========
async function syncToSheets() {
    if (!currentTeacher || !isOnline) return;

    const storageKey = getTeacherStorageKey();
    const localRecords = recordsData;

    // Google Sheets から最新データを取得
    const sheetsRecords = await getRecordsFromSheets(currentTeacher);

    if (sheetsRecords !== null) {
        // Google Sheets のデータを優先（サーバーが最新）
        recordsData = sheetsRecords.map(record => ({
            id: record.date + record.time, // 一意のキーを生成
            studentId: record.studentId,
            category: record.category,
            memo: record.memo,
            date: record.date,
            time: record.time
        }));

        // ローカルストレージに保存
        localStorage.setItem(storageKey, JSON.stringify(recordsData));
        renderRecords();
        console.log('同期完了:', recordsData.length + '件');
    }
}

// ========== 記録追加時に Google Sheets に自動保存 ==========
function addRecordWithSync(e) {
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

    const record = {
        id: Date.now(),
        studentId: studentId,
        category: category,
        memo: memo,
        date: new Date().toLocaleDateString('ja-JP'),
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };

    // ローカルストレージに保存
    recordsData.unshift(record);
    saveData();

    // Google Sheets に追加（オンライン時）
    if (isOnline) {
        addRecordToSheets(currentTeacher, record);
    } else {
        console.log('オフライン: ローカルに保存しました。接続時に同期されます。');
    }

    clearForm();
    renderRecords();
}

// ========== ページ読み込み時に同期 ==========
window.addEventListener('load', async () => {
    // 既存の load イベントハンドラーが実行された後に実行
    setTimeout(async () => {
        if (currentTeacher && isOnline) {
            console.log('Google Sheets と同期を開始...');
            await syncToSheets();
        }
    }, 1000);
});

// ========== 定期的に同期（オンライン時） ==========
// 30秒ごとにチェック
setInterval(() => {
    if (currentTeacher && isOnline) {
        syncToSheets();
    }
}, 30000);
