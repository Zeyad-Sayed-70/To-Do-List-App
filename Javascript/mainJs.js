const todo_input = document.getElementById('ToDoText');
const add_btn = document.querySelector(".addBtn");
const list = document.querySelector('.list');
let lists = document.querySelectorAll('li');
const filter = document.getElementById('filter');
const search = document.getElementById('search');

// filter.options[1]
console.log(filter.options[2]);

let todoData = JSON.parse(localStorage.getItem('todo-data')) || [];

displayList(todoData)

let temp_id = 1;


// Start Events


add_btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if ( todo_input.value !== '' ) {
        addNewList(todo_input.value)
        todo_input.value = '';

        
        search.value = '';
        filterBySearch(ev.target.value);
    }
})

// Add Remove Event
list.addEventListener('click', (ev) => {
    if ( ev.target.classList.contains('remove') ) {
        // Update todoData
        let newTodoData = todoData.filter((e) => {return e.id != ev.target.parentElement.id});
        todoData = newTodoData;
        
        console.log(ev.target.parentElement.id)
        // Update LC
        setDataLc(todoData);

        ev.target.parentElement.remove();
        lists = document.querySelectorAll('li');
        updateBg();
        
    }
})

filter.addEventListener('change', (ev) => {

    if ( ev.target.value === 'text' ) {
        search.setAttribute('placeholder', 'Search here')
    }

    if ( ev.target.value === 'date' ) {
        search.setAttribute('placeholder', 'year/month/day')
    }
})

search.addEventListener('input', (ev) => {
    if ( filter.options[0].selected ) filterByText(ev.target.value);
    if ( filter.options[1].selected ) filterByDate(ev.target.value);
})


// End Events

function addNewList(val) {
    
    
    
    // Set Data to todoData
    todoData.push(
        {
            id: temp_id++,
            text: val,
            date: {
                year: new Date().getFullYear(),
                month: new Date().getMonth()+1,
                day: new Date().getDate(),
                hour: new Date().getHours(),
                minute: new Date().getMinutes(),
            }
        }
        );
        // console.log(todoData[0])
        createList(todoData);
        
        
        // Update Lists Variable
        lists = document.querySelectorAll('li');
        updateBg()
        
        
        // Set Data to LC
        setDataLc(todoData);
}

function createList(todoData) {
    list.innerHTML = '';

    for ( let i = 0; i < todoData.length; i++ ) {
        const {id, text, date: {year, month, day, hour, minute}} = todoData[i];

        // Create Main Elements
        const li = document.createElement('li');
        const span = document.createElement('span');
        const date = document.createElement('span');
        const button = document.createElement('button');
        
        // Add Classes to Elements
        li.className = 'bg-white d-flex align-items-center mb-2 p-3 px-5';
        span.className = 'text-dark col-7 col-md-9';
        date.className = 'col-4 col-md-2';
        button.className ='remove btn btn-danger fw-bold col-2 col-md-1';
        
        // Add Text Content for Elements
        span.innerText = `${text}`;
        date.innerText = `${year}/${month}/${day} \n ${hour > 12 ? `PM ${hour-12}` : `AM ${hour}`} : ${minute}`;
        button.innerText = 'x';
        
        
        // Add id to li
        li.setAttribute('id', id);
        
        // Appends
        li.append(span, date, button);
        list.appendChild(li);
        
        // Update Lists Variable
        lists = document.querySelectorAll('li');
        updateBg()
    }
}


// Update bg-color
function updateBg() {
    lists.forEach((e, i) => {
        if ( i % 2 === 0 ) e.classList.add('bg-gray');
        else e.classList.remove('bg-gray');
    })
}

// Set todo Data to localStorage
function setDataLc(data) {
    localStorage.setItem('todo-data', JSON.stringify(data));
}

function displayList(data) {
    list.innerHTML = '';
    createList(data);
}


// Search Filtering
function filterByText(val) {
    let newTodoData = todoData.filter((e) => {return ((e.text).toLowerCase()).includes(val.toLowerCase())});
    list.innerHTML = '';

    displayList(newTodoData);
    if ( newTodoData.length === 0 ) {
        const div = document.createElement('h4');
        div.innerText = 'Not Found';
        div.className = 'text-center text-dark';
        list.appendChild(div);
    }
}

function filterByDate(val) {
    if ( val !== '' ) {
        const year = val.slice(0, 4);
        const month = val[7] === '/' ? val.slice(5, 7) : val.slice(5, 6);
        const day = val[val.length-3] === '/' ? val[val.length-2] + val[val.length-1] : val[val.length-1];

        
        let newTodoData = todoData.filter((e) => {
            if ( e.date.year == year && e.date.month == month && e.date.day == day )
            return e;
        });
        
        console.log(newTodoData)
        list.innerHTML = '';
        displayList(newTodoData);

        if ( newTodoData.length === 0 ) {
            const div = document.createElement('h4');
            div.innerText = 'Not Found';
            div.className = 'text-center text-dark';
            list.appendChild(div);
        }
    } else {
        displayList(todoData)
    }
}