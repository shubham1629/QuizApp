

let onlineService = (function() {

    let startId = "start-button";
    let reloadMessageId = "reload-button";

    let offlineMsg = "Your system is offline ";
    let onlineBackMsg = "Connected to Internet";

    
    function online() {
        setVisibility(reloadMessageId, true);
        setVisibility(startId, true);
        setMessage(onlineBackMsg);
        setTimeout(()=> {
            setVisibility(reloadMessageId, false);
        }, 5000);
    }

    function setVisibility(id, value) {
        if(document.getElementById(id)) {
            if(value)
                document.getElementById(id).style.visibility = "visible";
            else
                document.getElementById(id).style.visibility = "hidden";
        }
    }

    function setMessage(msg) {
        document.getElementById(reloadMessageId).innerHTML = msg;
    }
    
    function offline() {
        setVisibility(reloadMessageId, true);
        setMessage(offlineMsg);
        setVisibility(startId, false);
    }
    
    function isOnline() {
        return navigator.onLine;
    }
    
    function reload() {
        location.reload();
    }

    function refresh() {
        if(!isOnline()) offline();
        else setVisibility(startId, true);
    }

    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    
    return {
        get OFFLINE_MSG() {
            return offlineMsg;
        },
        get START_BUTTON_ID() {
            return startId;
        },
        get RELOAD_MESSAGE_ID() {
            return reloadMessageId;
        },
        isOnline,
        reload,
        refresh
    }
})();




let Question = function (idA, titleA, hintA, optionsA, answerA, isMultiA, markA, negativeA, difficultyA) {
    let id = idA;
    let title = titleA;
    let options = optionsA;
    let answer = answerA;
    let hint = hintA;
    let selected = [];
    let isMulti = isMultiA;
    let mark = markA;
    let isSubmited = false;
    let difficulty = difficultyA;
    let negative = negativeA;

    function addOption(option) {
        this.options.push(option);
    }

    function removeOption(number) {
        if (number - 1 < options.length)
            options.splice(number - 1, 1);
    }

    function getOption(index) {
        if (index < options.length && index > -1)
            return options[index];
    }

    function setSelected(arr) {
        selected = arr;
    }

    function submit() {
        isSubmited = true;
    }

    return {
        get isSubmited() {
            return isSubmited;
        },
        get id() {
            return id;
        },
        get title() {
            return title;
        },
        get options() {
            return options;
        },
        getOption,
        get answer() {
            return answer;
        },
        get hint() {
            return hint;
        },
        get isMulti() {
            return isMulti;
        },
        get selected() {
            return selected;
        },
        get mark() {
            return mark;
        },
        get difficulty() {
            return difficulty;
        },
        get negative() {
            return negative;
        },

        set selected(selected) {
            setSelected(selected);
        },
        addOption,
        removeOption,
        submit
    }
}


let Score = function (nameA, marksA, correctA, wrongA, totalA, timeTakenA) {
    let name = nameA;
    let marks = marksA;
    let correct = correctA;
    let wrong = wrongA;
    let total = totalA;
    let timeTaken = timeTakenA;
    return {
        get name() {
            return name;
        },
        get marks() {
            return marks;
        },
        get correct() {
            return correct;
        },
        get wrong() {
            return wrong;
        },
        get total() {
            return total;
        },
        get timeTaken() {
            return timeTaken;
        }
    }
}


let elementBuilder = (function () {

    function createElement(type, id, className, val, onclick) {
        let element = document.createElement(type);
        if (id) element.id = id;
        if (className) element.className = className;
        if (val) element.innerHTML = val;
        if (onclick) element.onclick = onclick;
        return element;
    }

    function createInputElement(type, id, className, name, val, onclick, onchange) {
        let inputElement = createElement("input", id, className, undefined, onclick);
        if(onchange) inputElement.onchange = onchange;
        if(val) inputElement.value = val;
        if(name) inputElement.name = name;
        if(type) inputElement.type = type;
        return inputElement;
    }


    return {
        createElement,
        createInputElement
    };
})();

