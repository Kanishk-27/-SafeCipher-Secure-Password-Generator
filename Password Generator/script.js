const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[dataLength]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-Indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbol='!@#$%^&*(\)<[-]>{+}|?~/=-';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//setting indicator to gray initially
setIndicator("#ccc");

function handleSlider(){            //password length ko UI pe reflect karwata hai
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.background=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function randomNumber(){
    return getRandomInteger(0,9);
}

function randomUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function randomLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function randomSymbol(){
    const randNum= getRandomInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); //writeText copies to clipboard and returns a promise
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;           //har bar change pe suru se count karega kyuki sare pe eventlistener laga hai
    allCheckBox.forEach( (checkbox) => { 
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {      //for each laga kar sare checkbox pe actionlistener laga diya aur change(check ya uncheck) ko detect kar rahe
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;       //actionListener se slider se value utha kar password length ko update kiye
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) 
    return;

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //finding the new passwords

    //remove old password
    password="";

    let funcArray=[];

    if(uppercaseCheck.checked)
        funcArray.push(randomUpperCase);

    if(lowercaseCheck.checked)
        funcArray.push(randomLowerCase);

    if(numbersCheck.checked)
        funcArray.push(randomNumber);

    if(symbolsCheck.checked)
        funcArray.push(randomSymbol);

    //compulsory addition
    for(let i=0; i<funcArray.length; i++) {
        password+=funcArray[i]();
    }

    for(let i=0; i<passwordLength-funcArray.length; i++){
        randIndex=getRandomInteger(0,funcArray.length);
        password+=funcArray[randIndex]();
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show on UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();
});