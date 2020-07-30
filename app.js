var budgetController = (function () {})();

var UIController = (function () {
    var DOMString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
    };
    return {
        getInputValue: function () {
            return {
                inputType: document.querySelector(DOMString.inputType).value,
                inputDescription: document.querySelector(
                    DOMString.inputDescription
                ).value,
                inputValue: document.querySelector(DOMString.inputValue).value,
            };
        },
    };
})();

var controller = (function (budgetCtrl, UICtrl) {
    var arrInputInc = [];
    var arrInputExp = [];
    var indexInc = 0;
    var indexExp = 0;

    // 4. Calculate budget

    function addNewItem(listElement, itemInput) {
        var item = document.createElement("div");
        var item__description = document.createElement("div");
        var right = document.createElement("div");
        var item__value = document.createElement("div");
        var item__delete = document.createElement("div");
        var button = document.createElement("button");
        var i = document.createElement("i");

        // set attr
        itemInput.inputType === "inc"
            ? (item.id = "income-" + indexInc++)
            : (item.id = "expense-" + indexExp++);

        item.className = "item clearfix";
        item__description.className = "item__description";
        right.className = "right clearfix";
        item__value.className = "item__value";
        item__delete.className = "item__delete";
        button.className = "item__delete--btn";
        i.className = "ion-ios-close-outline";
        item__delete.click = "myFunction()";

        // define content
        item__description.innerText = itemInput.inputDescription;
        itemInput.inputType === "inc"
            ? (item__value.innerText = "+" + itemInput.inputValue)
            : (item__value.innerText = "-" + itemInput.inputValue);
        // build dom html
        listElement.appendChild(item);
        item.append(item__description, right);
        right.append(item__value, item__delete);
        item__delete.appendChild(button);
        button.appendChild(i);
    }

    function deleteItem() {
        this.parentElement.parentElement.remove();
    }

    // 5. Update the UI
    document.querySelector(".add__btn").addEventListener("click", function () {
        // 1. Get input value
        var input = UICtrl.getInputValue();
        console.log(input);
        if (input.inputType === "inc") {
            var income__list = document.querySelector(".income__list");
            addNewItem(income__list, input);
            arrInputInc.push(input);
        } else {
            var expenses__list = document.querySelector(".expenses__list");
            addNewItem(expenses__list, input);
            arrInputExp.push(input);
        }
        // 2. Add the new item to our data structure

        console.log(arrInputInc);
        console.log(arrInputExp);
        // deleteItem();
        //console.log(input);
        // 3 Delete element
        var button__delete = document.getElementsByClassName("item__delete");
        for (let index = 0; index < button__delete.length; index++) {
            button__delete[index].addEventListener("click", deleteItem);
        }
    });

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            console.log(input);
        }
    });
})(budgetController, UIController);
