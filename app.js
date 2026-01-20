let currentChapter = null;
let quizItems = [];
let currentIdx = 0;
let wrongAnswers = new Set();

/**
 * 1. 테마 초기화 및 전환
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
}

/**
 * 2. 앱 초기화 및 메인 화면
 */
function init() {
    const list = document.getElementById('chapter-list');
    if (!list) return;
    list.innerHTML = '';
    PSYCHOLOGY_DATA.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <span class="ch-en">${ch.titleEn}</span>
            <span class="ch-ko">${ch.titleKo}</span>
        `;
        card.onclick = () => openChapter(ch);
        list.appendChild(card);
    });
}

// 페이지 로드 시 테마와 메인 목록 초기화
window.onload = () => {
    initTheme();
    init();
};

/**
 * 3. 단원 관리 및 화면 전환
 */
function openChapter(ch) {
    currentChapter = ch;
    wrongAnswers.clear();
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('study-screen').classList.remove('hidden');
    document.getElementById('chapter-title-display').innerText = ch.titleKo;
    
    switchTabView('summary');
    renderSummary();
    updateReviewNotes();
    
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    btns[0].classList.add('active');
}

function showMainScreen() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('main-screen').classList.remove('hidden');
}

function switchTab(event, tabName) {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    switchTabView(tabName);
}

function switchTabView(tabName) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
    document.getElementById(`${tabName}-view`).classList.remove('hidden');
    if (tabName === 'quiz') startQuiz();
}

/**
 * 4. 요약 렌더링 (명제 타이틀 매핑)
 */
function renderSummary() {
    const container = document.getElementById('summary-list');
    if (!container) return;

    const groups = currentChapter.items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    const categoryLabels = {
        'field': "심리학의 정의 및 분류",
        'scholar': "분트와 현대 심리학의 탄생",
        'theory': "분트의 심리학 및 주요 학파",
        'method': "심리학의 연구방법",
        'variable': "실험의 3요소",
        'structure': "신경세포의 구조와 전달",
        'system': "중추 신경과 말초 신경",
        'brain': "대뇌 및 주요 뇌 부위",
        'lobe': "대뇌피질의 각 부위와 기능",
        'brain-sub': "뇌간(시상/시상하부)의 기능",
        'spinal': "척수의 역할 및 반사",
        'autonomic': "자율 신경(교감/부교감)",
        'condition': "실어증 및 분리 뇌",
        'dev-def': "발달의 정의",
        'dev-method': "발달연구방법",
        'dev-principle': "발달의 원리",
        'piaget': "피아제의 인지발달단계",
        'kohlberg': "콜버그의 도덕성 발달단계",
        'freud': "프로이트의 성격발달단계",
        'erikson': "에릭슨의 인간발달단계",
        'motive-def': "동기의 정의 및 분류",
        'maslow': "매슬로우의 욕구 5단계 모형",
        'bio-motive': "생리적 동기 및 항상성",
        'psych-motive': "심리적 동기(내재/외재)",
        'social-motive': "사회적 동기(친화/달성)",
        'emotion-def': "정서의 정의",
        'emotion-theory': "주요 정서 이론",
        'sens-def': "감각의 정의",
        'sens-meas': "감각의 측정(역치)",
        'sens-law': "감각의 법칙(베버/페히너)",
        'vision': "가시광선",
        'color-theory': "색 지각설",
        'vision-path': "V1의 기능과 시각 경로",
        'sound': "음의 3요소 및 주파수",
        'perc-def': "지각의 정의",
        'gestalt': "체제화 원리",
        'constancy': "지각 항상성",
        'depth-cue': "3차원 지각(단안/양안)",
        'motion': "운동지각의 종류",
        'attention': "선택적 주의",
        'learn-def': "학습의 심리학적 정의",
        'classical': "고전적 조건형성",
        'operant': "조작적 조건 형성 및 강화",
        'schedule': "강화계획",
        'memory-proc': "기억의 과정",
        'memory-type': "기억의 종류",
        'ltm-cat': "장기기억의 분류",
        'forgetting': "기억의 망각과 간섭",
        'representation': "명제 표상",
        'concept': "개념과 범주화",
        'theory-lang': "원형이론 및 가족 유사성",
        'lang-theory': "언어습득이론",
        'lang-dev': "언어발달과정",
        'problem-solving': "문제 해결 및 추론",
        'fixation': "기능적 고착",
        'metric': "신뢰도와 타당도",
        'test-sb': "스탠포드-비네 검사",
        'test-w': "웩슬러 지능검사",
        'intel-def': "지능의 정의 및 유전계수",
        'intel-theory': "지능의 구조 및 요인설",
        'guilford': "길포드의 입체모형설",
        'modern-intel': "지능 이론(카텔/가드너/스턴버그)",
        'trait-theory': "성격 특성이론",
        'psycho-level': "프로이트의 정신역동(의식 수준)",
        'psycho-struct': "프로이트의 성격구조",
        'social-learn': "사회학습이론",
        'humanistic': "현상학적 이론(자기이론)",
        'big-five': "성격의 5요인 모델(Big Five)",
        'pers-test': "성격 측정(자기보고/투사법)",
        'stress': "욕구좌절과 갈등",
        'conflict': "갈등의 세 가지 유형",
        'defense': "방어기제의 종류",
        'disorder-diag': "심리적 장애의 진단 기준",
        'psychosis': "정신병의 종류",
        'neurotic': "신경증 장애",
        'pers-disorder': "성격장애의 분류",
        'attitude': "태도의 구성요소",
        'attitude-theory': "인지부조화이론",
        'persuasion': "태도변화 및 설득 기법",
        'social-influence': "동조현상",
        'impression': "인상형성의 편향",
        'attribution': "귀인의 원리 및 편향",
        'relationship': "친교관계의 형성과 유지",
        'group': "집단의사결정 및 군중심리"
    };

    let html = '';
    for (const [type, items] of Object.entries(groups)) {
        html += `
            <div class="category-group">
                <div class="category-title">${categoryLabels[type] || type}</div>
                ${items.map(item => `
                    <div class="summary-item">
                        <span class="summary-term">${item.term}</span>
                        <p class="summary-desc">${item.desc}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    container.innerHTML = html;
}

/**
 * 5. 퀴즈 엔진
 */
function startQuiz() {
    const shuffledPool = [...currentChapter.items].sort(() => Math.random() - 0.5);
    quizItems = shuffledPool.slice(0, 20);
    currentIdx = 0;
    loadQuestion();
}

function loadQuestion() {
    const item = quizItems[currentIdx];
    const textEl = document.getElementById('question-text');
    
    textEl.style.opacity = 0;
    setTimeout(() => {
        textEl.innerText = item.desc;
        textEl.style.opacity = 1;
    }, 150);

    document.getElementById('quiz-progress').innerText = 
        String(currentIdx + 1).padStart(2, '0') + " / " + String(quizItems.length).padStart(2, '0');
    
    const options = generateOptions(item);
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(btn, opt, item.term);
        container.appendChild(btn);
    });
}

function generateOptions(correctItem) {
    let distractors = currentChapter.items
        .filter(i => i.type === correctItem.type && i.term !== correctItem.term)
        .map(i => i.term);
    
    if (distractors.length < 3) {
        const others = currentChapter.items
            .filter(i => i.term !== correctItem.term && !distractors.includes(i.term))
            .map(i => i.term);
        distractors = [...distractors, ...others.sort(() => Math.random() - 0.5)].slice(0, 3);
    } else {
        distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
    }
    return [correctItem.term, ...distractors].sort(() => Math.random() - 0.5);
}

function checkAnswer(btn, selected, correct) {
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        btns.forEach(b => { if(b.innerText === correct) b.classList.add('correct'); });
        
        const itemData = currentChapter.items.find(i => i.term === correct);
        if (itemData) {
            wrongAnswers.add(itemData);
            updateReviewNotes();
        }
    }

    setTimeout(() => {
        currentIdx++;
        if (currentIdx < quizItems.length) {
            loadQuestion();
        } else {
            const tabs = document.querySelectorAll('.tab-btn');
            tabs.forEach(t => t.classList.remove('active'));
            if (tabs[2]) tabs[2].classList.add('active');
            switchTabView('review');
        }
    }, 1200);
}

/**
 * 6. 오답 노트 및 복습 기능
 */
function updateReviewNotes() {
    const container = document.getElementById('wrong-answer-list');
    if (!container) return;
    if (wrongAnswers.size === 0) {
        container.innerHTML = '<p class="empty-msg">기록된 오답이 없습니다.</p>';
        return;
    }
    container.innerHTML = Array.from(wrongAnswers).map(item => `
        <div class="review-item">
            <span class="review-term">${item.term}</span>
            <p class="review-desc">${item.desc}</p>
        </div>
    `).join('');
}

function retryWrongAnswers() {
    if (wrongAnswers.size === 0) return;

    quizItems = Array.from(wrongAnswers).sort(() => Math.random() - 0.5);
    currentIdx = 0;
    
    wrongAnswers.clear(); 
    updateReviewNotes();

    document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
    document.getElementById('quiz-view').classList.remove('hidden');

    loadQuestion();
    
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (tabs[1]) tabs[1].classList.add('active');
}