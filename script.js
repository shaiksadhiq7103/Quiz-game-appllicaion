// Array containing diverse structural dataset requirements
const quizData = [
    {
        type: "single",
        question: "Which programming language runs natively inside web browsers?",
        hint: "Select one answer",
        options: ["Python", "Java", "JavaScript", "C++"],
        answer: "JavaScript"
    },
    {
        type: "multi",
        question: "Which of the following are valid CSS position property values? (Select all that apply)",
        hint: "Select multiple options",
        options: ["static", "relative", "hidden", "sticky"],
        answers: ["static", "relative", "sticky"]
    },
    {
        type: "blank",
        question: "What tag is used to reference external CSS architecture sheets inside HTML documents?",
        hint: "Type your answer (case-insensitive)",
        answer: "link"
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Target Selectors
const questionNumEl = document.getElementById('question-number');
const progressFill = document.getElementById('progress-fill');
const quizCard = document.getElementById('quiz-card');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const answerContainer = document.getElementById('answer-container');
const nextBtn = document.getElementById('next-btn');
const resultCard = document.getElementById('result-card');
const finalScoreEl = document.getElementById('final-score');
const totalScoreEl = document.getElementById('total-score');
const scoreCommentary = document.getElementById('score-commentary');
const retryBtn = document.getElementById('retry-btn');

function loadQuestion() {
    // Clear display slate
    answerContainer.innerHTML = '';
    
    const currentQuiz = quizData[currentQuestionIndex];
    
    // Process top metadata
    questionNumEl.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    progressFill.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;
    
    questionText.textContent = currentQuiz.question;
    questionHint.textContent = currentQuiz.hint;

    // Render Input architecture depending on current dataset context properties
    if (currentQuiz.type === "single" || currentQuiz.type === "multi") {
        const inputType = currentQuiz.type === "single" ? "radio" : "checkbox";
        
        currentQuiz.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            
            const input = document.createElement('input');
            input.type = inputType;
            input.name = "quiz-option";
            input.value = option;
            
            // Event listener to toggle styles on check states
            input.addEventListener('change', () => {
                if (inputType === "radio") {
                    document.querySelectorAll('.option-label').forEach(el => el.classList.remove('selected'));
                }
                label.classList.toggle('selected', input.checked);
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            answerContainer.appendChild(label);
        });
    } else if (currentQuiz.type === "blank") {
        const input = document.createElement('input');
        input.type = "text";
        input.className = "text-input";
        input.placeholder = "Type your answer here...";
        input.id = "blank-input";
        answerContainer.appendChild(input);
    }
}

function evaluateAndNext() {
    const currentQuiz = quizData[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuiz.type === "single") {
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        if (selectedOption && selectedOption.value === currentQuiz.answer) {
            isCorrect = true;
        }
    } else if (currentQuiz.type === "multi") {
        const checkedOptions = Array.from(document.querySelectorAll('input[name="quiz-option"]:checked')).map(el => el.value);
        
        // Match lengths and confirm every required answer string element is checked
        const matchAll = checkedOptions.length === currentQuiz.answers.length && 
                         checkedOptions.every(val => currentQuiz.answers.includes(val));
        if (matchAll) isCorrect = true;
    } else if (currentQuiz.type === "blank") {
        const textValue = document.getElementById('blank-input').value.trim().toLowerCase();
        if (textValue === currentQuiz.answer.toLowerCase()) {
            isCorrect = true;
        }
    }

    if (isCorrect) score++;

    // Cycle tracking updates
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    // Hide active components and pop results
    quizCard.classList.add('hidden');
    nextBtn.classList.add('hidden');
    questionNumEl.classList.add('hidden');
    progressFill.style.width = "100%";
    
    resultCard.classList.remove('hidden');
    
    finalScoreEl.textContent = score;
    totalScoreEl.textContent = quizData.length;

    // Commentary mapping conditional blocks
    if (score === quizData.length) {
        scoreCommentary.textContent = "Perfect score! Outstanding job.";
    } else if (score >= quizData.length / 2) {
        scoreCommentary.textContent = "Good effort! You've got a solid grasp.";
    } else {
        scoreCommentary.textContent = "Keep practicing! Give it another shot.";
    }
}

function resetQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    
    resultCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    questionNumEl.classList.remove('hidden');
    
    loadQuestion();
}

// Global Event Mapping hooks
nextBtn.addEventListener('click', evaluateAndNext);
retryBtn.addEventListener('click', resetQuiz);

// Initialize App View
loadQuestion();