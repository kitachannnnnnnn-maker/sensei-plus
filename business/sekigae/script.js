
const ROWS = 5;
const COLS = 8;
let currentSeats = [];
let manualEmptySeats = new Set();
let isEmptySettingMode = false;

window.onload = function () {
    const savedStudents = localStorage.getItem('daisho_students_data');
    const savedPattern = localStorage.getItem('daisho_gender_pattern');
    const savedManualEmpty = localStorage.getItem('daisho_manual_empty');
    const savedCurrentSeats = localStorage.getItem('daisho_current_seats');

    if (savedPattern) {
        document.getElementById("gender-pattern").value = savedPattern;
    }
    if (savedManualEmpty) {
        manualEmptySeats = new Set(JSON.parse(savedManualEmpty));
    }

    if (savedStudents) {
        const students = JSON.parse(savedStudents);
        const tbody = document.querySelector("#student-table tbody");
        tbody.innerHTML = "";
        students.forEach((st, idx) => {
            const tr = document.createElement("tr");
            const genderHtml = `<select onchange="saveData()"><option value="M" ${st.gender === 'M' ? 'selected' : ''}>男</option><option value="F" ${st.gender === 'F' ? 'selected' : ''}>女</option></select>`;
            const seatOptions = createSeatOptions(st.fixSeat);

            tr.innerHTML = `
                        <td class="row-num">${idx + 1}</td>
                        <td><input type="text" value="${st.name}" oninput="onNameInput()"></td>
                        <td>${genderHtml}</td>
                        <td><input type="checkbox" ${st.eye ? 'checked' : ''} onchange="saveData()"></td>
                        <td><input type="checkbox" ${st.front ? 'checked' : ''} onchange="saveData()"></td>
                        <td><input type="checkbox" ${st.leader ? 'checked' : ''} onchange="saveData()"></td>
                        <td>
                            <div class="avoid-container">
                                <div class="avoid-trigger" onclick="toggleAvoidDropdown(this)">選択...</div>
                                <div class="avoid-dropdown" data-num="${idx + 1}"></div>
                            </div>
                        </td>
                        <td><select class="select-fix" onchange="saveData()">${seatOptions}</select></td>
                        <td><button class="btn-delete" onclick="deleteRow(this)">❌</button></td>
                    `;
            tbody.appendChild(tr);
        });
        updateAllAvoidDropdowns(true);
    } else {
        for (let i = 0; i < 35; i++) {
            addStudentRow(false);
        }
        updateAllAvoidDropdowns();
    }

    if (savedCurrentSeats) {
        currentSeats = JSON.parse(savedCurrentSeats);
        renderChart();
    } else {
        generateSeating();
    }

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.avoid-container')) {
            document.querySelectorAll('.avoid-dropdown').forEach(d => d.style.display = 'none');
        }
    });
};

function createSeatOptions(selectedVal = "0") {
    let html = `<option value="0" ${selectedVal === "0" ? 'selected' : ''}>-</option>`;
    for (let i = 1; i <= ROWS * COLS; i++) {
        html += `<option value="${i}" ${selectedVal == i.toString() ? 'selected' : ''}>${i}番</option>`;
    }
    return html;
}

function addStudentRow(shouldSave = true) {
    const tbody = document.querySelector("#student-table tbody");
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    updateRowNumbers();
    updateAllAvoidDropdowns();
    if (shouldSave) saveData();
}

