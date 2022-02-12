"use strict"

const LOW_PRIORITY = "low"
const HIGH_PRIORITY = "high"

class taskElemClass extends HTMLDivElement {
    constructor({text, priority, isActive}, {deleteCallback, changeStatusCallback}) {
        super();
        this.className = 'task';

        this.options = {
            text: text,
            priority: priority,
            isActive: isActive,
        };

        this.callbacks = {
            delete: deleteCallback,
            changeStatus: changeStatusCallback,
        }

        const checkBoxElem = document.createElement('div');
        this.checkBoxElem = checkBoxElem;
        checkBoxElem.className = 'check-box';
        this.setActiveStatus(isActive);
        checkBoxElem.addEventListener("click", () => {
            this.setActiveStatus(!this.options.isActive);
            this.callbacks.changeStatus();
        });

        const textElem = document.createElement('div');
        this.textElem = textElem;
        textElem.className = 'task__text';
        textElem.innerHTML = text;

        const deleteBtnElem = document.createElement('div');
        this.deleteBtnElem = deleteBtnElem;
        deleteBtnElem.className = 'delete-task-btn';
        deleteBtnElem.addEventListener("click", () => {
            this.delete();
        });

        this.append(checkBoxElem);
        this.append(textElem);
        this.append(deleteBtnElem);
    }

    getOptions() {
        return this.options;
    }

    setActiveStatus(isActive) {
        if (isActive) {
            this.checkBoxElem.classList.add('check-box_active');
            this.classList.add('task_active');
            this.options.isActive = true;
            return;
        }

        this.checkBoxElem.classList.remove('check-box_active');
        this.classList.remove('task_active');
        this.options.isActive = false;
    }

    delete() {
        this.remove();
        this.callbacks.delete();
    }
}

customElements.define('task-elem', taskElemClass, {extends: 'div'});


function PriorityForm(priority) {
    this.formElement = document.querySelector(`.${priority}-priority-task__form`);
    this.textElement = document.querySelector(`.${priority}-priority-task__form .task-form__text`);
    this.listElement = document.querySelector(`.${priority}-priority-task__list`);

    this.textElement.addEventListener('input', () => {
        this.textResize();
    });

    this.pressedKeys = [];
    this.textElement.addEventListener('keydown', (event) => {
        if (!this.pressedKeys.includes(event.code) && (event.code === "ShiftLeft" || event.code === "Enter")) {
            this.pressedKeys.push(event.code);
            this.keyHandler(event);
        }
    });
    this.textElement.addEventListener('keyup', (event) => {
        if (this.pressedKeys.includes(event.code)) {
            this.pressedKeys.splice(this.pressedKeys.indexOf(this.pressedKeys), 1);
        }
    });


    //todo т.к. отслеживаются две клавиши, то можно оставить только проверки на длину
    this.keyHandler = function (event) {
        const lineBreakCheck = this.pressedKeys.length === 2 && this.pressedKeys[0] === 'LeftShift' && this.pressedKeys[1] === 'Enter';
        if (lineBreakCheck) {
            return; // the html handler "enter" for <textarea> will work.
        }

        const submitCheck = this.pressedKeys[0] === 'Enter';
        if (submitCheck) {
            const submitEvent = new Event('submit');
            this.formElement.dispatchEvent(submitEvent);
            event.preventDefault();
        }
    }

    this.textResize = function () {
        this.textElement.style.height = '20px';
        const newHeight = this.textElement.scrollHeight;
        this.textElement.style.height = `${newHeight}px`;
    }

    this.resetText = function () {
        this.textElement.value = '';
    };

    this.getHtmlText = function () {
        const text = this.textElement.value;
        const textWithBreaks = text.split('\n').join('<br>');
        return textWithBreaks;
    };

    this.append = function (elem) {
        this.listElement.append(elem);
    };

    this.addPriorityFormListener = function (type, listener) {
        this.formElement.addEventListener(type, listener);
    }
}


const highPriorityForm = new PriorityForm(HIGH_PRIORITY);
const lowPriorityForm = new PriorityForm(LOW_PRIORITY);

export {taskElemClass, highPriorityForm, lowPriorityForm}