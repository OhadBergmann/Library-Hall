'use strict'

const BOOKS_KEY = 'localDB';
const BOOKSID_KEY = 'lastId';
const CURRPAGE_KEY = 'currentPage';
const USERPREF_KEY = 'UserPref';

var gBooks = [];
var gBookId;
var gViewPreference;
var gPageNum = 0;
var gDisplayAmount = 6;
var gCurrFilter;

if(gDisplayAmount > 6){ gDisplayAmount = 6;}



function getBooks(){
    var books;
    var count = 0;
    !storageHasData(BOOKS_KEY)? _createDefaultBooks() : gBooks = loadFromStorage(BOOKS_KEY);
    gBookId = loadFromStorage(BOOKSID_KEY);
    
    books = [];
    books[0] = []
    books[0][0] = gBooks[0];

    for (let i = 1; i < gBooks.length; i++) {
        if(i%gDisplayAmount !== 0){
            books[count][i%gDisplayAmount] = gBooks[i];
        } else {
            count++;
            books[count] = [];
            books[count][0] = gBooks[i];
        }
    }

    return books;
}

function getBookslength(){

}
function getBooksFilterBy(){
    var books = [];
    var filteredBooks = [];
    var count = 0;
    
    !storageHasData(BOOKS_KEY)? _createDefaultBooks() : gBooks = loadFromStorage(BOOKS_KEY);
    gBookId = loadFromStorage(BOOKSID_KEY);
    

    if(Boolean(gCurrFilter.maxPrice) && Boolean(gCurrFilter.minRate)){
        filteredBooks = gBooks.filter(book => +book.price.substring(0,book.price.length -1) <= +gCurrFilter.maxPrice && 
        +book.rate >= +gCurrFilter.minRate);
    } else if(!Boolean(gCurrFilter.maxPrice)){
        filteredBooks = gBooks.filter(book => +book.rate >= +gCurrFilter.minRate);
    } else if(!Boolean(gCurrFilter.minRate)){
        filteredBooks = gBooks.filter(book => +book.price.substring(0,book.price.length -1) <= +gCurrFilter.maxPrice);
    }
    
    if(filteredBooks.length < 1) return filteredBooks;

    books[0] = [];
    books[0][0] = filteredBooks[0];

    for (let i = 1; i < filteredBooks.length; i++) {
        if(i%gDisplayAmount !== 0){
            books[count][i%gDisplayAmount] = filteredBooks[i];
        } else {
            count++;
            books[count] = [];
            books[count][0] = filteredBooks[i];
        }
    }

    return books;
}

function setCurrentFilter (obj){
    if(!haveCurrentFilter()) gCurrFilter = obj;
    if(Boolean(obj.maxPrice)) gCurrFilter.maxPrice = obj.maxPrice;    
    if(Boolean(obj.minRate)) gCurrFilter.minRate = obj.minRate;
}

function getFilter() {
    var filter = gCurrFilter;
    return filter;
}

function haveCurrentFilter (){
     return !gCurrFilter ? false : true
}

function addNewBook (obj){
    const newBook = _createBook(obj.id, obj.name, obj.price + '$', obj.imgUrl, obj.info);
    gBooks.push(newBook);
    
    saveToStorage(BOOKS_KEY, gBooks);
}


function getBookByID(id) {
    for (let i = 0; i < gBooks.length; i++) {
        if(gBooks[i].id === +id) return gBooks[i];
    }
    return null;
}

function getNewBookID (){
    !gBookId ? gBookId = 1001 : gBookId = loadFromStorage(BOOKSID_KEY) +1;
    saveToStorage(BOOKSID_KEY,gBookId);
    return gBookId;
}

function removeBook(id){
    for (let i = 0; i < gBooks.length; i++) {
        if(gBooks[i].id === +id) {
            gBooks.splice(i,1);
            saveToStorage(BOOKS_KEY, gBooks);
            return;
        }
    }
}

function updateBookRate (id,direction){
    const currBook = getBookByID(id);
    if(direction === '+' && currBook.rate < 10){
        currBook.rate++;
    } else if(direction === '-' && currBook.rate > 0){
        currBook.rate--;
    };

    saveToStorage(BOOKS_KEY, gBooks);
}


function updateBook(data){
    const currBook = getBookByID(data.id);

    switch(data.type){
        case 'id':
            currBook.id = +data.updateValue;
            break;
        case 'name':
            currBook.name = data.updateValue;
            break;
        case 'price':
            currBook.price = +data.updateValue + '$';
            break;
        case 'img-url':
            currBook.imgUrl = data.updateValue;
            break;
        case 'details':
            currBook.info = data.updateValue;
            break;
    }

    saveToStorage(BOOKS_KEY,gBooks);
}

function getDisplayAmount(){
    return gDisplayAmount;
}



function getUserPref(){
    return gViewPreference;
}



function getCurrentPageNum(){
    return gPageNum;
}

function setCurrentPageNum(num){
    gPageNum = num;
    saveToStorage(CURRPAGE_KEY, gPageNum);
}



function _createBook(id, name, price, imgUrl='img/default-cover.png', info='', rate=0) {
    return {
        id,
        name,
        price,
        imgUrl,
        info,
        rate
    };
}



function _createDefaultBooks() {
    
    gBooks = [{
        id: getNewBookID(),
        name: 'Dune',
        price: '114$',
        imgUrl: 'img/dune.png',
        info: dSTR(),
        rate: 9
    },{
        id: getNewBookID(),
        name: 'Ender\'s Game',
        price: '74$',
        imgUrl: 'img/enders-game.png',
        info: egSTR(),
        rate: 6
    },{
        id: getNewBookID(),
        name: 'Foundation',
        price: '137$',
        imgUrl: 'img/foundation.png',
        info: fSTR(),
        rate: 8
    },{
        id: getNewBookID(),
        name: 'The Call of Cthulhu',
        price: '84$',
        imgUrl: 'img/the-call-of-cthulhu.png',
        info: tcocSTR(),
        rate: 7
    },{
        id: getNewBookID(),
        name: 'The King in Yellow',
        price: '152$',
        imgUrl: 'img/the-king-in-yellow.png',
        info: tkiySTR(),
        rate: 10
    },{
        id: getNewBookID(),
        name: 'The Hobbit',
        price: '37$',
        imgUrl: 'img/hobbit.png',
        info: thobSTR(),
        rate: 6
    },{
        id: getNewBookID(),
        name: 'Lord Of The Rings',
        price: '37$',
        imgUrl: 'img/lord-of-the-rings.png',
        info: lotrSTR(),
        rate: 8
    }];

    saveToStorage(BOOKSID_KEY,gBookId);
    saveToStorage(BOOKS_KEY, gBooks);
}
