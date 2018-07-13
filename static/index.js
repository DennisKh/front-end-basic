
function countItems(selector) {
  return document.querySelectorAll(selector).length;
};

function itemsElements(side, stor, i) {
  var itemTitle = document.querySelector('.'+side);
  var newElement = document.createElement('div');

  newElement.setAttribute('class', 'item');
  newElement.setAttribute('id', side+i);
  newElement.innerHTML = stor;
  itemTitle.appendChild(newElement);
}

function createItem(data, i) {

  function createTitle() {
    return `
      <div class="pic">
        <span>
          <img src="${data[i].img}">
        </span>
      </div>
      <div class="title">
        <span>
          <b>Название:</b> "${data[i].name}"
        </span>
        <span>
          <b>Автор:</b> ${data[i].author}
        </span>
      </div>
      <div class="after" onClick=addItemToRight(this)>
      </div>
    `;
  };
  //console.log(createTitle());
  localStorage.setItem('left_task'+i, createTitle());
};

function readJSONFile(file, callback) {
    var dataFile = new XMLHttpRequest();
    dataFile.overrideMimeType("application/json");
    dataFile.open("GET", file, true);
    dataFile.onreadystatechange = function() {
        if (dataFile.readyState === 4 && dataFile.status == "200") {
            callback(dataFile.responseText);
        }
    }
    dataFile.send(null);
}

readJSONFile("/home/dennis/front-end-basic/static/data.json", function(text){
  if (localStorage.length == 0) {
    //console.log(text);
    var data = JSON.parse(text);
    //console.log(data);
    for (var i = 1; i <= 23; i++) {
      createItem(data, i);
    };
  }
});

function addItemToRight(el) {
  var idItem = el.parentNode.getAttribute('id');
  var checkSide = idItem.charAt(0);
  var last = parseInt(idItem.replace(/\D+/g,""));
  var thisItem = document.getElementById(idItem).innerHTML;

  if (checkSide === 'l') {
    var itemTitle = document.querySelector('.right');
    var newElement = document.createElement('div');

    newElement.setAttribute('id', 'right'+last);
    newElement.setAttribute('class', 'item');
    newElement.innerHTML = thisItem;
    itemTitle.appendChild(newElement);
    //console.log(thisItem);

    //Створюємо сховище
    localStorage.removeItem('left_task'+last);
    localStorage.setItem('task'+last, thisItem);

    document.querySelector('.right .after').classList.replace('after', 'before');
  }else {
    var itemTitle = document.querySelector('.left');
    var newElement = document.createElement('div');
    var last = parseInt(idItem.replace(/\D+/g,""));

    newElement.setAttribute('class', 'item');
    newElement.setAttribute('id', 'left'+last);
    newElement.innerHTML = thisItem;
    itemTitle.appendChild(newElement);
    localStorage.removeItem('task'+last);
    localStorage.setItem('left_task'+last, thisItem);

    document.querySelector('.left .before').classList.replace('before', 'after');
    //Плюсую індекс для таску в сховищі
  }

  //Видаляю вибраний елемент з лівої таблиці
  var elem = document.getElementById(el.parentNode.getAttribute('id'));
  elem.remove();
}

function deleteItemFromRight() {
  alert('Hello')
}

window.addEventListener('load', function () {
  // При завантаженні сторінки підтягую дані з сховища
  //і заново заповнюю праву таблицю
  for (var i = 1; i <= localStorage.length; i++) {
    var stor = localStorage.getItem('left_task'+i);
    //console.log(stor);
    if (stor != null) {
      itemsElements('left', stor, i)
    }
    if (document.querySelector('.left .before')) {
      document.querySelector('.left .before').classList.replace('before', 'after');
    }
  }

  for (var i = 1; i <= localStorage.length; i++) {
    var stor = localStorage.getItem('task'+i);

    if (stor != null) {
      itemsElements('right', stor, i)
      document.querySelector('.right .after').classList.replace('after', 'before');
    }
  }

  var itemsCountLeft = countItems('.left .item');
  document.getElementById('left-count').innerHTML = 'Ви маєте ' + itemsCountLeft + ' книг!';
  var itemsCountRight = countItems('.right .item');
  document.getElementById('right-count').innerHTML = 'Ви обрали ' + itemsCountRight + ' книг!';
});

var input = document.getElementById('authorSearch');

//window.onload = getAuthName('Скотт Линч');
input.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && input.value) getAuthName(input.value);
});
function getAuthName(input) {
  //console.log(input);
  fetch('/home/dennis/front-end-basic/static/data.json')
  .then(function(response) {
    return response.json();
  }).then(function(j) {
    var authorName = ''
    var itemTitle = document.querySelector('.right');
    itemTitle.innerHTML = '';
    itemTitle = document.querySelector('.left');
    itemTitle.innerHTML = '';
    for (var key in j){
      authorName = j[key].author;

      if (authorName === input) {
        var newdata = j[key];
        console.log(authorName === input);
        var i = 1;
        sortItems(newdata, i);
        ++i;
        //console.log(j[key].name);
      }
    }
  });
}
function sortItems(sortdata, index) {
  console.log(sortdata);
  function create() {
    return `
      <div class="pic">
        <span>
          <img src="${sortdata.img}">
        </span>
      </div>
      <div class="title">
        <span>
          <b>Название:</b> "${sortdata.name}"
        </span>
        <span>
          <b>Автор:</b> ${sortdata.author}
        </span>
      </div>
      <div class="after" onClick=addItemToRight(this)>
      </div>
    `;
  };
    itemsElements('left', create(), index)
}

function refresh() {
  localStorage.clear();
  readJSONFile("/home/dennis/front-end-basics/static/data.json", function(text){
    if (localStorage.length == 0) {
      //console.log(text);
      var data = JSON.parse(text);
      //console.log(data);
      for (var i = 1; i <= 23; i++) {
        createItem(data, i);
      };
    }
  });
  window.location.reload()
}
