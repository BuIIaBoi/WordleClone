// eventListeners = Listen for specific events to create interactive web pages 
// events: keydown, keyup, keypress
// .addEventListener(event, callback);

let arr = ['a','p','p','l','e']

let counter = 1
let rowCounter = 1

let innerRow = document.getElementById(`innerRow${rowCounter}`);

document.addEventListener("keyup", event => {
    if(event.key == 'Backspace'){

        document.getElementById(innerRow.children[counter-1].id).innerHTML = '';
        document.getElementById(innerRow.children[counter-1].id).style.backgroundColor = 'white';
//        console.log(event.key)
        counter -= 1;

        if (counter == 0){
            counter += 1
        }
    }

    else if(event.key == "Enter"){
        for(let i = 0; i < 5; i++){
            checker(i);
        }
//        console.log(rowCounter);
        rowCounter += 1;
        innerRow = document.getElementById(`innerRow${rowCounter}`);
        counter = 1
        if (rowCounter == 7){
            document.removeEventListener("keyup", event => {})
        }
    }
    
    else{
//        console.log(counter)
//        console.log(innerRow)
        
        document.getElementById(innerRow.children[counter-1].id).innerHTML = event.key;
//        console.log(innerRow.children[counter-1].innerHTML)
        counter += 1;
        if (counter == 6){
            counter -= 1;
        }
    }
   
})

function checker(i){
    if(arr.includes(innerRow.children[i].innerHTML)){
        if(innerRow.children[i].innerHTML == arr[i]){
            console.log(innerRow.children[i].style.backgroundColor = 'green');
        }
        else{
            console.log(innerRow.children[i].style.backgroundColor = 'yellow');
        }
    }

    else{
        console.log(innerRow.children[i].style.backgroundColor = 'red');
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }