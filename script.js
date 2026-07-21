// --------------------
// GLOBAL VARIABLES
// --------------------

let currentQuestion = 0;

let answers = new Array(exam.questions.length).fill(null);

let flagged = new Array(exam.questions.length).fill(false);

let seconds = 35 * 60;

// --------------------
// HTML ELEMENTS
// --------------------

const passageTitle = document.getElementById("passageTitle");
const passageText = document.getElementById("passageText");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");

const choicesDiv = document.getElementById("choices");

const progressBar = document.getElementById("progressBar");

const navigatorDiv = document.getElementById("navigator");

const timer = document.getElementById("timer");

// --------------------
// LOAD PASSAGE
// --------------------

passageTitle.textContent = exam.title;

passageText.textContent = exam.passage;

// --------------------
// TIMER
// --------------------

function updateTimer(){

    let min = Math.floor(seconds / 60);

    let sec = seconds % 60;

    timer.textContent =
        String(min).padStart(2,"0") +
        ":" +
        String(sec).padStart(2,"0");

    if(seconds>0){

        seconds--;

    }else{

        alert("Time is up!");

    }

}

setInterval(updateTimer,1000);

// --------------------
// RENDER QUESTION
// --------------------

function renderQuestion(){

    const q = exam.questions[currentQuestion];

    questionNumber.textContent =
        "Question " +
        (currentQuestion+1) +
        " of " +
        exam.questions.length;

    questionText.textContent = q.question;

    choicesDiv.innerHTML="";

    q.choices.forEach((choice,index)=>{

        const div=document.createElement("div");

        div.className="choice";

        if(answers[currentQuestion]===index){

            div.classList.add("selected");

        }

        div.innerHTML=choice;

        if (!reviewMode) {

        div.onclick = () => {

            answers[currentQuestion] = index;

            renderQuestion();

            renderNavigator();

            };

        }

        choicesDiv.appendChild(div);

    });

    updateProgress();

}

// --------------------
// PROGRESS
// --------------------

function updateProgress(){

    progressBar.style.width=
        ((currentQuestion+1)/exam.questions.length*100)+"%";

}

// --------------------
// NAVIGATOR
// --------------------

function renderNavigator(){

    navigatorDiv.innerHTML="";

    exam.questions.forEach((q,index)=>{

        const btn=document.createElement("button");

        btn.className="navBtn";

        if(reviewMode){

            if(answers[index]===exam.questions[index].answer){

                btn.classList.add("correctNav");

            }else{

                btn.classList.add("incorrectNav");

            }

        }

        btn.innerHTML=index+1;

        if(index===currentQuestion){

            btn.classList.add("current");

        }

        if(answers[index]!=null){

            btn.classList.add("answered");

        }

        if(flagged[index]){

            btn.classList.add("flagged");

        }

        btn.onclick=()=>{

            currentQuestion=index;

            renderQuestion();

            renderNavigator();

        };

        navigatorDiv.appendChild(btn);

    });

}

// --------------------
// BUTTONS
// --------------------

document.getElementById("nextBtn").onclick = () => {

    if (currentQuestion < exam.questions.length - 1) {

        currentQuestion++;

        renderQuestion();

        renderNavigator();

    } else {

        openReview();

    }

};

document.getElementById("prevBtn").onclick=()=>{

    if(currentQuestion>0){

        currentQuestion--;

        renderQuestion();

        renderNavigator();

    }

};

document.getElementById("flagBtn").onclick=()=>{

    flagged[currentQuestion]=!flagged[currentQuestion];

    renderNavigator();

};

// --------------------
// START
// --------------------

renderQuestion();

renderNavigator();

// --------------------
// REVIEW PAGE
// --------------------

function openReview() {

    document.getElementById("main").style.display = "none";
    document.querySelector("footer").style.display = "none";

    const review = document.getElementById("reviewScreen");

    review.classList.remove("hidden");

    const list = document.getElementById("reviewList");

    list.innerHTML = "";

    exam.questions.forEach((q, i) => {

        const div = document.createElement("div");

        div.className = "reviewItem";

        let status = "";

        if (answers[i] == null)
            status = "❌ Unanswered";
        else
            status = "✅ Answered";

        if (flagged[i])
            status += " 🚩";

        div.innerHTML =
            `<strong>Question ${i + 1}</strong> - ${status}`;

        div.onclick = () => {

            review.classList.add("hidden");

            document.getElementById("main").style.display = "flex";
            document.querySelector("footer").style.display = "flex";

            currentQuestion = i;

            renderQuestion();

            renderNavigator();

        };

        list.appendChild(div);

    });

}

// --------------------
// SUBMIT
// --------------------

document.getElementById("submitExam").onclick = ()=>{

    reviewMode = true;

    document.getElementById("reviewScreen")
        .classList.add("hidden");

    document.getElementById("main")
        .style.display="flex";

    document.querySelector("footer")
        .style.display="flex";
    
    let score = 0;

    answers.forEach((a,i)=>{

        if(a===exam.questions[i].answer){

            score++;

        }

    });

    document.querySelector(".logo").innerHTML =
    `Reading Review — ${score}/${exam.questions.length}`;

    
    renderQuestion();

    renderNavigator();

};

if(reviewMode){

    const correct = q.answer;

    if(index === correct){

        div.classList.add("correct");

    }

    if(
        answers[currentQuestion] === index &&
        index !== correct
    ){

        div.classList.add("incorrect");

    }

}