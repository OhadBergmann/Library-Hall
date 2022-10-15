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
    $('.info-panel').addClass('hide-aside');
}



function onUpdateBook(){
    const $elForm = $('form[name="form2"] .form-frame');
    $elForm.removeClass('op-zero');
    _toggleBookFormInputs($elForm);
}

function onCloseUpdateForm(){
    console.log('test')
    $('form[name="form2"] .form-frame').addClass('op-zero');
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


function onOpenBookForm(e){
    e.preventDefault();
    
    const $elForm = $('form[name="form1"] .form-frame');
    if($elForm.hasClass('op-zero')){
        $elForm.removeClass('op-zero');
        _toggleBookFormInputs($elForm);
    } 
    
}

function onCloseBookForm (e){
    e.preventDefault();
    console.log('onOpenBookForm')
    const $elForm = $('.form-frame');
    if(!$elForm.hasClass('.op-zero')){
        $elForm.addClass('op-zero');
        _toggleBookFormInputs($elForm);
    } 
}



function _toggleBookFormInputs($el){
    var elDOMs = [];
    elDOMs = [...$el.find('input')];
    elDOMs = elDOMs.concat([...$el.find('button')]);

    elDOMs.forEach(($node)=>{
        $node.disabled = !$node.disabled;
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