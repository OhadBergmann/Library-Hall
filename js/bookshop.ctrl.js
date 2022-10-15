'use strict'

function onInit(){
    renderBooks();
}



function renderBooks(){
    document.querySelector('.books-table').innerHTML = _generateTableHTML();
    _changePageProgressionBTNs();
}



function onTablePageChange (isForward){
    var books = getBooks();
    var currPageNum = getCurrentPageNum();
    const lastPage = +document.querySelector('.current-page').innerText; 
    
    if(isForward && lastPage + 1 <= books.length){
        currPageNum++;
        setCurrentPageNum(currPageNum);
    } else if (lastPage - 1 >= 0){
        currPageNum--;
        setCurrentPageNum(currPageNum);
    }

    document.querySelector('.current-page').innerText = currPageNum;
    renderBooks();
}



function onDeleteBook(el){
    const id = el.parentElement.parentElement.firstElementChild.innerText.trim();
    removeBook(id);
    renderBooks();
}


function onReadInfo(el){
    const id = el.parentElement.parentElement.firstElementChild.innerText.trim();
    const book = getBookByID(id);
    document.querySelector('.info-panel').classList.remove('hide-aside');
    document.querySelector('.book-info-name').innerText = book.name;
    document.querySelector('.book-info-id').innerText = 'Book ID: ' + book.id;
    document.querySelector('.book-info-price').innerText = 'Price: ' + book.price;
    //document.querySelector('.book-info-rate .curr-rate').innerText = book.rate;
    //document.getElementById('book-cover-img')['src'] ='./' + book.imgUrl + ''; 
    document.querySelector('.info-panel .first-letter').innerText = book.info.charAt(0);
    document.querySelector('.info-panel .book-info-txt').innerText = book.info.substring(1);
}

function onCloseInfo() {
    document.querySelector('.info-panel').classList.add('hide-aside');
}



function onUpdateBook(){
    console.log('update')
}



function onBookFormSubmition(e){
    e.preventDefault();

    var formInfo = {};
    var str = '';

    if( document.querySelector('input.nb-id-auto').checked || !document.querySelector('input.nb-id').value){
        formInfo.id = getNewBookID();
    }
    else {
        formInfo.id = document.querySelector('input.nb-id').value;
    }
    
    formInfo.name = document.querySelector('input.nb-name').value;
    formInfo.price = document.querySelector('input.nb-price').value;

    if(!formInfo.name){  
        alert('A new book must come\'s with a name');
        return;
    } else if(!formInfo.price){
        alert('A new book must come\'s with a price');
        return;
    }

    formInfo.imgUrl = document.querySelector('input.nb-img-url').value;
    formInfo.info = document.querySelector('input.nb-info').value;

    str = `are you sure you want to submit: \n \" ${formInfo.name} \" i.d number: ${formInfo.id} \n 
    at thr price of ${formInfo.price} \n with the falling picture: ${formInfo.imgUrl} ?`;

    if(confirm(str)){
        addNewBook(formInfo);
        document.querySelector('input.nb-id').value = '';
        document.querySelector('input.nb-name').value = '';
        document.querySelector('input.nb-price').value = '';
        document.querySelector('input.nb-img-url').value = '';
        document.querySelector('input.nb-info').value = '';
        renderBooks();

    }

}

function onHideForm(){
    const elForm = document.querySelector('.form-frame');
    if(!elForm.classList.contains('op-zero')){
        elForm.classList.add('op-zero');
        _toggleBookFormInputs()
    } 
}

function onOpenBookForm(e){
    e.preventDefault();
    
    const elForm = document.querySelector('.form-frame');
    if(elForm.classList.contains('op-zero')){
        elForm.classList.remove('op-zero');
        _toggleBookFormInputs()
    } 
    
}

function onCloseBookForm (e){
    e.preventDefault();

    const elForm = document.querySelector('.form-frame');
    if(!elForm.classList.contains('op-zero')){
        elForm.classList.add('op-zero');
        _toggleBookFormInputs()
    } 
}



function _toggleBookFormInputs(){
    var elDOMs = [];
    elDOMs = [...document.querySelectorAll('.form-frame input')];
    elDOMs.push(document.querySelector('.nb-submit-btn'));
    elDOMs.push(document.querySelector('.nb-cancel-btn'));

    elDOMs.forEach((el)=>{
        el.disabled = !el.disabled;
    });
}



function _checkOddNum(num){
    return num % 2 === 1 ? true : false;
}



function _changePageProgressionBTNs (){
    
    var elCurr = document.querySelector('.btn.prev');
    var booksLength = getBooks().length;
    const currPageNum = getCurrentPageNum();

    if(currPageNum === 0){
        elCurr.disabled = true;
        elCurr.classList.add('disabled-btn');
    } else if(elCurr.disabled){
        elCurr.disabled = false;
        elCurr.classList.remove('disabled-btn');
    }

    elCurr = document.querySelector('.btn.next');
    
    if(currPageNum === booksLength -1){
        elCurr.disabled = true;
        elCurr.classList.add('disabled-btn');
    } else if(elCurr.disabled){
        elCurr.disabled = false;
        elCurr.classList.remove('disabled-btn');
    }
}

function _generateTableHTML(){
    var strHTMLs = [];
    var books = getBooks();
    const currPageNum = getCurrentPageNum();
    const displayLength = getDisplayAmount();

    if(books[currPageNum].length === displayLength){
        
        for(let i = 0; i < displayLength; i++ ){
            strHTMLs[i] = (`<tr ${_checkOddNum(i) ? 'class="odd-row"' : ''}><th class="content">${books[currPageNum][i].id}
            </th><td class="content">${books[currPageNum][i].name}</td>
            <td class="content center-txt">${books[currPageNum][i].price}</td>
            <td class="action-btn"><button class="blue-btn" onclick="onReadInfo(this)">Read</button></td>
            <td class="action-btn"><button class="orange-btn" onclick="onUpdateBook(this)">Update</button></td>
            <td class="action-btn"><button onclick="onDeleteBook(this)">Delete</button></td></tr>`);
        };

    } else if (books[currPageNum].length > 0){
        
        for(let i = 0; i < displayLength; i++ ){
            
            if(books[currPageNum][i]){
                strHTMLs[i] = (`<tr ${_checkOddNum(i) ? 'class="odd-row"' : ''}><th class="content">${books[currPageNum][i].id}
                </th><td class="content">${books[currPageNum][i].name}</td>
                <td class="content center-txt">${books[currPageNum][i].price}</td>
                <td class="action-btn"><button class="blue-btn" onclick="onReadInfo(this)">Read</button></td>
                <td class="action-btn"><button class="orange-btn" onclick="onUpdateBook(this)">Update</button>
                </td><td class="action-btn"><button onclick="onDeleteBook(this)">Delete</button></td></tr>`);
            } else {
                strHTMLs[i] = _getEmptyTableRow(1).join('');
            }

        }

    } else {
        strHTMLs = _getEmptyTableRow(5); 
    }

    strHTMLs.unshift(`<table><thead><tr><th>I.D</th><th>Name</th><th>Price</th><th class="actions" colspan="3">
    Actions</th></tr></thead><tbody>`);
    strHTMLs.push(`</tbody></table>`);

    return strHTMLs.join('');
}

function _getEmptyTableRow(num){
    var EmptyRows = [];
    num = Math.abs(num);

    for (let i = 0; i < num; i++) {
        EmptyRows[i] = `<tr><th class="content"></th><td class="content"></td><td class="content center-txt"><td class="action-btn">
        </td><td class="action-btn"></td><td class="action-btn"></td></tr>`;
    }

    return EmptyRows;
}