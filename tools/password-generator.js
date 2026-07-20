// ========== 本運用用パスワード生成ツール ==========
// 
// このスクリプトを使用して、本運用用のセキュアなパスワードを生成してください
// 生成されたパスワードを auth.js に設定します
//

function generateSecurePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// 複数の先生用パスワード生成
function generateTeacherCredentials(teacherIds) {
    const credentials = {};
    teacherIds.forEach(id => {
        credentials[id] = generateSecurePassword(16);
    });
    return credentials;
}

// 使用例：
// const teachers = ['T001', 'T002', 'T003'];
// const creds = generateTeacherCredentials(teachers);
// console.table(creds);
// → 結果をコピーして auth.js に記入

// ========== HTML インターフェース ==========
// このセクションをブラウザのコンソールで実行してパスワードを生成

console.log('========================================');
console.log('本運用用パスワード生成ツール');
console.log('========================================');
console.log('');
console.log('使用方法：');
console.log('1. 以下のコマンドをコンソール（F12）に貼り付ける');
console.log('2. Enter を押す');
console.log('');
console.log('コマンド：');
console.log('const teachers = ["T001", "T002", "T003"];');
console.log('const creds = generateTeacherCredentials(teachers);');
console.log('console.table(creds);');
console.log('');
console.log('========================================');

// 便利な一括生成関数
function generateAllCredentials() {
    const result = {
        teachers: {
            'test': generateSecurePassword(12),
            'T001': generateSecurePassword(16),
            'T002': generateSecurePassword(16),
            'T003': generateSecurePassword(16)
        },
        generated: new Date().toLocaleString('ja-JP'),
        note: '生成されたパスワードを auth.js に記入してください'
    };
    console.log('========== 生成されたパスワード一覧 ==========');
    console.table(result.teachers);
    console.log('');
    console.log('⚠️ 重要：');
    console.log('1. このパスワードをどこかに記録してください');
    console.log('2. 下のテキストをコピーして、auth.js に貼り付けてください');
    console.log('');
    console.log('コピー用テキスト：');
    console.log('const VALID_TEACHERS = ' + JSON.stringify(result.teachers, null, 4) + ';');
    console.log('');
    return result.teachers;
}

// 実行：ブラウザのコンソール（F12）で以下を実行
// generateAllCredentials();
