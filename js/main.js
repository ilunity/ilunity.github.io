"use strict"
//todo Добавить сортировку для выполненных заданий
//todo Кнопка удаления всех выполненных заданий
//todo Добавить возможность редактировать задание


import {highPriorityForm, lowPriorityForm, taskElemClass} from "./view.js";
import {taskStorage} from "./storage.js";

const LOW_PRIORITY = "low"
const HIGH_PRIORITY = "high"


function syncTaskWithStorage(taskElem) {
    const options = taskElem.getOptions();
    const key = options.text;

    taskStorage.syncTask(key, options);
}

function deleteTaskFromStorage(taskElem) {
    taskStorage.delete(taskElem.options.text);
}

function loadTasks() {
    const tasks = taskStorage.get();
    for (let taskOptions of Object.values(tasks)) {
        addTask(taskOptions, true);
    }
}

function isUniqueTaskText(taskText) {
    const currentTaskTexts = Object.keys(taskStorage.get());
    return !currentTaskTexts.includes(taskText);
}

function getTasksList(priority) {
    let tasksList;
    if (priority === LOW_PRIORITY) {
        tasksList = lowPriorityForm;
    } else if (priority === HIGH_PRIORITY) {
        tasksList = highPriorityForm;
    }

    return tasksList;
}

//todo Существующие в памяти задания перезаписываются после перезагрузки
function addTask(options, rewriteSameTasks = false) {
    const {text, priority} = options;

    const tasksList = getTasksList(priority);


    if (!isUniqueTaskText(text) && !rewriteSameTasks) {
        alert('Такое задание уже существует');
        return;
    }

    let newTask = new taskElemClass(options, {
        deleteCallback() {
            deleteTaskFromStorage(newTask);
        },
        changeStatusCallback() {
            syncTaskWithStorage(newTask);
        },
    });

    taskStorage.add(options.text, options);
    tasksList.append(newTask);
}

//todo Добавить в PriorityForm .text с именем приоритета, передавать в addTask PriorityForm
highPriorityForm.addPriorityFormListener("submit", () => {
    addTask({
        text: highPriorityForm.getHtmlText(),
        priority: HIGH_PRIORITY,
        isActive: false,
    });
    highPriorityForm.resetText();
    highPriorityForm.textResize();
})
lowPriorityForm.addPriorityFormListener("submit", () => {
    addTask({
        text: lowPriorityForm.getHtmlText(),
        priority: LOW_PRIORITY,
        isActive: false,
    });
    lowPriorityForm.resetText();
    lowPriorityForm.textResize();
})

loadTasks();