function updateRowNumbers() {
    const rows = document.querySelectorAll("#student-table tbody tr");
    rows.forEach((row, idx) => {
        const num = idx + 1;
        if (row.innerHTML === "") {
            const gender = num % 2 === 0 ? "F" : "M";
            row.innerHTML = `
                        <td class="row-num">${num}</td>
                        <td><input type="text" value="児童${num}" oninput="onNameInput()"></td>
                        <td><select onchange="saveData()"><option value="M" ${gender === 'M' ? 'selected' : ''}>男</option><option value="F" ${gender === 'F' ? 'selected' : ''}>女</option></select></td>
                        <td><input type="checkbox" onchange="saveData()"></td>
                        <td><input type="checkbox" onchange="saveData()"></td>
                        <td><input type="checkbox" onchange="saveData()"></td>
                        <td>
                            <div class="avoid-container">
                                <div class="avoid-trigger" onclick="toggleAvoidDropdown(this)">選択...</div>
                                <div class="avoid-dropdown" data-num="${num}"></div>
                            </div>
                        </td>
                        <td><select class="select-fix" onchange="saveData()">${createSeatOptions()}</select></td>
                        <td><button class="btn-delete" onclick="deleteRow(this)">❌</button></td>
                    `;
        } else {
            row.querySelector(".row-num").textContent = num;
            row.querySelector(".avoid-dropdown").dataset.num = num;
        }
    });
}

function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateRowNumbers();
    updateAllAvoidDropdowns();
    saveData();
}

// 名前が変更されたときに選択肢をリアルタイム更新する処理
function onNameInput() {
    updateAllAvoidDropdowns(false, true);
    saveData();
}

function updateAllAvoidDropdowns(isFirstLoad = false, isNameTyping = false) {
    const rows = document.querySelectorAll("#student-table tbody tr");
    const totalStudents = rows.length;

    // 事前に現在のすべての「名前」と「出席番号」のリストを作成
    let studentList = [];
    rows.forEach((row, idx) => {
        const nameInput = row.cells[1].querySelector("input");
        const name = nameInput ? nameInput.value.trim() : `児童${idx + 1}`;
        studentList.push({ id: idx + 1, name: name });
    });

    let savedStudents = [];
    if (isFirstLoad) {
        const data = localStorage.getItem('daisho_students_data');
        if (data) savedStudents = JSON.parse(data);
    }

    rows.forEach((row, idx) => {
        const myNum = idx + 1;
        const dropdown = row.querySelector(".avoid-dropdown");
        if (!dropdown) return;

        let checkedValues = new Set();
        if (isFirstLoad && savedStudents[idx] && savedStudents[idx].avoidIds) {
            checkedValues = new Set(savedStudents[idx].avoidIds);
        } else {
            dropdown.querySelectorAll("input:checked").forEach(cb => checkedValues.add(parseInt(cb.value)));
        }

        dropdown.innerHTML = "";
        studentList.forEach(st => {
            if (st.id === myNum) return;
            const lbl = document.createElement("label");
            const isChecked = checkedValues.has(st.id) ? "checked" : "";
            lbl.innerHTML = `<input type="checkbox" value="${st.id}" ${isChecked} onchange="updateAvoidTriggerText(this)"> ${st.name}`;
            dropdown.appendChild(lbl);
        });

        const trigger = row.querySelector(".avoid-trigger");
        const currentCheckedNames = studentList
            .filter(st => checkedValues.has(st.id))
            .map(st => st.name);

        trigger.textContent = currentCheckedNames.length > 0 ? currentCheckedNames.join(",") : "選択...";
    });
}

function toggleAvoidDropdown(trigger) {
    const dropdown = trigger.nextElementSibling;
    const isTargetOpen = dropdown.style.display === 'block';
    document.querySelectorAll('.avoid-dropdown').forEach(d => d.style.display = 'none');
    if (!isTargetOpen) dropdown.style.display = 'block';
}

function updateAvoidTriggerText(cb) {
    const dropdown = cb.closest('.avoid-dropdown');
    const trigger = dropdown.previousElementSibling;

    // チェックされたIDに対応する最新の名前を取得
    const rows = document.querySelectorAll("#student-table tbody tr");
    const checkedIds = Array.from(dropdown.querySelectorAll("input:checked")).map(c => parseInt(c.value));

    let checkedNames = [];
    checkedIds.forEach(id => {
        const targetRow = rows[id - 1];
        if (targetRow) {
            const name = targetRow.cells[1].querySelector("input").value.trim();
            checkedNames.push(name);
        }
    });

    trigger.textContent = checkedNames.length > 0 ? checkedNames.join(",") : "選択...";
    saveData();
}

function toggleEmptyMode() {
    isEmptySettingMode = !isEmptySettingMode;
    const btn = document.getElementById("empty-mode-btn");
    if (isEmptySettingMode) {
        btn.classList.add("active");
        btn.textContent = "🚀 空席指定中（座席表をクリック！終わったら再度ここを押す）";
    } else {
        btn.classList.remove("active");
        btn.textContent = "🖱️ 座席クリックで空席を指定するモード";
        saveAndGenerate();
    }
    renderChart();
}

function getStudentData() {
    const rows = document.querySelectorAll("#student-table tbody tr");
    let students = [];
    rows.forEach((row, idx) => {
        const num = idx + 1;

        const nameInput = row.cells[1].querySelector("input");
        if (!nameInput) return;
        const name = nameInput.value.trim();
        if (!name) return;

        const dropdown = row.querySelector(".avoid-dropdown");
        const avoidArray = dropdown ? Array.from(dropdown.querySelectorAll("input:checked")).map(cb => parseInt(cb.value)) : [];

        students.push({
            id: num,
            name: name,
            gender: row.cells[2].querySelector("select").value,
            eye: row.cells[3].querySelector("input").checked,
            front: row.cells[4].querySelector("input").checked,
            leader: row.cells[5].querySelector("input").checked,
            avoidIds: avoidArray,
            fixSeat: row.cells[7].querySelector(".select-fix").value,
            isStaticEmpty: false
        });
    });
    return students;
}

function saveData() {
    const students = getStudentData();
    const pattern = document.getElementById("gender-pattern").value;
    localStorage.setItem('daisho_students_data', JSON.stringify(students));
    localStorage.setItem('daisho_gender_pattern', pattern);
    localStorage.setItem('daisho_manual_empty', JSON.stringify(Array.from(manualEmptySeats)));
    localStorage.setItem('daisho_current_seats', JSON.stringify(currentSeats));
}

function clearAllData() {
    if (confirm("名簿データと席替えの結果をすべて消去して初期状態に戻します。よろしいですか？")) {
        localStorage.clear();
        location.reload();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getTargetGender(index, pattern) {
    if (pattern === 'none') return null;
    const rowIdx = Math.floor(index / COLS);
    const colIdx = index % COLS;
    return pattern === 'checker' ? ((rowIdx + colIdx) % 2 === 0 ? "M" : "F") : (colIdx % 2 === 0 ? "M" : "F");
}

function getBlockId(index) {
    const rowIdx = Math.floor(index / COLS);
    const colIdx = index % COLS;
    const blockCol = Math.floor(colIdx / 2);
    const blockRow = rowIdx < 3 ? 0 : 1;
    return blockRow * 4 + blockCol;
}

function getNeighbors8(index) {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    let list = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                list.push(nr * COLS + nc);
            }
        }
    }
    return list;
}

function hasAvoidConflict(seats) {
    for (let i = 0; i < seats.length; i++) {
        const student = seats[i];
        if (!student || student.isStaticEmpty || !student.avoidIds || student.avoidIds.length === 0) continue;

        const neighbors = getNeighbors8(i);
        for (let nIdx of neighbors) {
            const neighbor = seats[nIdx];
            if (neighbor && !neighbor.isStaticEmpty && student.avoidIds.includes(neighbor.id)) {
                return true;
            }
        }
    }
    return false;
}

function saveAndGenerate() {
    generateSeating();
    saveData();
}

