// --------------------
// GLOBAL VARIABLES
// --------------------

let currentModule = 1;

let currentQuestion = 0;

let answers = new Array(exam.questions.length).fill(null);

let flagged = new Array(exam.questions.length).fill(false);

let seconds = 35 * 60;

let reviewMode = false;

let questionTimer;

let questionStarted = false;

// --------------------
// HTML ELEMENTS
// --------------------


const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const instruction = document.getElementById("instruction");

const choicesDiv = document.getElementById("choices");

const progressBar = document.getElementById("progressBar");

const navigatorDiv = document.getElementById("navigator");

const timer = document.getElementById("timer");

const playAudioBtn = document.getElementById("playAudioBtn");

const audioPlayer = new Audio();

const questionTimes = [

    10,10,10,10,10,10,10,10,   // Q1-8

    15,15,                      // Q9-10

    15, 15,                      // Q11-12

    20,20,20,20,20,20,           // Q13-18

    10,10,10,10,10,10,10,10, //1-8

    15,15, //9-10

    15,15, //9-10

    20,20,20,20           // Q13-16

    ];

let lastAudioFile = "";

// --------------------
// LOAD PASSAGE
// --------------------


// --------------------
// AUDIO
// --------------------
function getAudioFile(module, question){

    // Questions 1-8
    if(question <= 8){
        return `${module}_${question}.ogg`;
    }

    // Module 1
    if(module == 1){

        if(question <= 10)
            return "1_9-10.ogg";

        if(question <= 12)
            return "1_11-12.ogg";

        if(question <= 14)
            return "1_13-14.ogg";

        return "1_15-18.ogg";

    }

    // Module 2
    if(module == 2){

        if(question <= 10)
            return "2_9-10.ogg";

        if(question <= 12)
            return "2_11-12.ogg";

        return "2_13-16.ogg";

    }

}

function playAudio(){

    const questionNumber = currentQuestion + 1;

    const module = (currentQuestion < 18) ? 1 : 2;

    const questionInModule =
        (module === 1)
            ? currentQuestion + 1
            : currentQuestion - 17;

    const file = getAudioFile(module, questionInModule);

    if(file === lastAudioFile)
        return;

    lastAudioFile = file;

   audioPlayer.src = "Audiofiles_Mock4/" + file;

    document.getElementById("audioProgress").style.width = "0%";

    if(reviewMode){

        document.getElementById("audioStatus").textContent =
            "🎧 Click Play to hear the audio.";

    }else{

        audioPlayer.play();

        document.getElementById("audioStatus").textContent =
            "🎧 Now Playing...";

    }

    audioPlayer.ontimeupdate = () => {

        if(audioPlayer.duration){

            const percent =
                (audioPlayer.currentTime / audioPlayer.duration) * 100;

            document.getElementById("audioProgress").style.width =
                percent + "%";
        }

    };

    audioPlayer.onended = () => {

        document.getElementById("audioStatus").textContent =
            "✓ Audio Finished";

        document.getElementById("audioProgress").style.width = "100%";

        startQuestionTimer();

    };

}

// --------------------
// TIMER
// --------------------
function updateTimer() {

    let min = Math.floor(seconds / 60);

    let sec = seconds % 60;

    timer.textContent =
        String(min).padStart(2,"0") +
        ":" +
        String(sec).padStart(2,"0");

    if(seconds <= 5){
        timer.classList.add("warning");
    }else{
        timer.classList.remove("warning");
    }

}

function prepareQuestionTimer(){

    clearInterval(questionTimer);

    seconds = questionTimes[currentQuestion];

    updateTimer();

}

function startQuestionTimer(){

    clearInterval(questionTimer);

    questionTimer = setInterval(()=>{

        seconds--;

        updateTimer();

        if(seconds <= 0){

            clearInterval(questionTimer);

            document.getElementById("nextBtn").click();

        }

    },1000);

}

// --------------------
// RENDER QUESTION
// --------------------

function renderQuestion(){

    const q = exam.questions[currentQuestion];
    instruction.textContent = q.instruction;

    questionNumber.textContent =
        "Question " +
        (currentQuestion+1) +
        " of " +
        exam.questions.length;

    questionText.textContent = q.questionText;

    choicesDiv.innerHTML="";

    q.choices.forEach((choice,index)=>{

        const div=document.createElement("div");

        div.className="choice";
        if (reviewMode) {

            const correct = q.answer;

            if (index === correct) {
                div.classList.add("correct");
            }

            if (
                answers[currentQuestion] === index &&
                index !== correct
            ) {
                div.classList.add("incorrect");
            }

        }

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

    updateProgress();

    if(!questionStarted){

        prepareQuestionTimer();

        playAudio();

        questionStarted = true;

    }

    if(reviewMode){

        playAudioBtn.style.display = "inline-block";

    }else{

        playAudioBtn.style.display = "none";

    }


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

            audioPlayer.pause();
            audioPlayer.currentTime = 0;

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

    questionStarted = false;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    if (currentQuestion < exam.questions.length - 1) {

        currentQuestion++;

        renderQuestion();

        renderNavigator();

    } else {

        if(reviewMode){

            return;

        }

        openReview();

    }

};

document.getElementById("prevBtn").onclick=()=>{

    questionStarted = false;
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;

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

document.getElementById("startBtn").onclick = () => {

    document.getElementById("startScreen").style.display = "none";

    document.getElementById("main").style.display = "flex";

    document.querySelector("footer").style.display = "flex";

    document.getElementById("progressContainer").style.display = "block";

    renderQuestion();

    renderNavigator();

};
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
    document.getElementById("timer").style.display = "none";
    document.getElementById("flagBtn").style.display = "none";
    document.getElementById("nextBtn").textContent = "Next Question";
    document.getElementById("flagBtn").disabled = true;


};



playAudioBtn.onclick = () => {

    if(audioPlayer.paused){

        audioPlayer.play();

        playAudioBtn.textContent = "⏸ Pause Audio";

    }else{

        audioPlayer.pause();

        playAudioBtn.textContent = "▶ Play Audio";

    }

};