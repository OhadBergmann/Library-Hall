'use strict'


var gCurrBookID = -1;
var gDirction = {name: true,price: true};

function onInit(){
    _loadFromQueryParams();
    renderBooks();
}



function renderBooks(){
    $('.books-table').html(_generateTableHTML());
    _changePageProgressionBTNs();
}



function onTablePageChange (isForward){
    var books = getBooks();
    var currPageNum = getCurrentPageNum();
    const lastPage = +$('.current-page').text(); 
    
    if(isForward && lastPage + 1 <= books.length){
        currPageNum++;
        setCurrentPageNum(currPageNum);
    } else if (lastPage - 1 >= 0){
        currPageNum--;
        setCurrentPageNum(currPageNum);
    }

    $('.current-page').text(currPageNum + 1);
    renderBooks();
}



function onDeleteBook(el){
    const id = el.parentElement.parentElement.firstElementChild.innerText.trim();
    removeBook(id);
    renderBooks();
}


function onSetFilterBy(obj){

    if(Boolean(obj.maxPrice)) {
        $('label.filter-price-value').text(obj.maxPrice + '$');
    } else if(Boolean(obj.minRate)) {
        $('label.filter-rate-value').text(obj.minRate)
    }

    setCurrentFilter(obj);
    _setQueryParams();
    renderBooks();
}

function onSortBooks(sortingFactor) {
    sortBooks(sortingFactor,gDirction[sortingFactor]);
    gDirction[sortingFactor] = !gDirction[sortingFactor];
    renderBooks();
}

function onReadInfo(el){
    var $el; 
    Boolean(el.length) ? $el = el : $el = $(el);
    gCurrBookID = +$el.closest('tr').first().children('th').text().trim();
    console.log($el.closest().children('th'))
    const book = getBookByID(gCurrBookID);

    $('.info-panel').removeClass('hide-aside');
    $('.book-info-name').text(book.name);
    $('.book-info-id').text('Book ID: ' + book.id);
    $('.book-info-price').text('Price: ' + book.price);
    if(Boolean(book.rate)) $('.book-info-rate span').text(book.rate);
    !book.imgUrl? $('.book-cover').attr('src','img/default-cover.png') : $('.book-cover').attr('src',book.imgUrl);
    $('.info-panel .first-letter').text(book.info.charAt(0));
    $('.info-panel .book-info-txt').text(book.info.substring(1));

    setInfoPanelStatus({isOpen: true,bookId: gCurrBookID});
    _setQueryParams();
}



function onCloseInfo() {
    $('.info-panel').addClass('hide-aside');
    setInfoPanelStatus(null);
    _setQueryParams();
}

function onRateChange(el){
    const direction = $(el).text().trim();

    updateBookRate(gCurrBookID,direction);
    $('.book-info-rate span').text(getBookByID(gCurrBookID).rate); 
}

function onUpdateBook(el){
    gCurrBookID = $(el).closest('tr').children('*').first().text()
    
    const $elForm = $('form[name="form2"] .form-frame');
    $elForm.removeClass('op-zero');
    _toggleBookFormInputs($elForm);

}

