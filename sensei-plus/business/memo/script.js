// 1. Firebaseの設定（そのまま）
const firebaseConfig = { apiKey: "AIzaSyB-hHkL9jyoudu3bNyhidZIUCKlUaaXUX8", projectId: "electronic-board-app" };

// 2. ★ここを書き換える★
// URLの ?room=〇〇 を取得し、なければ 'main' とする
const params = new URLSearchParams(window.location.search);
const boardId = params.get('room') || 'main';

// 先生用確認：今どの部屋にいるかをコンソールに出力（デバッグ用）
console.log("現在のボードID:", boardId);

// 漢数字変換用
const toKanji = (num) => {
    const kanji = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十真', '二十八', '二十九', '三十', '三十一'];
    return kanji[parseInt(num)] || num;
};

// 縦書きの中で英数字、範囲記号、丸数字などが不自然に縦に割れないよう「縦中横（横書き）」にする自動フォーマッター
const formatVerticalText = (text) => {
    if (!text) return "";
    // タグの混入を防ぐためのエスケープ
    let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // A. 英数字、丸数字、キーキャップ数字（□囲み用）の置換
    // ※ 1⃣などのキーキャップ数字がフォントのズームに合わせて可変になるよう em 単位で指定。囲み内の文字サイズが縮まないよう 1em（等倍）にします。
    escaped = escaped.replace(/([0-9０-９]\ufe0f?\u20e3|[0-9]⃣|[０-９]⃣|[0-9a-zA-Z２-９ａ-ｚＡ-Ｚ.・:：\/\\-]+|[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴])/g, (match) => {
        // キーキャップ囲み数字文字の判定
        if (match.indexOf('\u20e3') !== -1 || match.indexOf('⃣') !== -1) {
            const num = match.charAt(0);
            const halfNum = num.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
            // 文字サイズ自体を周りと同じ（1em）に保ったまま、囲みの四角枠を等倍で美しく描画
            return `<span class="border border-slate-800 rounded-sm inline-flex items-center justify-center bg-slate-50 font-sans font-bold text-center" style="writing-mode: horizontal-tb; vertical-align: middle; width: 1.3em; height: 1.3em; font-size: 1em; line-height: 1; margin: 0 2px; display: inline-flex;">${halfNum}</span>`;
        } else {
            return `<span class="inline-block font-sans font-bold" style="writing-mode: horizontal-tb; text-orientation: initial; margin: 0 1px; vertical-align: middle;">${match}</span>`;
        }
    });

    // B. 先頭またはスペースに隣接する「が」「音」「算」「国」を検出し、美しい円（〇）で囲む (サイズを周りと等倍の 1em に調整)
    // ※「音　国語」の「国」を絶対に置換しないために、隣が完全にスペース(または行頭・行末)になっている独立した「が」「音」「算」「国」のみをキャッチ。
    escaped = escaped.replace(/(^|　| )(が|音|算|国)(?=($|　| ))/g, (match, p1, p2) => {
        const roundedChar = `<span class="rounded-full border border-slate-700 inline-flex items-center justify-center bg-white shadow-sm font-bold text-center" style="writing-mode: horizontal-tb; vertical-align: middle; width: 1.35em; height: 1.35em; font-size: 1em; line-height: 1; margin: 3px 0; color: #1e293b; display: inline-flex; padding: 1px;">${p2}</span>`;
        return p1 + roundedChar;
    });

    return escaped;
};

let currentSize = parseInt(localStorage.getItem('fontSize')) || 20;
const applyFontSize = (size) => {
    document.getElementById('board-main').style.fontSize = size + 'px';
    const headings = document.querySelectorAll('.board-heading');
    headings.forEach(h => h.style.fontSize = (size * 1.5) + 'px');
    const dispDate = document.getElementById('disp-date');
    if (dispDate) dispDate.style.fontSize = (size * 1.4) + 'px';
    document.getElementById('editor-title').style.fontSize = (size * 2) + 'px';
    document.getElementById('editor-content').style.fontSize = size + 'px';
    const editHeadings = document.querySelectorAll('#editor-content h3');
    editHeadings.forEach(h => h.style.fontSize = (size * 1.2) + 'px');
};
applyFontSize(currentSize);

