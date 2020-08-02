// BUDGET CONTROLLER Database nơi lưu trữ quản lý dữ liệu
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
    };

    return {
        addItem: function (obj, type) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === "exp") {
                newItem = new Expense(ID, obj.description, obj.value);
            } else if (type === "inc") {
                newItem = new Income(ID, obj.description, obj.value);
            }

            // Push item to data
            data.allItems[type].push(newItem);
            return newItem;
        },
        test: function () {
            console.log(data);
        },
        calculateBudget: function (type) {
            data.totals[type] = 0;
            data.allItems[type].forEach((element) => {
                data.totals[type] += parseInt(element.value);
            });
            return data.totals;
        },
        removeItem: function (self) {
            var idStr = self.parentElement.parentElement.id;
            var idDel = parseInt(idStr.charAt(idStr.length - 1));
            if (idStr.includes("income")) {
                for (let index = 0; index < data.allItems.inc.length; index++) {
                    const element = data.allItems.inc[index];

                    if (idDel === element.id) {
                        data.allItems.inc.splice(element.id, 1);
                    }
                }
            } else if (idStr.includes("expense")) {
                for (let index = 0; index < data.allItems.exp.length; index++) {
                    const element = data.allItems.exp[index];

                    if (idDel === element.id) {
                        data.allItems.exp.splice(element.id, 1);
                    }
                }
            }
        },
    };
})();

// UI CONTROLLER Nơi thao tác với DOM
var UIController = (function () {
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetIncomeValue: ".budget__income--value",
        budgetExpensesValue: ".budget__expenses--value",
        budgetValue: ".budget__value",
        budgetExpensesPercent: ".budget__expenses--percentage",
        itemDelete: ".item__delete",
        itemPercentage: ".item__percentage",
    };
    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription)
                    .value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        addListItem: function (type, item) {
            var html, element;
            // Create html strings with placeholer text
            if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholer text with some actual data
            html = html.replace("%id%", item.id);
            html = html.replace("%description%", item.description);
            html = html.replace("%value%", item.value);
            // Add item to DOM
            document
                .querySelector(element)
                .insertAdjacentHTML("beforeend", html);
        },
        getAllData: function (allData, type) {
            if (type === "inc") {
                document.querySelector(
                    DOMStrings.budgetIncomeValue
                ).textContent = allData[type];
            } else if (type === "exp") {
                document.querySelector(
                    DOMStrings.budgetExpensesValue
                ).textContent = allData[type];
            }
            // show total budget
            var total = allData.inc - allData.exp;
            document.querySelector(DOMStrings.budgetValue).textContent = total;
            // show budget item Expenses percent

            // if (total > 0) {
            //     var valueItemPercent = Math.floor((allData.exp * 100) / total);
            //     document.querySelector(
            //         DOMStrings.itemPercentage
            //     ).textContent = valueItemPercent;
            // } else {
            //     valueItemPercent = 0;
            // }

            // show All budget Expenses percent
            if (allData.inc >= allData.exp && allData.inc != 0) {
                var budgetPercent = Math.floor(
                    (allData.exp * 100) / allData.inc
                );
                document.querySelector(
                    DOMStrings.budgetExpensesPercent
                ).textContent = budgetPercent + "%";
            } else {
                document.querySelector(
                    DOMStrings.budgetExpensesPercent
                ).textContent = 0 + "%";
            }
        },
        removeListItem: function (self) {
            self.parentElement.parentElement.remove();
        },
    };
})();

// GOALBAL APP CONTROLLER Nơi thao tác với người dùng
var controller = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings();
    function setupListenerEvents() {
        document
            .querySelector(DOM.inputBtn)
            .addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    }

    function ctrlAddItem() {
        // 1. Get input value
        var input = UICtrl.getInput();

        // 2. Add the new item to our data structure
        var newItem = budgetCtrl.addItem(input, input.type);
        // 3.  Add the new item to the UI
        UICtrl.addListItem(input.type, newItem);
        // 4. Calculate budget
        var allData = budgetCtrl.calculateBudget(input.type);
        // 5. Update the UI
        UICtrl.getAllData(allData, input.type);
        // 6. Delete item
        // setup click for each item delete
        var arrAllItemDel = document.querySelectorAll(DOM.itemDelete);
        for (let index = 0; index < arrAllItemDel.length; index++) {
            const element = arrAllItemDel[index];
            element.addEventListener("click", ctrlDeleteItem);
        }
    }
    function ctrlDeleteItem() {
        // delete DB
        var idStr = this.parentElement.parentElement.id;
        budgetCtrl.removeItem(this);
        if (idStr.includes("income")) {
            var allData = budgetCtrl.calculateBudget("inc");
            UICtrl.getAllData(allData, "inc");
        } else if (idStr.includes("expense")) {
            var allData = budgetCtrl.calculateBudget("exp");
            UICtrl.getAllData(allData, "exp");
        }
        UICtrl.removeListItem(this);
    }

    return {
        init: function () {
            setupListenerEvents();
            console.log("App running!");
        },
    };
})(budgetController, UIController);

controller.init();
