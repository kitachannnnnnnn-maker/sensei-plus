let slides = JSON.parse(localStorage.getItem('slidesData')) || [
    { id: 0, title: 'スライドタイトル', content: 'スライドの内容', bgColor: '#3b82f6' }
];
let currentSlideIndex = 0;

function updateSlide() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const bgColor = document.getElementById('bg-color').value;

    slides[currentSlideIndex] = {
        id: slides[currentSlideIndex].id,
        title,
        content,
        bgColor
    };

    renderPreview();
    renderThumbnails();
    saveData();
}

function renderPreview() {
    const slide = slides[currentSlideIndex];
    const preview = document.getElementById('slide-preview');

    document.getElementById('slide-title').textContent = slide.title;
    document.getElementById('slide-content').textContent = slide.content;
    preview.style.background = `linear-gradient(135deg, ${slide.bgColor}, ${adjustBrightness(slide.bgColor, 30)})`;

    document.getElementById('title').value = slide.title;
    document.getElementById('content').value = slide.content;
    document.getElementById('bg-color').value = slide.bgColor;
    document.getElementById('slide-counter').textContent = `${currentSlideIndex + 1} / ${slides.length}`;
}

function renderThumbnails() {
    const container = document.getElementById('slides-thumbnails');
    container.innerHTML = '';

    slides.forEach((slide, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${index === currentSlideIndex ? 'active' : ''}`;
        thumb.style.background = slide.bgColor;
        thumb.innerHTML = `<span>${index + 1}</span>`;
        thumb.onclick = () => goToSlide(index);
        container.appendChild(thumb);
    });
}

function addSlide() {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 0;
    slides.push({
        id: newId,
        title: `スライド${slides.length + 1}`,
        content: '内容を入力してください',
        bgColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    });
    currentSlideIndex = slides.length - 1;
    saveData();
    renderPreview();
    renderThumbnails();
}

function removeSlide() {
    if (slides.length === 1) {
        alert('最後のスライドは削除できません');
        return;
    }
    if (confirm('このスライドを削除してもいいですか？')) {
        slides.splice(currentSlideIndex, 1);
        if (currentSlideIndex >= slides.length) currentSlideIndex--;
        saveData();
        renderPreview();
        renderThumbnails();
    }
}

function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderPreview();
        renderThumbnails();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderPreview();
        renderThumbnails();
    }
}

function goToSlide(index) {
    currentSlideIndex = index;
    renderPreview();
    renderThumbnails();
}

function downloadSlides() {
    const json = JSON.stringify(slides, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json,' + encodeURIComponent(json));
    element.setAttribute('download', 'slides.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function saveData() {
    localStorage.setItem('slidesData', JSON.stringify(slides));
}

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

window.onload = () => {
    renderPreview();
    renderThumbnails();
};