const changeFontSize = (delta) => {
    currentSize = Math.max(12, Math.min(60, currentSize + delta));
    applyFontSize(currentSize);
    localStorage.setItem('fontSize', currentSize);
};

// ===== ローカルストレージへのデータ保存機能 =====
// 各パソコンでデータを自動保存して、ページをリロードしても保存されるようにする
// URLの room パラメータごとに異なるキーを使用して、複数のボードが干渉しないようにする
const getLocalStorageKey = () => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room') || 'main';
    return `memoData_${room}`;
};

const saveToLocalStorage = (data) => {
    try {
        const key = getLocalStorageKey();
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('ローカルストレージへの保存に失敗しました:', e);
    }
};

const loadFromLocalStorage = () => {
    try {
        const key = getLocalStorageKey();
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.warn('ローカルストレージからの読み込みに失敗しました:', e);
        return {};
    }
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

// カスタムダイアログの実装
const showConfirm = (title, message, onConfirm) => {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;

    const modal = document.getElementById('custom-confirm-modal');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    const okBtn = document.getElementById('confirm-ok-btn');

    cancelBtn.classList.remove('hidden');
    modal.classList.remove('hidden');

    const cleanup = () => {
        modal.classList.add('hidden');
        cancelBtn.onclick = null;
        okBtn.onclick = null;
    };

    cancelBtn.onclick = () => { cleanup(); };
    okBtn.onclick = () => { onConfirm(); cleanup(); };
};

const showAlert = (title, message) => {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;

    const modal = document.getElementById('custom-confirm-modal');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    const okBtn = document.getElementById('confirm-ok-btn');

    cancelBtn.classList.add('hidden');
    modal.classList.remove('hidden');

    okBtn.onclick = () => {
        modal.classList.add('hidden');
        cancelBtn.classList.remove('hidden');
        okBtn.onclick = null;
    };
};

// 選択肢モーダル
const showCustomSelectModal = (title, options) => {
    document.getElementById('select-modal-title').textContent = title;
    const container = document.getElementById('select-modal-options');
    container.innerHTML = "";

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-left border border-slate-100 transition-colors flex items-center justify-between";
        btn.innerHTML = `<span>${opt.label}</span>
                             <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
        btn.onclick = () => {
            closeSelectModal();
            opt.action();
        };
        container.appendChild(btn);
    });
    document.getElementById('custom-select-modal').classList.remove('hidden');
};
const closeSelectModal = () => {
    document.getElementById('custom-select-modal').classList.add('hidden');
};

// 宿題の追加メニュー表示 (表示黒板の「宿」＋ボタン用)
const showAddHomeworkMenu = () => {
    showCustomSelectModal("宿題の追加方法", [
        { label: "✏️ 普通の項目を追加", action: () => addItem('homework') },
        { label: "🔥 「がんばり」を追加", action: () => openHomeworkModal('ganbari') },
        { label: "📖 「音読」を追加", action: () => openHomeworkModal('ondoku') },
        { label: "📐 「算ド」を追加", action: () => openHomeworkModal('sandori') },
        { label: "📝 「国ド」を追加", action: () => openHomeworkModal('kokudori') }
    ]);
};

// 宿題テンプレートモーダル開閉
let currentHwType = "ganbari";
const openHomeworkModal = (type) => {
    currentHwType = type;
    const title = document.getElementById('hw-modal-title');

    const formGanbari = document.getElementById('hw-form-ganbari');
    const formOndoku = document.getElementById('hw-form-ondoku');
    const formSandori = document.getElementById('hw-form-sandori');
    const formKokudori = document.getElementById('hw-form-kokudori');

    // 全フォームを一旦非表示
    formGanbari.classList.add('hidden');
    formOndoku.classList.add('hidden');
    formSandori.classList.add('hidden');
    formKokudori.classList.add('hidden');

    // 入力フォームの初期化
    document.getElementById('ganbari-page').value = "1.5";
    document.getElementById('ganbari-content').value = "自学";
    document.getElementById('ondoku-subject').value = "国語";
    document.getElementById('ondoku-page').value = "86～87";
    document.getElementById('sandori-num').value = "1⃣";
    document.getElementById('kokudori-num').value = "1⃣";

    if (type === 'ganbari') {
        title.textContent = "🔥 がんばり の追加";
        formGanbari.classList.remove('hidden');
    } else if (type === 'ondoku') {
        title.textContent = "📖 音読 の追加";
        formOndoku.classList.remove('hidden');
    } else if (type === 'sandori') {
        title.textContent = "📐 算ド の追加";
        formSandori.classList.remove('hidden');
    } else if (type === 'kokudori') {
        title.textContent = "📝 国ド の追加";
        formKokudori.classList.remove('hidden');
    }
    document.getElementById('homework-template-modal').classList.remove('hidden');
};

const closeHomeworkModal = () => {
    document.getElementById('homework-template-modal').classList.add('hidden');
};

const setGanbariContent = (val) => { document.getElementById('ganbari-content').value = val; };
const setOndokuSubject = (val) => { document.getElementById('ondoku-subject').value = val; };
const setSandoriNum = (val) => { document.getElementById('sandori-num').value = val; };
const setKokudoriNum = (val) => { document.getElementById('kokudori-num').value = val; };

// 宿題の追加形式をユーザー指定の「算　ドリル　1⃣」「国　ドリル　1⃣」へ変更
const submitHomeworkTemplate = () => {
    let resultText = "";
    if (currentHwType === 'ganbari') {
        const page = document.getElementById('ganbari-page').value.trim() || "1.5";
        const content = document.getElementById('ganbari-content').value.trim() || "自学";
        resultText = `が　${page}　${content}`;
    } else if (currentHwType === 'ondoku') {
        const subject = document.getElementById('ondoku-subject').value.trim() || "国語";
        const page = document.getElementById('ondoku-page').value.trim() || "86～87";
        resultText = `音　${subject}　${page}`;
    } else if (currentHwType === 'sandori') {
        const num = document.getElementById('sandori-num').value.trim() || "1⃣";
        resultText = `算　ドリル　${num}`;
    } else if (currentHwType === 'kokudori') {
        const num = document.getElementById('kokudori-num').value.trim() || "1⃣";
        resultText = `国　ドリル　${num}`;
    }

    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let list = data.homework || [];
        list.push(resultText);
        db.collection("boards").doc(boardId).set({ homework: list }, { merge: true }).then(() => {
            // ローカルストレージにも保存
            const localData = loadFromLocalStorage();
            if (!localData.homework) localData.homework = [];
            localData.homework = list;
            saveToLocalStorage(localData);
            closeHomeworkModal();
        });
    });
};

// 項目ドラッグ並び替え用の初期化ファンクション
// 縦書き(横並び)と横書き(縦並び)で正確に動作するように direction を最適化し、スライドをなめらかに。
const initSortableContainer = (containerId, field) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    // 既存のSortableインスタンスがあれば破棄して再バインド
    if (el.sortableInstance) {
        el.sortableInstance.destroy();
    }

    const isVerticalCol = (field !== 'schedule'); // 連絡、宿題、持ち物は縦書き（要素は横に並ぶ）

    el.sortableInstance = Sortable.create(el, {
        animation: 250,
        ghostClass: 'bg-blue-50', // ドラッグした瞬間の移動先を青白く表示してわかりやすく
        dragClass: 'opacity-40',
        // グリップアイコン(点々マーク)の撤廃に伴い、テキストボックス自体を掴んでどこでもスライド並び替え可能に
        direction: isVerticalCol ? 'horizontal' : 'vertical', // 縦書きエリアは 'horizontal'、時間割は 'vertical'
        swapThreshold: 0.5, // 半分重なった時点でサクッと入れ替わり、間への滑り込みが劇的にスムーズに
        invertSwap: true,
        onEnd: (evt) => {
            const oldIdx = evt.oldIndex;
            const newIdx = evt.newIndex;
            if (oldIdx === newIdx || oldIdx === undefined || newIdx === undefined) return;

            db.collection("boards").doc(boardId).get().then(doc => {
                const data = doc.data() || {};
                const list = [...(data[field] || [])];
                const [movedItem] = list.splice(oldIdx, 1);
                list.splice(newIdx, 0, movedItem);

                db.collection("boards").doc(boardId).set({ [field]: list }, { merge: true });
            });
        }
    });
};

const saveDate = () => {
    const dateData = {
        month: document.getElementById('edit-month').value,
        day: document.getElementById('edit-day').value,
        week: document.getElementById('edit-week').value
    };
    db.collection("boards").doc(boardId).set(dateData, { merge: true });
    // ローカルストレージにも保存
    const allData = loadFromLocalStorage();
    Object.assign(allData, dateData);
    saveToLocalStorage(allData);
};

const incrementDate = () => {
    const m = parseInt(document.getElementById('edit-month').value);
    const d = parseInt(document.getElementById('edit-day').value);
    const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let nextD = d + 1;
    let nextM = m;
    if (nextD > daysInMonth[m]) { nextD = 1; nextM = (m % 12) + 1; }
    const weekList = ['日', '月', '火', '水', '木', '金', '土'];
    const currentWeekIdx = weekList.indexOf(document.getElementById('edit-week').value) || 0;
    const nextWeek = weekList[(currentWeekIdx + 1) % 7];
    db.collection("boards").doc(boardId).set({ month: nextM.toString(), day: nextD.toString(), week: nextWeek }, { merge: true });
};

// 日付を戻す（前日へ）処理
const decrementDate = () => {
    const m = parseInt(document.getElementById('edit-month').value);
    const d = parseInt(document.getElementById('edit-day').value);
    const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let prevD = d - 1;
    let prevM = m;
    if (prevD < 1) {
        prevM = m - 1;
        if (prevM < 1) prevM = 12;
        prevD = daysInMonth[prevM];
    }
    const weekList = ['日', '月', '火', '水', '木', '金', '土'];
    const currentWeekIdx = weekList.indexOf(document.getElementById('edit-week').value) || 0;
    const prevWeek = weekList[(currentWeekIdx + 6) % 7];
    db.collection("boards").doc(boardId).set({ month: prevM.toString(), day: prevD.toString(), week: prevWeek }, { merge: true });
};

const addItem = (field) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let list = data[field] || [];
        list.push("");
        db.collection("boards").doc(boardId).set({ [field]: list }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData[field]) localData[field] = [];
        localData[field] = list;
        saveToLocalStorage(localData);
    });
};

const updateItem = (field, index, value) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let list = data[field] || [];
        list[index] = value;
        db.collection("boards").doc(boardId).set({ [field]: list }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData[field]) localData[field] = [];
        localData[field] = list;
        saveToLocalStorage(localData);
    });
};

const deleteItem = (field, idx) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let list = doc.data()[field] || [];
        list.splice(idx, 1);
        db.collection("boards").doc(boardId).set({ [field]: list }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData[field]) localData[field] = [];
        localData[field] = list;
        saveToLocalStorage(localData);
    });
};

// 週間テンプレート操作用関数
const updateTemplateItem = (day, index, value) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let templates = data.templates || {};
        let list = templates[day] || [];
        list[index] = value;
        templates[day] = list;
        db.collection("boards").doc(boardId).set({ templates: templates }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData.templates) localData.templates = {};
        localData.templates = templates;
        saveToLocalStorage(localData);
    });
};

const addTemplateItem = (day) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let templates = data.templates || {};
        let list = templates[day] || [];
        list.push("");
        templates[day] = list;
        db.collection("boards").doc(boardId).set({ templates: templates }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData.templates) localData.templates = {};
        localData.templates = templates;
        saveToLocalStorage(localData);
    });
};

const deleteTemplateItem = (day, idx) => {
    db.collection("boards").doc(boardId).get().then(doc => {
        let data = doc.data() || {};
        let templates = data.templates || {};
        let list = templates[day] || [];
        list.splice(idx, 1);
        templates[day] = list;
        db.collection("boards").doc(boardId).set({ templates: templates }, { merge: true });
        // ローカルストレージにも保存
        const localData = loadFromLocalStorage();
        if (!localData.templates) localData.templates = {};
        localData.templates = templates;
        saveToLocalStorage(localData);
    });
};

// 曜日の時間割テンプレートを今日の時間割に反映する処理
const applyTemplateToCurrentSchedule = () => {
    db.collection("boards").doc(boardId).get().then(doc => {
        const data = doc.data() || {};
        const currentWeek = data.week || "月";

        // 翌曜日のテンプレートを特定するロジック
        const weekDays = ['月', '火', '水', '木', '金'];
        const currentIndex = weekDays.indexOf(currentWeek);
        const nextWeek = weekDays[(currentIndex + 1) % 5];

        const templates = data.templates || {};
        const templateList = templates[nextWeek];

        if (!templateList || templateList.length === 0 || templateList.every(v => v === "")) {
            showAlert(
                "テンプレート未設定",
                `「${nextWeek}曜日」のテンプレート時間割がまだ設定されていません。編集画面の「週間テンプレート」タブで登録してください。`
            );
            return;
        }

        showConfirm(
            "テンプレートの適用",
            `現在の本日の時間割を、「${nextWeek}曜日」の登録済みテンプレート（${templateList.filter(Boolean).join(', ')} など）で上書きしますか？`,
            () => {
                db.collection("boards").doc(boardId).set({ schedule: [...templateList] }, { merge: true });
            }
        );
    });
};

const renderEditable = (containerId, field) => {
    const cont = document.getElementById(containerId);
    db.collection("boards").doc(boardId).onSnapshot(doc => {
        const data = doc.data() || {};
        const items = data[field] || [];
        cont.innerHTML = "";
        items.forEach((val, idx) => {
            const div = document.createElement('div');

            // 点々マーク（ドラッググリップ）撤廃による、完璧な余白の最適化
            if (field === 'schedule') {
                div.className = "editable group relative p-1.5 w-full text-left bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-slate-100 flex items-center justify-between";
            } else {
                div.className = "editable group relative p-1.5 text-left inline-block bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-slate-100";
            }

            // テキストを表示するエリア
            const textSpan = document.createElement('span');
            textSpan.className = "block w-full pointer-events-none"; // テキスト領域でのカーソル干渉防止
            let prefix = (field === 'notice') ? '※' : (field === 'items') ? '・' : '';
            let text = (field === 'schedule') ? (idx + 1) + "." + val : prefix + val;

            // 縦書きの場合のみ、丸囲みやキーキャップ四角囲み、縦中横（横書き）処理を施す
            if (field !== 'schedule') {
                textSpan.innerHTML = formatVerticalText(text);
            } else {
                textSpan.textContent = text;
            }
            div.appendChild(textSpan);

            // ✖ ボタン (削除) ：時間割（schedule）は削除を禁止
            if (field !== 'schedule') {
                const delBtn = document.createElement('button');
                // 誤操作防止のため、クリックをしっかりキャッチできるサイズに設計
                delBtn.className = "absolute bottom-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-50 active:opacity-100 text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center z-20";
                delBtn.title = "この項目を削除";
                delBtn.innerHTML = `
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    `;

                delBtn.onclick = (e) => {
                    e.stopPropagation(); // ドラッグや親クリックのイベント衝突防止
                    showConfirm(
                        "項目の削除",
                        `この項目「${val || '（空欄）'}」を黒板から消しますか？`,
                        () => {
                            deleteItem(field, idx);
                        }
                    );
                };
                div.appendChild(delBtn);
            }

            // 削除・ドラッグ動作を邪魔せず、軽くタップした場合はインライン編集を起動
            div.onclick = (e) => {
                if (e.target.closest('button')) return;

                const input = document.createElement('input');
                input.className = "edit-input text-slate-800 font-bold bg-white";
                input.value = val;
                input.onblur = () => { updateItem(field, idx, input.value); input.replaceWith(div); };
                input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };
                div.replaceWith(input);
                input.focus();
            };

            cont.appendChild(div);
        });

        // コンテナが再レンダリングされるたびに、SortableJSをバインドし直してドラッグを有効化
        initSortableContainer(containerId, field);
    });
};

const renderEditor = (containerId, field) => {
    const cont = document.querySelector(`#list-${containerId} .list-container`);
    db.collection("boards").doc(boardId).onSnapshot(doc => {
        const data = doc.data() || {};
        cont.innerHTML = "";
        (data[field] || []).forEach((val, idx) => {
            const div = document.createElement('div');
            div.className = "flex gap-2 items-center";
            let label = (field === 'schedule') ? (idx + 1) + "." : ((field === 'notice') ? '※' : '・');
            div.innerHTML = `<span class="text-gray-500 font-bold w-10 text-right">${label}</span>
                                 <input type="text" value="${val}" class="w-full p-2.5 border rounded-lg text-left text-base" onblur="updateItem('${field}', ${idx}, this.value)" onkeydown="if(event.key === 'Enter') this.blur()">
                                 <button type="button" class="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" onclick="deleteItem('${field}', ${idx})">
                                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                 </button>`;
            cont.appendChild(div);
        });
    });
};

// 編集モード内のタブ切替
let activeEditorTab = 'schedule';
const switchEditorTab = (tabName) => {
    activeEditorTab = tabName;
    document.querySelectorAll('.editor-tab').forEach(btn => {
        btn.className = "editor-tab flex-1 py-2.5 px-4 text-center rounded-xl font-bold text-sm text-slate-600 hover:text-slate-800 transition-all";
    });

    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (tabName === 'weekly') {
        activeBtn.className = "editor-tab flex-1 py-2.5 px-4 text-center rounded-xl font-bold text-sm bg-indigo-600 text-white shadow-sm transition-all";
    } else {
        activeBtn.className = "editor-tab flex-1 py-2.5 px-4 text-center rounded-xl font-bold text-sm bg-blue-600 text-white shadow-sm transition-all";
    }

    ['schedule', 'homework', 'items', 'notice', 'weekly'].forEach(p => {
        document.getElementById(`edit-pane-${p}`).classList.add('hidden');
    });
    document.getElementById(`edit-pane-${tabName}`).classList.remove('hidden');

    if (tabName === 'weekly') {
        // 週間テンプレートのデータ読み込み
        db.collection("boards").doc(boardId).get().then(doc => {
            renderWeeklyTemplateListFromData(doc.data() || {});
        });
    }
};

// 週間テンプレート内の曜日切り替え
let activeTemplateDay = '月';
const switchTemplateDay = (day) => {
    activeTemplateDay = day;
    document.querySelectorAll('.temp-day-btn').forEach(btn => {
        btn.className = "temp-day-btn flex-1 min-w-[48px] py-2 text-center rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all";
    });
    document.getElementById(`temp-day-${day}`).className = "temp-day-btn flex-1 min-w-[48px] py-2 text-center rounded-xl font-bold text-sm bg-indigo-600 text-white shadow-sm transition-all";

    db.collection("boards").doc(boardId).get().then(doc => {
        renderWeeklyTemplateListFromData(doc.data() || {});
    });
};

// 週間テンプレート描画
const renderWeeklyTemplateListFromData = (data) => {
    const cont = document.getElementById('weekly-template-container');
    if (!cont) return;
    const templates = data.templates || {};
    const list = templates[activeTemplateDay] || [];
    cont.innerHTML = "";

    if (list.length === 0) {
        cont.innerHTML = `<div class="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                「${activeTemplateDay}曜日」の時間割テンプレートは未登録です。<br>下のボタンから時間割の枠を追加してください。
                              </div>`;
        return;
    }

    list.forEach((val, idx) => {
        const div = document.createElement('div');
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
                <span class="text-slate-500 font-bold w-10 text-right">${idx + 1}.</span>
                <input type="text" value="${val}" class="w-full p-2.5 border rounded-lg text-left text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" onblur="updateTemplateItem('${activeTemplateDay}', ${idx}, this.value)" onkeydown="if(event.key === 'Enter') this.blur()">
                <button type="button" class="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center" onclick="deleteTemplateItemAction(${idx})">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            `;
        cont.appendChild(div);
    });
};

const addTemplateItemAction = () => {
    addTemplateItem(activeTemplateDay);
    setTimeout(() => {
        db.collection("boards").doc(boardId).get().then(doc => {
            renderWeeklyTemplateListFromData(doc.data() || {});
        });
    }, 150);
};

const deleteTemplateItemAction = (idx) => {
    deleteTemplateItem(activeTemplateDay, idx);
    setTimeout(() => {
        db.collection("boards").doc(boardId).get().then(doc => {
            renderWeeklyTemplateListFromData(doc.data() || {});
        });
    }, 150);
};

['notice', 'homework', 'items', 'schedule'].forEach(f => {
    renderEditable('disp-' + f, f);
    renderEditor(f, f);
});

// ===== ページロード時にローカルストレージからデータを復元 =====
window.addEventListener('load', () => {
    const savedData = loadFromLocalStorage();
    if (Object.keys(savedData).length > 0) {
        console.log('ローカルストレージから保存データを復元しました');
        // 日付情報の復元
        if (savedData.month) document.getElementById('edit-month').value = savedData.month;
        if (savedData.day) document.getElementById('edit-day').value = savedData.day;
        if (savedData.week) document.getElementById('edit-week').value = savedData.week;
    }
});

document.getElementById('mode-toggle').onclick = (e) => {
    document.getElementById('view-editor').classList.toggle('hidden');
    document.getElementById('view-display').classList.toggle('hidden');
    e.target.textContent = document.getElementById('view-editor').classList.contains('hidden') ? "編集モード" : "表示に戻る";
};

db.collection("boards").doc(boardId).onSnapshot(doc => {
    const d = doc.data() || {};
    // Firebaseから取得したデータをローカルストレージにも保存
    saveToLocalStorage(d);

    const monthK = toKanji(d.month || "");
    const dayK = toKanji(d.day || "");
    const weekStr = d.week ? `︵${d.week}︶` : "";
    document.getElementById('disp-date').textContent = `${monthK}月${dayK}日${weekStr}`;
    document.getElementById('edit-month').value = d.month || "";
    document.getElementById('edit-day').value = d.day || "";
    document.getElementById('edit-week').value = d.week || "";

    // 曜日更新時、適用クイックボタンの title も更新
    const quickBtn = document.getElementById('quick-template-btn');
    const weekDays = ['月', '火', '水', '木', '金'];
    const currentIdx = weekDays.indexOf(d.week || '月');
    const nextDay = weekDays[(currentIdx + 1) % 5];

    if (quickBtn) {
        quickBtn.title = `${nextDay}曜日の時間割テンプレートを適用`;
    }

    const editorBtnLabel = document.getElementById('editor-template-btn-label');
    if (editorBtnLabel) {
        editorBtnLabel.textContent = `「${nextDay}」から読込`;
    }

    // 現在週間タブが開いていれば再レンダリング
    if (activeEditorTab === 'weekly') {
        renderWeeklyTemplateListFromData(d);
    }
});