let cardBuilder = (function () {

    let CONTAINER_TYPE = "div";
    let CARD_TYPE = "div";
    let CARD_CLASS = "card";
    let CARD_HEADER_CLASS = "card-header";
    let CARD_BODY_CLASS = "card-body";
    let CARD_FOOTER_CLASS = "card-footer";
    let CARD_HEADER_ID = "card-head";
    let CARD_FOOTER_ID = "card-foot";
    let CARD_BODY_ID = "card-body";

    function getCard(header, body, footer) {
        let cardElement = document.createElement(CARD_TYPE);
        cardElement.classList.add(CARD_CLASS);
        body.classList.add(CARD_BODY_CLASS);
        footer.classList.add(CARD_FOOTER_CLASS);
        cardElement.appendChild(header);
        cardElement.appendChild(body);
        cardElement.appendChild(footer);
        return cardElement;
    }

    function reloadContainer() {
        let message = elementBuilder.createElement("span", onlineService.RELOAD_MESSAGE_ID, "reload-message");
        if(onlineService.isOnline())
            message.style.visibility="hidden";
        message.innerHTML = onlineService.OFFLINE_MSG;
        return message;
    }

    function getHeader() {
        let header = elementBuilder.createElement(CONTAINER_TYPE, CARD_HEADER_ID , CARD_HEADER_CLASS);
        header.appendChild(reloadContainer());
        return header;
    }

    function getBody() {
        let body = elementBuilder.createElement(CONTAINER_TYPE, CARD_BODY_ID, CARD_BODY_CLASS);
        return body;
    }

    function getFooter() {
        let footer = elementBuilder.createElement(CONTAINER_TYPE, CARD_FOOTER_ID, CARD_FOOTER_CLASS);
        return footer;
    }

    function createOptionElement(name, val, str, isMultiOptions) {
        let container = elementBuilder.createElement("div", undefined, "question-option");
        let input = elementBuilder.createInputElement(isMultiOptions? "checkbox": "radio", undefined, undefined, name, val);
        let label = elementBuilder.createElement("label", undefined, undefined, str);
        container.appendChild(input);
        container.appendChild(label);
        return {
            container,
            input
        };
    }


    function createPageButton(val, onclick) {
        let button = elementBuilder.createElement("button", undefined, "page-btn", val, onclick);
        return button;
    }

    function getQuestionCard() {
        let header = getHeader();
        let id = elementBuilder.createElement("span", undefined, "question-id");
        let difficulty = elementBuilder.createElement("span", undefined, "question-difficulty");
        let title = elementBuilder.createElement("h1", undefined, "question-title");
        let hint = elementBuilder.createElement("span", undefined, "question-hint");
        header.appendChild(id);
        header.appendChild(difficulty);
        header.appendChild(title);
        header.appendChild(hint);
        let body = getBody();
        let footer = getFooter();
        let card = getCard(header, body, footer);
        let prevButton = elementBuilder.createElement("button",undefined, "btn", "Previous");
        let nextButton = elementBuilder.createElement("button", undefined, "btn", "Next");
        let clearButton = elementBuilder.createElement("button", undefined, "btn", "Clear");
        let submitButton = elementBuilder.createElement("button", undefined, "btn", "Submit");
        footer.appendChild(prevButton);
        footer.appendChild(nextButton);
        footer.appendChild(clearButton);
        footer.appendChild(submitButton);

        let questionJumpContainer = elementBuilder.createElement("div");
        footer.appendChild(questionJumpContainer);


        let question = QuestionCard(card, id, difficulty, title, hint, body, createOptionElement, createPageButton, nextButton, prevButton, submitButton, clearButton, questionJumpContainer);

        return question;
    }

    function getCustomCard() {
        let header = getHeader();
        let body = getBody();
        let footer = getFooter();
        let card = getCard(header, body, footer);
        let customCard = CustomCard(card, header, body, footer);
        return customCard;
    }


    function getMessageCard() {
        let header = getHeader();
        let title = elementBuilder.createElement("h1", undefined, "question-title");
        header.appendChild(title);
    }

    return {
        getQuestionCard,
        getMessageCard,
        getCustomCard
    }

})();

