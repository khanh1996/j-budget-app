var budgetController = (function () {})();

var UIController = (function () {
    var DOMString = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
    };
    var indexInc = 0;
    var indexExp = 0;
    return {
        showTotal: function (
            totalIncome,
            totalExpenses,
            percentageTotal,
            total
        ) {
            document.querySelector(".budget__income--value").textContent =
                "+ " + totalIncome;
            document.querySelector(".budget__expenses--value").textContent =
                "- " + totalExpenses;
            document.querySelector(
                ".budget__expenses--percentage"
            ).textContent = Math.floor(percentageTotal) + "%";
            document.querySelector(".budget__value").textContent =
                total > 0 ? "+" + total : total;
        },
        getInputValue: function () {
            return {
                inputType: document.querySelector(DOMString.inputType).value,
                inputDescription: document.querySelector(
                    DOMString.inputDescription
                ).value,
                inputValue: document.querySelector(DOMString.inputValue).value,
            };
        },
        addNewItem: function (listElement, itemInput) {
            var item = document.createElement("div");
            var item__description = document.createElement("div");
            var right = document.createElement("div");
            var item__value = document.createElement("div");
            var item__delete = document.createElement("div");
            var button = document.createElement("button");
            var i = document.createElement("i");
            var item__percentage = document.createElement("div");

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
            item__percentage.className = "item__percentage";

            // define content
            item__description.innerText = itemInput.inputDescription;
            itemInput.inputType === "inc"
                ? (item__value.innerText = "+" + itemInput.inputValue)
                : (item__value.innerText = "-" + itemInput.inputValue);
            item__percentage.innerText = "21%";
            // build dom html
            listElement.appendChild(item);
            item.append(item__description, right);
            itemInput.inputType === "inc"
                ? right.append(item__value, item__delete)
                : right.append(item__value, item__percentage, item__delete);
            item__delete.appendChild(button);
            button.appendChild(i);
        },
        deleteItem: function () {
            this.parentElement.parentElement.remove();
        },
    };
})();

var controller = (function (budgetCtrl, UICtrl) {
    var totalIncome = 0;
    var totalExpenses = 0;
    var total = 0;
    var percentageTotal = 0;

    // 4. Calculate budget

    // 5. Update the UI
    document.querySelector(".add__btn").addEventListener("click", function () {
        // 1. Get input value
        var input = UICtrl.getInputValue();
        console.log(input);
        // 2. Add the new item to our data structure
        if (input.inputType === "inc") {
            var income__list = document.querySelector(".income__list");
            UICtrl.addNewItem(income__list, input);
            totalIncome += parseInt(input.inputValue);
        } else {
            var expenses__list = document.querySelector(".expenses__list");
            UICtrl.addNewItem(expenses__list, input);
            totalExpenses += parseInt(input.inputValue);
            //console.log(totalExpenses);
        }
        // Show total income and expenses

        totalIncome >= totalExpenses && totalIncome != 0
            ? (percentageTotal = (totalExpenses * 100) / totalIncome)
            : (percentageTotal = 0);
        total = totalIncome - totalExpenses;

        console.log(totalIncome);
        console.log(totalExpenses);
        console.log(percentageTotal);
        console.log(total);
        UICtrl.showTotal(totalIncome, totalExpenses, percentageTotal, total);

        // 3 Delete element
        var button__delete = document.getElementsByClassName("item__delete");
        for (let index = 0; index < button__delete.length; index++) {
            button__delete[index].addEventListener("click", UICtrl.deleteItem);
        }
    });

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            console.log(input);
        }
    });
})(budgetController, UIController);
