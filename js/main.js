
/*======================================
-----------------TASKS------------------
=======================================*/
// Create new array to save tasks || access stored array from local storage
	var getFromMem = localStorage.getItem('tasks');
		getFromMem = JSON.parse(getFromMem);

	if (!getFromMem) {
		var tasks = [];
	} else {
		tasks = getFromMem;
	}

//Renders stored tasks to web
	renderTasks();
	function renderTasks() {
		if (tasks) {
			for (var i = 0; i < tasks.length; i++) {
				createDOMElement(tasks[i]);
			}
		}
	}

//Global variable to decide if editing or setting new task
var edit = false;
var editItemIndex;

//Checking if button 'SAVE' was clicked -> creates new task
	document.getElementById('save').addEventListener('click', function() {
		let taskTitle = document.getElementById('title').value;
		if (taskTitle) {
			if (edit) {
				updateTask(taskTitle);
			} else {
				setTask(taskTitle);
			}
		}
	});

//Checking if button 'Enter' was pressed -> creates new task
	document.getElementById('title').addEventListener('keydown', function(e) {
		if (e.code === 'Enter' || e.code === "NumpadEnter" && this.value) {
			let taskTitle = this.value;
			if (taskTitle) {
			if (edit) {
				updateTask(taskTitle);
			} else {
				setTask(taskTitle);
			}
		}
		}
	});

//Adds new task to array and sends command to create DOM element
	function setTask(title) {
		tasks.push(title);

		createDOMElement(title);
		saveToMem();

		document.getElementById('title').value = '';
	}

//Save 'tasks' array to local storage
	function saveToMem() {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem('tasks', JSON.stringify(tasks));
		};
	};

//Creates DOM element with inserted parameters
	function createDOMElement(title) {
		let target 			= document.querySelector('ul');
		let firstElement 	= target.querySelector('li') || undefined;
		let listItem 		= document.createElement('li');
		let penIcon 		= document.createElement('i');
		let checkIcon 		= document.createElement('i');
		let text 			= document.createElement('div');

		text.innerHTML = title;
		listItem.classList.add("task__task-item");
		penIcon.classList.add("fas", "fa-pen");
		checkIcon.classList.add("fas", "fa-check");

		penIcon.addEventListener('click', prepareForEdit);
		checkIcon.addEventListener('click', removeTask);

		listItem.appendChild(text);
		listItem.appendChild(penIcon);
		listItem.appendChild(checkIcon);

		target.insertBefore(listItem, firstElement);
	};

	function prepareForEdit() {
		let item 	= this.parentNode;
		let title 	= item.childNodes[0].textContent;

	//Get items childNode index
		editItemIndex = item.parentNode.childNodes.length-1;
		while ((item = item.previousSibling) !== null) {
			editItemIndex--;
		}

		let target 	= document.getElementById('title');
		target.value = title;
		target.focus();
		edit = true;
	};

//
	function updateTask(title) {
		let numOfTasks = document.querySelector('.task__task-list').childNodes.length-1;
		let item = document.querySelector('.task__task-list').childNodes[numOfTasks-editItemIndex];
		let itemTitle 	= item.childNodes[0];

		tasks[editItemIndex] = title;
		itemTitle.innerHTML = title;

		saveToMem();

		document.getElementById('title').value = '';

		edit = false;
	}

//Delete task
	function removeTask(e) {
		if (!edit) {
			let item 	= this.parentNode || e;
			let list 	= item.parentNode;
			let title = item.childNodes[0].textContent;
			let index 	= tasks.indexOf(title);

			tasks.splice(index, 1);

			saveToMem();

			list.removeChild(item);
		} else {
			alert("Finish editing your task!");
		}
	};