let QuestionCard = function (cardE, idE, difficultyE, titleE, hintE, optionContainerE, createOptionElement, createPageButton, nextE, prevE, submitE, clearE, questionJumpContainerE) {
    let cardElement = cardE;
    let titleElement = titleE;
    let optionsConatinerElement = optionContainerE;
    let optionsElement = [];
    let hintElement = hintE;
    let question;
    let next = nextE;
    let prev = prevE;
    let submit = submitE;
    let clear = clearE;
    let idElement = idE;
    let difficulty = difficultyE;
    let questionJumpContainerElement = questionJumpContainerE;
    let pageElements = [];
    let currentPageButton;

    function setQuestion(questionObj) {
        question = questionObj;
        if (question) {
            setElementVal(idElement, question.id);
            setElementVal(titleElement, question.title);
            setElementVal(hintElement, question.hint);
            setElementVal(difficulty, question.difficulty);
            setOptions();
            setActionButtons();
        }
    }

    function setActionButtons() {
        if (question.id == 1) {
            next.classList.remove("btn-disabled");
            prev.classList.add("btn-disabled");
        } else if (question.id == pageElements.length) {
            prev.classList.remove("btn-disabled");
            next.classList.add("btn-disabled");
        } else {
            prev.classList.remove("btn-disabled");
            next.classList.remove("btn-disabled");
        }

        if (question.isSubmited) {
            submit.innerHTML = "View Scorecard"
            clear.style.visibility = "hidden";
        } else {
            submit.innerHTML = "Submit"
            clear.style.visibility = "visible";
        }

        if (currentPageButton)
            currentPageButton.classList.remove("page-btn-current");
        currentPageButton = pageElements[+question.id - 1];
        currentPageButton.classList.add("page-btn-current");
    }

    function setOptions() {
        optionsConatinerElement.innerHTML = "";
        let index = 1;
        optionsElement = [];
        for (const optionMsg of question.options) {
            let opt = createOptionElement("option", index, optionMsg, question.isMulti);
            optionsConatinerElement.appendChild(opt.container);
            if (question.isSubmited) {
                opt.input.disabled = true;
                if (question.answer.indexOf(index) != -1)
                    opt.container.classList.add("correct");
            } else {
                opt.container.classList.add("question-hover");
            }
            optionsElement.push(opt.input);
            index++;
        }

        for (const selected of question.selected) {
            optionsElement[+selected - 1].checked = true;
        }
    }



    function setElementVal(element, val) {
        if (element && val) element.innerHTML = val;
    }


    function getElement() {
        return cardElement;
    }

    function getSelectedOptions() {
        let selected = [];
        for (let optionElement of optionsElement) {
            if (optionElement.checked)
                selected.push(+optionElement.value);
        }
        question.selected = selected;
        if (selected.length > 0)
            currentPageButton.classList.add("page-btn-marked");
        return selected;
    }

    function setFunctions(nextFun, prevFun, submitFun) {
        next.onclick = () => {
            if (!question.isSubmited) {
                getSelectedOptions();
            }
            nextFun();
        }
        prev.onclick = () => {
            if (!question.isSubmited) {
                getSelectedOptions();
            }
            prevFun();
        }
        submit.onclick = () => {
            if (!question.isSubmited) {
                getSelectedOptions();
            }
            submitFun();
        }

        clear.onclick = () => {
            clearSelected();
        }
    }

    function clearSelected() {
        if (!question.isSubmited) {
            for (const opt of optionsElement) {
                opt.checked = false;
            }
            question.selected = [];
            pageElements[question.id - 1].classList.remove("page-btn-marked");
        }
    }

    function setTotalQuestions(number, jumpToPage) {
        for (let i = 1; i <= number; ++i) {
            let button = createPageButton(i, () => jumpToPage(i));
            questionJumpContainerElement.appendChild(button);
            pageElements.push(button);
        }
    }

    function markWrongPages(wrongIds) {
        for (let id of wrongIds)
            pageElements[id - 1].classList.add("page-btn-wrong");
    }

    return {
        getElement,
        setQuestion,
        setFunctions,
        setTotalQuestions,
        markWrongPages,
        getSelectedOptions
    }
};


let CustomCard = function (cardE, headerE, bodyE, footerE) {
    let header = headerE;
    let footer = footerE;
    let body = bodyE;
    let card = cardE;

    function addToHeader(element) {
        header.appendChild(element);
    }

    function addToFooter(element) {
        footer.appendChild(element);
    }

    function addToBody(element) {
        body.appendChild(element);
    }

    function clearHeader() {
        header.innerHTML = "";
    }

    function clearFooter() {
        footer.innerHTML = "";
    }

    function clearBody() {
        body.innerHTML = "";
    }

    function getCard() {
        return card;
    }

    return {
        addToHeader,
        addToFooter,
        addToBody,
        clearHeader,
        clearFooter,
        clearBody,
        getCard
    }
};


