// ========== 認証管理 ==========
const VALID_TEACHERS = { "test": "1234", "T001": "xzUNc8zE", "T002": "43MIEZMc" };

const SESSION_KEY = 'sensei_teacher_id';

// ========== ログイン処理 ==========
function handleAuthLogin(e) {
    e.preventDefault();
    const teacherId = document.getElementById('auth-teacher-id').value.trim();
    const password = document.getElementById('auth-password').value;

    console.log('ログイン試行:', { teacherId });

    if (VALID_TEACHERS[teacherId] && VALID_TEACHERS[teacherId] === password) {
        // ログイン成功
        sessionStorage.setItem(SESSION_KEY, teacherId);
        document.getElementById('auth-teacher-id').value = '';
        document.getElementById('auth-password').value = '';
        showContent(teacherId);
        console.log('ログイン成功:', teacherId);
    } else {
        alert('教員IDまたはパスワードが正しくありません');
        console.log('ログイン失敗:', teacherId);
    }
}

// ========== ログアウト処理 ==========
function handleAuthLogout() {
    if (confirm('ログアウトしてもよろしいですか？')) {
        sessionStorage.removeItem(SESSION_KEY);
        location.reload();
    }
}

// ========== 画面切り替え ==========
function showContent(teacherId) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('content-wrapper').classList.remove('content-hidden');
    document.getElementById('content-wrapper').classList.add('content-visible');
    document.getElementById('login-teacher-name').textContent = `${teacherId}さん`;
}

function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('content-wrapper').classList.add('content-hidden');
    document.getElementById('content-wrapper').classList.remove('content-visible');
}

// ========== ページ読み込み時の初期化 ==========
window.addEventListener('load', () => {
    const savedTeacherId = sessionStorage.getItem(SESSION_KEY);

    if (savedTeacherId && VALID_TEACHERS[savedTeacherId]) {
        // セッション有効 → コンテンツ表示
        showContent(savedTeacherId);
        console.log('セッション復元:', savedTeacherId);
    } else {
        // セッション無効 → ログイン画面表示
        showAuthScreen();
        document.getElementById('auth-teacher-id').focus();
        console.log('ログイン画面を表示');
    }
});

// ========== 他のツールから呼び出し用 ==========
// 各ツール側で、ページ読み込み時にこの関数を呼び出す
function checkAuth() {
    const teacherId = sessionStorage.getItem(SESSION_KEY);
    if (!teacherId || !VALID_TEACHERS[teacherId]) {
        // 認証されていない → ホームページにリダイレクト
        alert('ログインが必要です');
        window.location.href = '../homepage/index.html';
        return false;
    }
    return true;
}

// 教員 ID を取得（ツール側で使用）
function getTeacherId() {
    return sessionStorage.getItem(SESSION_KEY);
}
