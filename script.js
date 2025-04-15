// If we want to use custom attribute we have to use [] in the querySelector method to select the attribute
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const length = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*(){}[]_-+=:;|<>/,.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

//Set strength indicator circle color grey
handleSlider();
setIndicator("#ccc");

// Set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    length.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"; // width height
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 10px ${color}, 0 0 5px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function generateRndNumber(){
    return getRndInteger(0, 9);
}

function generteRndLowercase(){
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateRndUppercase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateRndSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumbers = false;
    let hasSymbols = false;

    if(uppercaseCheck.checked) hasUppercase = true;
    if(lowercaseCheck.checked) hasLowercase = true;
    if(numbersCheck.checked) hasNumbers = true;
    if(symbolsCheck.checked) hasSymbols = true;

    if(hasUppercase && hasLowercase && (hasNumbers || hasSymbols) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLowercase || hasUppercase) && (hasNumbers || hasSymbols) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }catch(err){
        copyMsg.innerText = "Failed to copy!";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i*1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
    
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckboxes.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);

})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    // length.innerText = passwordLength;
    // calStrength();
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }else{
        copyMsg.innerText = "No password to copy!";
        copyMsg.classList.add("active");

        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000);
    }
})

generateBtn.addEventListener('click', () => {
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateRndUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generteRndLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateRndSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked) funcArr.push(generateRndUppercase);
    if(lowercaseCheck.checked) funcArr.push(generteRndLowercase);
    if(numbersCheck.checked) funcArr.push(generateRndNumber);
    if(symbolsCheck.checked) funcArr.push(generateRndSymbol);

    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calStrength();
});