let http = (function () {

    async function fetchFromURL(url) {
        if(onlineService.isOnline()) {
            let request = fetch(url);
            let response = await request;
            let json = await response.json()
            return json;
        }
        return undefined;
    }

    return {
        fetchFromURL
    }
})();

let quizAPI = (function () {
    let baseUrl = "https://opentdb.com/api.php";
    function getRandomArbitrary(min, max) {
        return Math.round((Math.random() * (max - min + 1)) + min);
    }

    async function getQuestions(amount, category, difficulty) {
        let url = baseUrl + "?amount=" + amount;
        if (category && category != "any")
            url += "&category=" + category;
        if (difficulty && difficulty != "any")
            url += "&difficulty=" + difficulty;


        let responseJSON = await http.fetchFromURL(url);
        if(responseJSON != undefined) {
            let results = responseJSON.results;
            let questions = []
            let index = 1;
            for (let e of results) {
                let options = e.incorrect_answers;
                let ans = getRandomArbitrary(1, options.length);
                options.splice(ans - 1, 0, e.correct_answer);
                questions.push(
                    Question(index, e.question, undefined, options, [ans], false, 2, 1, e.difficulty)
                );
                index++;
            }
            return questions;
        }
        return undefined;
    }

    return {
        getQuestions
    }
})();




let Quiz = function () {

}



let Scoreboard = function () {

}

let categories = [
    { name: "Any Category", value: "any" },
    { name: "General Knowledge", value: "9" },
    { name: "Entertainment: Books", value: "10" },
    { name: "Entertainment: Film", value: "11" },
    { name: "Entertainment: Music", value: "12" },
    { name: "Entertainment: Musicals &amp, Theatres", value: "13" },
    { name: "Entertainment: Television", value: "14" },
    { name: "Entertainment: Video Games", value: "15" },
    { name: "Entertainment: Board Games", value: "16" },
    { name: "Science &amp, Nature", value: "17" },
    { name: "Science: Computers", value: "18" },
    { name: "Science: Mathematics", value: "19" },
    { name: "Mythology", value: "20" },
    { name: "Sports", value: "21" },
    { name: "Geography", value: "22" },
    { name: "History", value: "23" },
    { name: "Politics", value: "24" },
    { name: "Art", value: "25" },
    { name: "Celebrities", value: "26" },
    { name: "Animals", value: "27" },
    { name: "Vehicles", value: "28" },
    { name: "Entertainment: Comics", value: "29" },
    { name: "Science: Gadgets", value: "30" },
    { name: "Entertainment: Japanese Anime &amp, Manga", value: "31" },
    { name: "Entertainment: Cartoon &amp, Animations", value: "32" },
];

difficulties = [
    { name: "Any Difficulty", value: "any" },
    { name: "Easy", value: "easy" },
    { name: "Medium", value: "medium" },
    { name: "Hard", value: "hard" },
]

function getTime() {
    return new Date().getTime();
}

