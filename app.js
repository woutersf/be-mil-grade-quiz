// Belgian Military Ranks Quiz - Game Logic

let currentQuiz = {
    questions: [],
    currentQuestion: 0,
    score: 0,
    errors: [],
    selectedComponents: []
};

// Start Quiz
function startQuiz(mode) {
    // Get selected components
    const landChecked = document.getElementById('land-component').checked;
    const airChecked = document.getElementById('air-component').checked;
    const marineChecked = document.getElementById('marine-component').checked;
    const medicalChecked = document.getElementById('medical-component').checked;
    const functionSignsChecked = document.getElementById('function-signs').checked;

    if (!landChecked && !airChecked && !marineChecked && !medicalChecked && !functionSignsChecked) {
        document.getElementById('selection-error').classList.remove('d-none');
        return;
    }

    document.getElementById('selection-error').classList.add('d-none');

    // Build available ranks pool
    let availableRanks = [];
    if (landChecked) {
        availableRanks = availableRanks.concat(ranksData.land.map(r => ({ ...r, component: 'Land Component' })));
    }
    if (airChecked) {
        availableRanks = availableRanks.concat(ranksData.air.map(r => ({ ...r, component: 'Air Component' })));
    }
    if (marineChecked) {
        availableRanks = availableRanks.concat(ranksData.marine.map(r => ({ ...r, component: 'Marine Component' })));
    }
    if (medicalChecked) {
        availableRanks = availableRanks.concat(ranksData.medical.map(r => ({ ...r, component: 'Medische Component' })));
    }
    if (functionSignsChecked) {
        availableRanks = availableRanks.concat(ranksData.function_signs.map(r => ({ ...r, component: 'Functieteken' })));
    }

    // Shuffle and select questions
    shuffleArray(availableRanks);

    let numQuestions;
    if (mode === 'all') {
        numQuestions = availableRanks.length;
    } else {
        numQuestions = Math.min(mode, availableRanks.length);
    }

    currentQuiz.questions = availableRanks.slice(0, numQuestions);
    currentQuiz.currentQuestion = 0;
    currentQuiz.score = 0;
    currentQuiz.errors = [];
    currentQuiz.selectedComponents = [];
    if (landChecked) currentQuiz.selectedComponents.push('land');
    if (airChecked) currentQuiz.selectedComponents.push('air');
    if (marineChecked) currentQuiz.selectedComponents.push('marine');
    if (medicalChecked) currentQuiz.selectedComponents.push('medical');
    if (functionSignsChecked) currentQuiz.selectedComponents.push('function_signs');

    // Show quiz screen
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('quiz-screen').classList.remove('d-none');
    document.getElementById('results-screen').classList.add('d-none');

    showQuestion();
}

// Show current question
function showQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];

    // Update counter
    document.getElementById('question-counter').textContent =
        `Question ${currentQuiz.currentQuestion + 1}/${currentQuiz.questions.length}`;
    document.getElementById('score-counter').textContent =
        `Score: ${currentQuiz.score}/${currentQuiz.currentQuestion}`;

    // Show insignia
    document.getElementById('insignia-image').src = question.image;
    document.getElementById('component-label').textContent = question.component;

    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(question);
    const allAnswers = [question.name, ...wrongAnswers];
    shuffleArray(allAnswers);

    // Create answer buttons
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary answer-btn';
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer, question.name);
        optionsContainer.appendChild(button);
    });

    // Hide feedback
    document.getElementById('feedback').classList.add('d-none');
}

// Generate 2 wrong answers
function generateWrongAnswers(correctQuestion) {
    let allRanks = [];
    currentQuiz.selectedComponents.forEach(comp => {
        ranksData[comp].forEach(rank => {
            allRanks.push(rank.name);
        });
    });

    // Remove correct answer
    allRanks = allRanks.filter(name => name !== correctQuestion.name);

    // Shuffle and take 2
    shuffleArray(allRanks);
    return allRanks.slice(0, 2);
}

// Check answer
function checkAnswer(selected, correct) {
    const isCorrect = selected === correct;

    // Disable all buttons
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add('btn-correct');
            btn.classList.remove('btn-outline-primary');
        }
        if (btn.textContent === selected && !isCorrect) {
            btn.classList.add('btn-incorrect');
            btn.classList.remove('btn-outline-primary');
        }
    });

    // Show feedback
    const feedbackDiv = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');

    if (isCorrect) {
        feedbackDiv.className = 'alert alert-success mt-3';
        feedbackText.textContent = '✓ Correct!';
        currentQuiz.score++;
    } else {
        feedbackDiv.className = 'alert alert-danger mt-3';
        feedbackText.textContent = `✗ Incorrect. The correct answer is: ${correct}`;

        // Store error
        currentQuiz.errors.push({
            question: currentQuiz.questions[currentQuiz.currentQuestion],
            userAnswer: selected,
            correctAnswer: correct
        });
    }

    feedbackDiv.classList.remove('d-none');

    // Move to next question after delay
    setTimeout(() => {
        currentQuiz.currentQuestion++;

        if (currentQuiz.currentQuestion < currentQuiz.questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Show results
function showResults() {
    document.getElementById('quiz-screen').classList.add('d-none');
    document.getElementById('results-screen').classList.remove('d-none');

    const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);

    document.getElementById('final-score').textContent =
        `Score: ${currentQuiz.score} / ${currentQuiz.questions.length}`;
    document.getElementById('score-percentage').textContent =
        `${percentage}% correct`;

    // Show errors if any
    const errorsSection = document.getElementById('errors-section');
    const errorsList = document.getElementById('errors-list');

    if (currentQuiz.errors.length === 0) {
        errorsSection.innerHTML = `
            <div class="alert alert-success">
                <h4 class="alert-heading">🎉 Wow, you did super good. Awesome!</h4>
                <p class="mb-0"><strong>Perfect!</strong> No mistakes!</p>
            </div>
            <div class="card mt-3" style="background-color: #f8f9fa; border: 2px solid #28a745;">
                <div class="card-body">
                    <p class="mb-3">
                        It cost me some time building this, and I'm providing this for free.
                        If you found this helpful, you can pay me back by:
                    </p>
                    <div class="d-grid gap-2">
                        <a href="https://www.linkedin.com/in/woutersfrederik/"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="btn btn-primary">
                            Connect with me on LinkedIn
                        </a>
                        <a href="https://www.buymeacoffee.com/woutersf"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="btn btn-success">
                            ☕ Buy me a coffee
                        </a>
                    </div>
                </div>
            </div>
        `;
    } else {
        errorsList.innerHTML = '';

        currentQuiz.errors.forEach((error, index) => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-item';
            errorDiv.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <img src="${error.question.image}" alt="Insignia" class="error-insignia">
                        <p class="text-muted small mt-2">${error.question.component}</p>
                    </div>
                    <div class="col-md-9">
                        <p class="mb-2"><strong>Question ${currentQuiz.questions.indexOf(error.question) + 1}</strong></p>
                        <p class="mb-1"><span class="text-incorrect">Your answer:</span> ${error.userAnswer}</p>
                        <p class="mb-0"><span class="text-correct">Correct answer:</span> ${error.correctAnswer}</p>
                    </div>
                </div>
            `;
            errorsList.appendChild(errorDiv);
        });
    }
}

// Restart quiz with same settings
function restartQuiz() {
    // Re-select the same components
    const components = currentQuiz.selectedComponents;

    // Determine the mode
    const totalQuestions = currentQuiz.questions.length;
    let mode;
    if (totalQuestions === 10) mode = 10;
    else if (totalQuestions === 20) mode = 20;
    else mode = 'all';

    startQuiz(mode);
}

// Back to start
function backToStart() {
    document.getElementById('results-screen').classList.add('d-none');
    document.getElementById('start-screen').classList.remove('d-none');
}

// Utility: Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
