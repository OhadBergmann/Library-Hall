'use strict'


var gCurrBookID = -1;


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

    $('.info-panel').removeClass('hide-aside');
    $('.book-info-name').text(book.name);
    $('.book-info-id').text('Book ID: ' + book.id);
    $('.book-info-price').text('Price: ' + book.price);
    if(Boolean(book.rate)) $('.book-info-rate span').text(book.rate);
    !book.imgUrl? $('.book-cover').attr('src','img/default-cover.png') : $('.book-cover').attr('src',book.imgUrl);
    $('.info-panel .first-letter').text(book.info.charAt(0));
    $('.info-panel .book-info-txt').text(book.info.substring(1));
}

function onCloseInfo() {
    $('.info-panel').addClass('hide-aside');
}



function onUpdateBook(el){
    gCurrBookID = $(el).closest('tr').children('*').first().text()
    
    const $elForm = $('form[name="form2"] .form-frame');
    $elForm.removeClass('op-zero');
    _toggleBookFormInputs($elForm);

}

function onCloseUpdateForm(){
    gCurrBookID = -1;
    const $elForm = $('form[name="form2"] .form-frame');
    $elForm.addClass('op-zero');
    _toggleBookFormInputs($elForm);
}

function selectToUpdate(ev, el) {
    ev.preventDefault();
    const $elCurr = $(el)

    const buttons = $elCurr.closest('div').children('button').toArray();
    buttons.forEach((btn)=>{
        if($(btn).hasClass('active')) $(btn).removeClass('active');
    });
    $elCurr.addClass('active');

    const $container = $('.update-input-container');
    switch(el.dataset.type){
        case 'id':
            $container.html(`<input class="update-input" type="number" placeholder="please insert the new id"
            "/>`);
            break;
        case 'name':
            $container.html(`<input class="update-input" type="text" placeholder="please insert the name"
            "/>`);
            break;
        case 'price':
            $container.html(`<input class="update-input" type="number" placeholder="please insert the new price"
            "/>`);
            break;
        case 'img-url':
            $container.html(`<input class="update-input" type="text" placeholder="please insert the img-url"
            "/>`);
            break;
        case 'details':
            $container.html(`<textarea class="update-input" rows="4" cols="50" placeholder="please insert the book details"
            "/>`);
            break;
    }
}

function onUpdateFormSubmition(ev,el){
    ev.preventDefault();

    const currData = {};
    if($('.update-input-container').children('*').length < 1 || !$('.update-input-container > ').val()) return;

    currData.id = gCurrBookID;
    currData.type = $(el).find('button.active').data().type;
    currData.updateValue = $('.update-input-container > ').val();
   
    updateBook(currData);
    onCloseUpdateForm();
    renderBooks();
}

function onBookFormSubmition(ev){
    ev.preventDefault();

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


function onOpenBookForm(ev){
    ev.preventDefault();
    
    const $elForm = $('form[name="form1"] .form-frame');
    if($elForm.hasClass('op-zero')){
        $elForm.removeClass('op-zero');
        _toggleBookFormInputs($elForm);
    } 
    
}

function onCloseBookForm (ev){
    ev.preventDefault();
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