let controller = (function () {

    let cardContainer = document.getElementById("card-container");
    let categoryType = "any";
    let difficultyType = "any";
    let noOfQuest = 30;
    let loadingGifUrl = "https://i.gifer.com/YCZH.gif";
    let timerElement = document.getElementById("timerSapn");
    let higgestScoreSpan = document.getElementById("higgestScoreSpan");
    let milliSecondsInSecond = 1000;
    let milliSecondsInMinute = 60000;
    let timeInMin = 30 ;
    let totalTimeInMilli = (milliSecondsInMinute * timeInMin);
    let higgestScore = 0;
    let name = "";

    if (localStorage.getItem("QuizhighestScore"))
        setHighest(localStorage.getItem("QuizhighestScore"));
    if (localStorage.getItem("QuizName"))
        setName(localStorage.getItem("QuizName"));

    function setHighest(mark) {
        higgestScore = mark;
        higgestScoreSpan.innerHTML = higgestScore;
        localStorage.setItem("QuizhighestScore", mark);
    }

    function setName(str) {
        name = str;
        localStorage.setItem("QuizName", name);
    }

    let startTest = () => {
        setContainerElement(loadingElement.getCard());
        quizAPI.getQuestions(noOfQuest, categoryType, difficultyType).then(
            questions => {
                cardBuilder.getMessageCard();
                let qCard = cardBuilder.getQuestionCard();
                let selected = 0;
                let score;

                qCard.setTotalQuestions(questions.length, (i) => {
                    selected = i - 1;
                    qCard.setQuestion(questions[selected]);
                })

                let next = () => {
                    if (selected < questions.length - 1) {
                        selected++;
                        qCard.setQuestion(questions[selected]);
                    }
                }

                let prev = () => {
                    if (selected > 0) {
                        selected--;
                        qCard.setQuestion(questions[selected]);
                    }
                }

                let submit = () => {
                    clearInterval(timerInterval);
                    let isHighest = false;
                    if (score === undefined) {
                        let marks = 0;
                        let correctCount = 0;
                        let wrongCount = 0;
                        let wrongIds = [];
                        for (let question of questions) {
                            question.submit();
                            if (question.answer.length != question.selected.length)
                                continue;
                            wrongIds.push(question.id);
                            wrongCount++;
                            marks -= question.negative;
                            question.answer.sort();
                            let isCorrect = true;
                            for (let i = 0; i < question.answer.length; ++i) {
                                if (question.answer[i] != question.selected[i]) {
                                    isCorrect = false;
                                    break;
                                }
                            }
                            if (!isCorrect)
                                continue;
                            marks += question.mark + question.negative;
                            correctCount++;
                            wrongCount--;
                            wrongIds.pop();
                        }
                        selected = 0;
                        score = Score(name, marks, correctCount, wrongCount, questions.length, time - startTime);
                        qCard.markWrongPages(wrongIds);
                        if (marks > higgestScore) {
                            setHighest(marks);
                            isHighest = true;
                        }
                    }
                    scoreCard.setScore(score, () => {
                        setContainerElement(qCard.getElement());
                        qCard.setQuestion(questions[selected]);
                    }, isHighest);
                    setContainerElement(scoreCard.getCard());
                }
                qCard.setQuestion(questions[selected]);
                qCard.setFunctions(next, prev, submit);
                setContainerElement(qCard.getElement());
                let startTime = getTime();
                let endTime = startTime + totalTimeInMilli;
                let time = startTime;
                setTimer(totalTimeInMilli);
                let timerInterval = setInterval(() => {
                    time = getTime();
                    remainingTime = endTime - time;
                    if (remainingTime <= 0) {
                        clearInterval(timerInterval);
                        qCard.getSelectedOptions();
                        setTimer(0);
                        submit();
                    } else {
                        setTimer(remainingTime);
                    }
                }, 1000);
            }
        ).catch(() => {
            alert("You are offline");
        });
    }

    function setTimer(remainingTime) {
        let time = getTimeObj(remainingTime);
        timerElement.innerHTML = time.min + " min " + time.sec + " sec";
    }

    function getTimeObj(remainingTime) {
        let min = Math.floor(remainingTime / milliSecondsInMinute);
        let sec = Math.ceil((remainingTime % milliSecondsInMinute) / milliSecondsInSecond);
        return { min, sec };
    }

    let getCheckboxElement = (opts, label, onSelectChnage) => {
        let div = elementBuilder.createElement("div", undefined, "config-select-box");
        let span = elementBuilder.createElement("span", undefined, undefined, label);
        div.appendChild(span);
        let select = elementBuilder.createElement("select");
        for (let opt of opts) {
            let optE = elementBuilder.createElement("option", undefined, undefined, opt.name);
            optE.value = opt.value;
            select.appendChild(optE);
        }
        select.onchange = onSelectChnage;
        div.appendChild(select);
        return div;
    }

    function getInputElement(value, label, onChange) {
        let div = elementBuilder.createElement("div", undefined, "config-select-box");
        let span = elementBuilder.createElement("span", undefined, undefined, label);
        div.appendChild(span);
        let input = elementBuilder.createInputElement("text", undefined, undefined, name, value, undefined, onchange);
        div.appendChild(input);
        return div;
    }

    let homePageCard = (function () {
        let customCard = cardBuilder.getCustomCard();
        let title = elementBuilder.createElement("h1", undefined, undefined, "Quiz Challenge");
        customCard.addToHeader(title);

        let p1 = elementBuilder.createElement("p", undefined, undefined, "Try to answer question within time limit");
        customCard.addToBody(p1);

        let p2 = elementBuilder.createElement("span", undefined, "small-text", "Note: Correct answer will increase score by 2 points and worng answer will reduce score by 1 points");
        customCard.addToBody(p2);

        let nameInput = getInputElement(name, "Enter you name ", (event) => { setName(event.target.value) });
        customCard.addToBody(nameInput);

        let categorySelect = getCheckboxElement(categories, "Select Category:", (event) => categoryType = event.target.value);
        customCard.addToBody(categorySelect);

        let difficultySelect = getCheckboxElement(difficulties, "Select Difficulty: ", (event) => difficultyType = event.target.value);
        customCard.addToBody(difficultySelect);

        let startbutton = elementBuilder.createElement("button", onlineService.START_BUTTON_ID, "btn", "Start Test", startTest)
        if(!onlineService.isOnline()) startbutton.style.visibility = "hidden";
        customCard.addToFooter(startbutton);

        return customCard;
    })();

    let loadingElement = (function () {
        let customCard = cardBuilder.getCustomCard();
        let div = elementBuilder.createElement("div", undefined, "center-element");
        let img = elementBuilder.createElement("img", "loading-image", "loading-image");
        img.src = loadingGifUrl;
        div.appendChild(img);
        customCard.addToBody(div);
        return customCard;
    })();

    let setContainerElement = (element) => {
        if (element) {
            cardContainer.innerHTML = "";
            cardContainer.appendChild(element);
            onlineService.refresh();
        }
    }

    let scoreCard = (function () {
        let customCard = cardBuilder.getCustomCard();
        let title = elementBuilder.createElement("h1", undefined, undefined, "Test Completed");
        customCard.addToHeader(title);
        let highest = elementBuilder.createElement("p", undefined, "highest", "You scored highest in this Exam");
        customCard.addToHeader(highest);

        let heading = elementBuilder.createElement("h3", undefined, undefined, "Results !!!");
        customCard.addToBody(heading);

        let result = elementBuilder.createElement("div", undefined, "result-tab");
        let nameSpan = elementBuilder.createElement("span");
        result.appendChild(nameSpan);
        let markSpan = elementBuilder.createElement("span");
        result.appendChild(markSpan);
        let correctSpan = elementBuilder.createElement("span");
        result.appendChild(correctSpan);
        let wrongSpan = elementBuilder.createElement("span");
        result.appendChild(wrongSpan);
        let totalSpan = elementBuilder.createElement("span");
        result.appendChild(totalSpan);
        let noAnsSpan = elementBuilder.createElement("span");
        result.appendChild(noAnsSpan);

        let timeSpan = elementBuilder.createElement("span");
        result.appendChild(timeSpan);

        customCard.addToBody(result);

        let reviewQuestionsButton = elementBuilder.createElement("button", undefined, "btn", "Review Questions")
        customCard.addToFooter(reviewQuestionsButton);


        let homeButton = elementBuilder.createElement("button", undefined, "btn", "home", () => {
            setTimer(totalTimeInMilli);
            setContainerElement(homePageCard.getCard());
        });
        customCard.addToFooter(homeButton);


        function setScore(score, reviewFun, isHighest) {
            nameSpan.innerHTML = "Name : " + score.name;
            markSpan.innerHTML = "Marks : " + score.marks;
            correctSpan.innerHTML = "Correct Answered: " + score.correct;
            totalSpan.innerHTML = "Total Questions : " + score.total;
            noAnsSpan.innerHTML = "No Answered : " + (score.total - score.correct - score.wrong);
            wrongSpan.innerHTML = "Wrong Answered : " + score.wrong;
            let time = getTimeObj(score.timeTaken);
            timeSpan.innerHTML = `Time Taken : ${time.min}m ${time.sec}s`;
            reviewQuestionsButton.onclick = reviewFun;

            if (isHighest)
                highest.style.display = "block";
            else
                highest.style.display = "none";
        }

        function getCard() {
            return customCard.getCard();
        }

        return {
            getCard,
            setScore
        }
    })();

    setContainerElement(homePageCard.getCard());
    setTimer(totalTimeInMilli);
    higgestScoreSpan.innerHTML = higgestScore;
})();