function onCloseUpdateForm(ev){
    if(Boolean(ev)) ev.preventDefault();

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
    currData.updateValue = +$('.update-input-container > ').val() <= +$('.filter-Price-range').val() ? 
    +$('.update-input-container > ').val() : 1000;
   
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

function _loadFromQueryParams(){
    const paramsStr = new URLSearchParams(window.location.search)
    const filter = {
        maxPrice: +paramsStr.get('maxPrice') || 1000,
        minRate: +paramsStr.get('minRate') || 0
    }

    const status = {
        isOpen: paramsStr.get('isOpen') || 0,
        bookId: +paramsStr.get('bookId') || 0
    }

    if (!filter.maxPrice && !filter.minRate){
        renderBooks();
        _changePageProgressionBTNs ();
        return;
    }

    if(Boolean(filter.maxPrice)) {
        $('label.filter-price-value').text(filter.maxPrice + '$');
        $('.max-price input').val(filter.maxPrice);
    }
    
    if(Boolean(filter.minRate)) {
        $('label.filter-rate-value').text(filter.minRate)
        $('.min-rate input').val(filter.minRate);
    }

    if (!Boolean(status.isOpen + status.bookId)){
        setCurrentFilter(filter);
        renderBooks();
        return;
    } else {
        
        setInfoPanelStatus(status)
        setCurrentFilter(filter);
        
        
        renderBooks();
        const el = $('th.content').toArray().find((node) => +node.innerText.trim() >= status.bookId);
        onReadInfo(el);
        console.log(el)
     
    }

    
}

function  _setQueryParams() {
    const filter = getFilter();
    const infoStatus = getInfoPanelStatus();
    var paramsStr;
    if(Boolean(infoStatus)){
        paramsStr = `?maxPrice=${filter.maxPrice}&minRate=${filter.minRate}&isOpen=${infoStatus.isOpen}&bookId=${infoStatus.bookId}`;
    } else {
        paramsStr = `?maxPrice=${filter.maxPrice}&minRate=${filter.minRate}`;
    }
    
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + paramsStr;
    window.history.pushState({ path: newUrl }, '', newUrl);
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
    

    var booksLength = haveCurrentFilter() ? [].concat.apply([],getBooksFilterBy()).length : [].concat.apply([],getBooks()).length;
    const currPageNum = getCurrentPageNum();

    if(currPageNum === 0){
        $('.btn.prev').prop( 'disabled', true );
        $('.btn.prev').addClass('disabled-btn');
        if(booksLength <= getDisplayAmount()){
            $('.btn.next').prop( 'disabled', true );
            $('.btn.next').addClass('disabled-btn');
        } else{
            if( $('.btn.next').hasClass('disabled-btn')){
                $('.btn.next').prop( 'disabled', false );
                $('.btn.next').removeClass('disabled-btn');
            }
        }
    } else if((currPageNum + 1) * getDisplayAmount() <= booksLength){
        $('.btn.next').prop( 'disabled', false );
        $('.btn.next').removeClass('disabled-btn');
        if( $('.btn.prev').hasClass('disabled-btn')){
            $('.btn.prev').prop( 'disabled', false );
            $('.btn.prev').removeClass('disabled-btn');
        }
    } else {
        $('.btn.next').prop( 'disabled', true );
        $('.btn.next').addClass('disabled-btn');
        if( $('.btn.prev').hasClass('disabled-btn')){
            $('.btn.prev').prop( 'disabled', false );
            $('.btn.prev').removeClass('disabled-btn');
        }
    }
}

function _generateTableHTML(){
    var strHTMLs = [];
    var books = haveCurrentFilter() ?  getBooksFilterBy() : getBooks();
    const currPageNum = getCurrentPageNum();
    const displayLength = getDisplayAmount();

    if(!Boolean(books[currPageNum])){
        strHTMLs = _getEmptyTableRow(displayLength);
    } else if(books[currPageNum].length === displayLength){
        
        for(let i = 0; i < displayLength; i++ ){
            strHTMLs[i] = (`<tr ${_checkOddNum(i) ? 'class="odd-row"' : ''}><th class="content">${books[currPageNum][i].id}
            </th><td class="content">${books[currPageNum][i].name}</td>
            <td class="content center-txt">${books[currPageNum][i].price}</td><td class="content center-txt">
            ${books[currPageNum][i].rate}</td><td class="action-btn"><button class="blue-btn" 
            onclick="onReadInfo(this)">Read</button></td><td class="action-btn"><button class="orange-btn" 
            onclick="onUpdateBook(this)">Update</button></td><td class="action-btn"><button 
            onclick="onDeleteBook(this)">Delete</button></td></tr>`);
        };

    } else if (books[currPageNum].length > 0){
        
        for(let i = 0; i < displayLength; i++ ){
            
            if(books[currPageNum][i]){
                strHTMLs[i] = (`<tr ${_checkOddNum(i) ? 'class="odd-row"' : ''}><th class="content">${books[currPageNum][i].id}
                </th><td class="content">${books[currPageNum][i].name}</td>
                <td class="content center-txt">${books[currPageNum][i].price}</td><td class="content center-txt">${books[currPageNum][i].rate}</td>
                <td class="action-btn"><button class="blue-btn" onclick="onReadInfo(this)">Read</button></td>
                <td class="action-btn"><button class="orange-btn" onclick="onUpdateBook(this)">Update</button>
                </td><td class="action-btn"><button onclick="onDeleteBook(this)">Delete</button></td></tr>`);
            } else {
                strHTMLs[i] = _getEmptyTableRow(1).join('');
            }

        }

    }

    strHTMLs.unshift(`<table><thead><tr><th>I.D</th><th class="table-pseudo-btn" onclick="onSortBooks('name')">Name</th>
    <th class="table-pseudo-btn" onclick="onSortBooks('price')">Price</th><th>Rating</th>
    <th class="actions" colspan="3">Actions</th></tr></thead><tbody>`); 
    strHTMLs.push(`</tbody></table>`);

    return strHTMLs.join('');
}

function _getEmptyTableRow(num){
    var EmptyRows = [];
    num = Math.abs(num);

    for (let i = 0; i < num; i++) {
        EmptyRows[i] = `<tr><th class="content"></th><td class="content"></td><td class="content center-txt">
        <td class="content center-txt"><td class="action-btn"></td><td class="action-btn"></td></td>
        <td class="action-btn"></td></tr>`;
    }

    return EmptyRows;
}