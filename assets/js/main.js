/**
 index.html.
 */

//instantiate the model class
const currencyAPI = new CurrencyAPI();

//The first price text box
const amountOne = document.getElementById('amount-one');
//The second price text box
const amountTwo = document.getElementById('amount-two');
//get the first select component from the UI to populate it with the currency list
const select = document.getElementById('currency-one');

//get the second select component from the UI to populate it with the currency list
const selectTwo = document.getElementById('currency-two');

const symbolOne = document.getElementById('amount-one-currency');
const symbolTwo = document.getElementById('amount-two-currency');

const descriptionOne = document.getElementById('currency-info-one');
const descriptionTwo = document.getElementById('currency-info-two');

//capture the values of the two select boxes before changed
let a, b = '';

//registering the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {

        if(reg.waiting) {
            updateReady(reg.waiting);
            return;
        }

        if(reg.installing) {
            console.log('Service worker installing')
            reg.installing.addEventListener('statechange', () => {
                if(this.state == 'installed'){
                    updateReady(this);
                    return;
                }
            });
        }

        reg.addEventListener('updatefound', () => {
            reg.installing.addEventListener('statechange', function(){
                if(this.state == 'installed'){
                    updateReady(this);
                    return;
                }
            });
        })


    }).catch((error) =>  {
        // registration failed
        console.log('Registration failed with ' + error);
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

function updateReady(worker){

    currencyAPI.showUpdateUI('New version available');

    const updateMessage = document.querySelector('#update-message');

    updateMessage.addEventListener('click', (e) => {
        if(e.target && e.target.id== 'btn-refresh'){

            worker.postMessage({action: 'skipWaiting'});


        }else if(e.target && e.target.id== 'btn-cancel'){
            setTimeout(() => {
                document.querySelector('#update-message div').remove();
            }, 1000);
        }

    })
}


//whenever the value of amountOne changed this will trigger
//get the exchange amount and set it to amountTwo
amountOne.addEventListener('keyup', (e) => {
    e.preventDefault();

    if(currencyAPI.isNumberKey(amountOne.value)){
        currencyAPI.queryAPI(select.options[select.selectedIndex].value, selectTwo.options[selectTwo.selectedIndex].value,
            select.options[select.selectedIndex].text, selectTwo.options[selectTwo.selectedIndex].text, amountOne.value, 'amountOne');
    }else if(amountOne < 0){
        this.clearField();
    }else{
        this.clearField();
    }

});

//whenever the value of amountTwo changed this will trigger
//get the exchange amount and set it to amountOne
amountTwo.addEventListener('keyup', (e) => {
    e.preventDefault();

    if(currencyAPI.isNumberKey(amountTwo.value)){
        currencyAPI.queryAPI(selectTwo.options[selectTwo.selectedIndex].value, select.options[select.selectedIndex].value, selectTwo.options[selectTwo.selectedIndex].text, select.options[select.selectedIndex].text, amountTwo.value, 'amountTwo');
    }else if(amountOne < 0){
        this.clearField();
    }else{
        this.clearField();
    }



});

//the below event will capture the values of the first selectbox before it is changed
//this will help me to swap the values of the two select boxes in case the user select the same currency
select.addEventListener('focus', (e) => {
    e.preventDefault();

    a = select.options[select.selectedIndex].value;
    b = select.options[select.selectedIndex].text;


});

//triggered whenever the value of select box one changed
select.addEventListener('change', (e) => {
    e.preventDefault();

    //this checks if the two select currency boxes have the same value
    //if true this function swap their vlues
    if(select.options[select.selectedIndex].value == selectTwo.options[selectTwo.selectedIndex].value){

        //swap value of the second select box two the first select box
        select.options[select.selectedIndex].value = selectTwo.options[selectTwo.selectedIndex].value;
        select.options[select.selectedIndex].text = selectTwo.options[selectTwo.selectedIndex].text;


        //get the value of the select box before it had changed
        //and set it to the second select box
        selectTwo.options[selectTwo.selectedIndex].value = a;
        selectTwo.options[selectTwo.selectedIndex].text = b;


    }
    //this will remove the focus
    select.blur();
    symbolOne.innerText = select.options[select.selectedIndex].value;
    symbolTwo.innerText = selectTwo.options[selectTwo.selectedIndex].value;

    currencyAPI.queryAPI(select.options[select.selectedIndex].value, selectTwo.options[selectTwo.selectedIndex].value,
        select.options[select.selectedIndex].text, selectTwo.options[selectTwo.selectedIndex].text, amountOne.value, 'selectOne');
});

//the below event will capture the values of the first selectbox before it is changed
//this will help me to swap the values of the two select boxes in case the user select the same currency
selectTwo.addEventListener('focus', (e) => {
    e.preventDefault();

    a = selectTwo.options[selectTwo.selectedIndex].value;
    b = selectTwo.options[selectTwo.selectedIndex].text;


});

//triggered whenever the value of select box two changed
selectTwo.addEventListener('change', (e) => {
    e.preventDefault();

    if(selectTwo.options[selectTwo.selectedIndex].value == select.options[select.selectedIndex].value){

        selectTwo.options[selectTwo.selectedIndex].value = select.options[select.selectedIndex].value;
        selectTwo.options[selectTwo.selectedIndex].text = select.options[select.selectedIndex].text;


        select.options[select.selectedIndex].value = a;
        select.options[select.selectedIndex].text = b;
    }

    selectTwo.blur();
    symbolOne.innerText = select.options[select.selectedIndex].value;
    symbolTwo.innerText = selectTwo.options[selectTwo.selectedIndex].value;

    currencyAPI.queryAPI(select.options[select.selectedIndex].value, selectTwo.options[selectTwo.selectedIndex].value,
        select.options[select.selectedIndex].text, selectTwo.options[selectTwo.selectedIndex].text, amountOne.value, 'selectTwo');
});

function clearField(){
    amountOne.value = 0;
    amountTwo.value = 0;
    descriptionOne.innerText = '';
    descriptionTwo.innerText = '';
}