function generateSeating() {
    const pattern = document.getElementById("gender-pattern").value;
    let success = false;
    let seats = [];
    let attempts = 0;

    const totalSeats = ROWS * COLS;
    let students = getStudentData();

    if (students.length > totalSeats) {
        alert(`生徒数が座席数(${totalSeats})を超えています！`);
        return;
    }

    const totalEmptyNeeded = totalSeats - students.length;

    while (!success && attempts < 1000) {
        attempts++;
        seats = Array(totalSeats).fill(null);

        let currentEmptyPlaced = 0;
        manualEmptySeats.forEach(pos => {
            if (pos < totalSeats && currentEmptyPlaced < totalEmptyNeeded) {
                seats[pos] = { name: "空席", gender: "E", eye: false, front: false, avoidIds: [], fixSeat: "0", isStaticEmpty: true };
                currentEmptyPlaced++;
            }
        });

        for (let i = totalSeats - 1; i >= 0; i--) {
            if (currentEmptyPlaced >= totalEmptyNeeded) break;
            if (seats[i] === null) {
                seats[i] = { name: "空席", gender: "E", eye: false, front: false, avoidIds: [], fixSeat: "0", isStaticEmpty: true };
                currentEmptyPlaced++;
            }
        }

        let remainingStudents = [];
        students.forEach(st => {
            const fixPos = parseInt(st.fixSeat) - 1;
            if (fixPos >= 0 && fixPos < totalSeats && seats[fixPos] === null) {
                seats[fixPos] = st;
            } else {
                remainingStudents.push(st);
            }
        });

        let leaderStudents = [];
        let frontStudents = [];
        let normalStudents = [];

        remainingStudents.forEach(st => {
            if (st.leader) leaderStudents.push(st);
            else if (st.eye || st.front) frontStudents.push(st);
            else normalStudents.push(st);
        });

        shuffle(leaderStudents);
        shuffle(frontStudents);
        shuffle(normalStudents);

        let blockLeaderCounts = Array(8).fill(0);
        seats.forEach((s, idx) => { if (s && s.leader) blockLeaderCounts[getBlockId(idx)]++; });

        let unplacedLeaders = [];
        leaderStudents.forEach(st => {
            let minBlockId = -1;
            let minCount = 999;
            for (let b = 0; b < 8; b++) {
                if (blockLeaderCounts[b] < minCount) {
                    let hasSpace = false;
                    for (let i = 0; i < totalSeats; i++) {
                        if (seats[i] === null && getBlockId(i) === b) { hasSpace = true; break; }
                    }
                    if (hasSpace) { minCount = blockLeaderCounts[b]; minBlockId = b; }
                }
            }

            if (minBlockId !== -1) {
                let placed = false;
                for (let i = 0; i < totalSeats; i++) {
                    if (seats[i] === null && getBlockId(i) === minBlockId) {
                        const targetGender = getTargetGender(i, pattern);
                        if (!targetGender || st.gender === targetGender) {
                            seats[i] = st; placed = true; blockLeaderCounts[minBlockId]++; break;
                        }
                    }
                }
                if (!placed) {
                    for (let i = 0; i < totalSeats; i++) {
                        if (seats[i] === null && getBlockId(i) === minBlockId) {
                            seats[i] = st; placed = true; blockLeaderCounts[minBlockId]++; break;
                        }
                    }
                }
                if (!placed) unplacedLeaders.push(st);
            } else {
                unplacedLeaders.push(st);
            }
        });
        frontStudents = frontStudents.concat(unplacedLeaders);

        for (let i = 0; i < 16; i++) {
            if (seats[i] === null && frontStudents.length > 0) {
                const targetGender = getTargetGender(i, pattern);
                let matchIdx = targetGender ? frontStudents.findIndex(st => st.gender === targetGender) : 0;
                if (matchIdx === -1) matchIdx = 0;
                seats[i] = frontStudents.splice(matchIdx, 1)[0];
            }
        }
        if (frontStudents.length > 0) normalStudents = frontStudents.concat(normalStudents);

        for (let i = 0; i < totalSeats; i++) {
            if (seats[i] === null) {
                const targetGender = getTargetGender(i, pattern);
                let matchIdx = (targetGender && pattern !== 'none') ? normalStudents.findIndex(st => st.gender === targetGender) : 0;
                if (matchIdx === -1) matchIdx = 0;
                if (normalStudents.length > 0) {
                    seats[i] = normalStudents.splice(matchIdx, 1)[0];
                }
            }
        }

        if (!hasAvoidConflict(seats)) success = true;
    }

    currentSeats = seats;
    renderChart();
}

function handleSeatClick(index) {
    if (!isEmptySettingMode) return;
    if (manualEmptySeats.has(index)) {
        manualEmptySeats.delete(index);
    } else {
        manualEmptySeats.add(index);
    }
    saveAndGenerate();
}

function renderChart() {
    const grid = document.getElementById('seating-chart');
    grid.innerHTML = '';
    const pattern = document.getElementById("gender-pattern").value;

    currentSeats.forEach((student, index) => {
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        seatDiv.dataset.index = index;

        if (isEmptySettingMode) {
            seatDiv.classList.add('clickable-empty-mode');
            seatDiv.draggable = false;
        } else {
            seatDiv.draggable = true;
            seatDiv.addEventListener('dragstart', dragStart);
            seatDiv.addEventListener('dragover', dragOver);
            seatDiv.addEventListener('drop', dragDrop);
        }

        seatDiv.onclick = () => handleSeatClick(index);

        if (student.gender === 'M') seatDiv.classList.add('male');
        else if (student.gender === 'F') seatDiv.classList.add('female');
        else seatDiv.classList.add('empty-seat');

        const rowIdx = Math.floor(index / COLS);
        let isWarn = false;
        let badges = [];

        if (student && !student.isStaticEmpty) {
            seatDiv.innerHTML = `<span class="seat-num">${index + 1}</span><div>${student.id}.${student.name}</div>`;

            if (student.leader) badges.push("リーダー⭐");

            if ((student.eye || student.front) && rowIdx > 1) {
                isWarn = true;
                if (student.eye) badges.push("視力⚠️");
                if (student.front) badges.push("前方⚠️");
            }

            if (student.avoidIds && student.avoidIds.length > 0) {
                const neighbors = getNeighbors8(index);
                neighbors.forEach(nIdx => {
                    const neighborStudent = currentSeats[nIdx];
                    if (neighborStudent && !neighborStudent.isStaticEmpty && student.avoidIds.includes(neighborStudent.id)) {
                        isWarn = true;
                        if (!badges.includes("近接⚠️")) badges.push("近接⚠️");
                    }
                });
            }

            if (pattern !== 'none') {
                const leftIdx = index - 1;
                const rightIdx = index + 1;
                [leftIdx, rightIdx].forEach(nIdx => {
                    if (nIdx >= 0 && nIdx < ROWS * COLS && Math.floor(index / COLS) === Math.floor(nIdx / COLS)) {
                        const neighborStudent = currentSeats[nIdx];
                        if (neighborStudent && !neighborStudent.isStaticEmpty && neighborStudent.gender === student.gender) {
                            if (!badges.includes("同性隣⚠️")) badges.push("同性隣⚠️");
                        }
                    }
                });
            }

            if (student.fixSeat !== "0") badges.push("固定");
        } else {
            seatDiv.innerHTML = `<span class="seat-num">${index + 1}</span><div>空席</div>`;
        }

        if (isWarn) seatDiv.classList.add('alert-warn');
        if (badges.length > 0) {
            seatDiv.innerHTML += `<div>${badges.map(b => `<span class="seat-badge ${b == 'リーダー⭐' ? 'badge-leader' : ''}">${b}</span>`).join('')}</div>`;
        }

        grid.appendChild(seatDiv);
    });
}

let draggedIndex = null;
function dragStart(e) { draggedIndex = this.dataset.index; }
function dragOver(e) { e.preventDefault(); }
function dragDrop(e) {
    const targetIndex = this.dataset.index;
    const temp = currentSeats[draggedIndex];
    currentSeats[draggedIndex] = currentSeats[targetIndex];
    currentSeats[targetIndex] = temp;
    renderChart();
    saveData();
}
