// ========== Google Sheets 設定 ==========
// 
// SETUP_GOOGLE_SHEETS.md の手順に従って、
// 以下の値を設定してください
//

const GOOGLE_SHEETS_CONFIG = {
    // Google Apps Script のデプロイメント URL
    // 例: https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/useweb
    deploymentUrl: 'YOUR_DEPLOYMENT_URL_HERE',

    // Google Sheets の共有者（あなたのメール）
    ownerEmail: 'your-email@gmail.com'
};

// ========== セットアップ確認 ==========
window.addEventListener('load', () => {
    // デプロイメント URL が設定されているか確認
    if (GOOGLE_SHEETS_CONFIG.deploymentUrl === 'YOUR_DEPLOYMENT_URL_HERE') {
        console.warn('⚠️ Google Sheets が設定されていません');
        console.warn('📖 SETUP_GOOGLE_SHEETS.md を参照して設定してください');
    } else {
        console.log('✅ Google Sheets 設定完了');
    }
});
