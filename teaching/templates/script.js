let plans = JSON.parse(localStorage.getItem('teachingPlans')) || [];

function addMaterial() {
    const list = document.getElementById('materials-list');
    const item = document.createElement('div');
    item.className = 'material-item';
    item.innerHTML = `
        <input type="text" class="material-input" placeholder="準備物を入力">
        <button onclick="this.parentElement.remove()">削除</button>
    `;
    list.appendChild(item);
}

function getMaterials() {
    const inputs = document.querySelectorAll('.material-input');
    return Array.from(inputs).map(input => input.value).filter(v => v);
}

function savePlan() {
    const plan = {
        id: Date.now(),
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        class: document.getElementById('class').value,
        date: document.getElementById('date').value,
        title: document.getElementById('title').value,
        objective: document.getElementById('objective').value,
        introduction: document.getElementById('introduction').value,
        development: document.getElementById('development').value,
        conclusion: document.getElementById('conclusion').value,
        materials: getMaterials(),
        evaluation: document.getElementById('evaluation').value,
        createdAt: new Date().toLocaleDateString('ja-JP')
    };

    if (!plan.subject || !plan.title) {
        alert('教科と単元・課題は必須です');
        return;
    }

    plans.push(plan);
    localStorage.setItem('teachingPlans', JSON.stringify(plans));
    alert('授業案を保存しました！');
    clearForm();
    renderSavedPlans();
}

function clearForm() {
    document.getElementById('subject').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('class').value = '';
    document.getElementById('date').value = '';
    document.getElementById('title').value = '';
    document.getElementById('objective').value = '';
    document.getElementById('introduction').value = '';
    document.getElementById('development').value = '';
    document.getElementById('conclusion').value = '';
    document.getElementById('evaluation').value = '';
    document.getElementById('materials-list').innerHTML = '';
}

function clearPlan() {
    if (confirm('入力内容をすべてクリアしてもいいですか？')) {
        clearForm();
    }
}

function downloadPlan() {
    const plan = {
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        class: document.getElementById('class').value,
        date: document.getElementById('date').value,
        title: document.getElementById('title').value,
        objective: document.getElementById('objective').value,
        introduction: document.getElementById('introduction').value,
        development: document.getElementById('development').value,
        conclusion: document.getElementById('conclusion').value,
        materials: getMaterials(),
        evaluation: document.getElementById('evaluation').value
    };

    const json = JSON.stringify(plan, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json,' + encodeURIComponent(json));
    element.setAttribute('download', `lesson_plan_${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function renderSavedPlans() {
    const container = document.getElementById('saved-plans');
    container.innerHTML = '';

    if (plans.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">保存されたプランはありません</p>';
        return;
    }

    plans.reverse().forEach(plan => {
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.innerHTML = `
            <div class="plan-info">
                <div class="plan-title">${plan.title}</div>
                <div class="plan-meta">${plan.subject} ${plan.grade}${plan.class} - ${plan.createdAt}</div>
            </div>
            <div class="plan-actions">
                <button class="plan-btn plan-load" onclick="loadPlan(${plan.id})">読込</button>
                <button class="plan-btn plan-delete" onclick="deletePlan(${plan.id})">削除</button>
            </div>
        `;
        container.appendChild(card);
    });

    plans.reverse();
}

function loadPlan(id) {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    document.getElementById('subject').value = plan.subject;
    document.getElementById('grade').value = plan.grade;
    document.getElementById('class').value = plan.class;
    document.getElementById('date').value = plan.date;
    document.getElementById('title').value = plan.title;
    document.getElementById('objective').value = plan.objective;
    document.getElementById('introduction').value = plan.introduction;
    document.getElementById('development').value = plan.development;
    document.getElementById('conclusion').value = plan.conclusion;
    document.getElementById('evaluation').value = plan.evaluation;

    const list = document.getElementById('materials-list');
    list.innerHTML = '';
    plan.materials.forEach(material => {
        const item = document.createElement('div');
        item.className = 'material-item';
        item.innerHTML = `
            <input type="text" class="material-input" value="${material}" placeholder="準備物を入力">
            <button onclick="this.parentElement.remove()">削除</button>
        `;
        list.appendChild(item);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deletePlan(id) {
    if (confirm('このプランを削除してもいいですか？')) {
        plans = plans.filter(p => p.id !== id);
        localStorage.setItem('teachingPlans', JSON.stringify(plans));
        renderSavedPlans();
    }
}

window.onload = () => {
    renderSavedPlans();
};
