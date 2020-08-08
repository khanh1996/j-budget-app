// BUDGET CONTROLLER Database nơi lưu trữ quản lý dữ liệu
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.caclPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    function totalBudget(type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
        budget: 0,
        percentage: -1,
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
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (cur) {
                return cur.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        caculateBudget: function () {
            // Caculate income and expenses
            totalBudget("inc");
            totalBudget("exp");

            // Caculate budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // Caculate percentage of income
            if (data.totals.inc > 0 && data.totals.inc > data.totals.exp) {
                data.percentage = Math.round(
                    (data.totals.exp / data.totals.inc) * 100
                );
            } else {
                data.percentage = -1;
            }
        },

        caculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.caclPercentage(data.totals.inc);
            });
        },

        getPercentage: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
        test: function () {
            console.log(data);
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
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensePercentageLabel: ".item__percentage",
        budgetDateLabel: ".budget__title--month",
        tooltip: ".tooltip",
    };

    formatNumber = function (num, type) {
        var splitNum;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split(".");
        integer = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        decimal = splitNum[1];
        return (type === "exp" ? "-" : "+") + " " + integer + "." + decimal;
    };

    nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription)
                    .value,
                value: parseFloat(
                    document.querySelector(DOMStrings.inputValue).value
                ),
            };
        },
        addListItem: function (type, item) {
            var html, element;
            // Create html strings with placeholer text
            if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholer text with some actual data
            html = html.replace("%id%", item.id);
            html = html.replace("%description%", item.description);
            html = html.replace("%value%", formatNumber(item.value, type));

            // Add item to DOM
            document
                .querySelector(element)
                .insertAdjacentHTML("beforeend", html);
        },
        displayPercentages: function (percentage) {
            var fields = document.querySelectorAll(
                DOMStrings.expensePercentageLabel
            );

            nodeListForEach(fields, function (current, index) {
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });

            // fields.forEach(function (field, index) {
            //   field.textContent = percentage[index] + '%';
            // });
        },
        deleteItemList: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldArr;
            fields = document.querySelectorAll(
                DOMStrings.inputDescription + ", " + DOMStrings.inputValue
            );

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current) {
                current.value = "";
            });

            fieldArr[0].focus();
        },
        displayBudget: function (obj) {
            console.log(obj);
            var type;
            obj.budget >= 0 ? (type = "inc") : (type = "exp");
            document.querySelector(
                DOMStrings.budgetLabel
            ).textContent = formatNumber(obj.budget, type);
            document.querySelector(
                DOMStrings.incomeLabel
            ).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(
                DOMStrings.expensesLabel
            ).textContent = formatNumber(obj.totalExp, "exp");
            if (obj.percentage !== -1) {
                document.querySelector(DOMStrings.percentageLabel).textContent =
                    obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent =
                    "---";
            }
        },
        displayMonth: function () {
            var now, months, month, year;
            months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.budgetDateLabel).textContent =
                months[month] + " " + year;
        },
        validationField: function (mutilField) {
            if (mutilField.description === "") {
                document.querySelectorAll(DOMStrings.tooltip)[0].style.display =
                    "block";
            }
            if (isNaN(mutilField.value)) {
                document.querySelectorAll(DOMStrings.tooltip)[1].style.display =
                    "block";
            }
            if (mutilField.description === "" && isNaN(mutilField.value)) {
                document.querySelectorAll(DOMStrings.tooltip)[0].style.display =
                    "block";
                document.querySelectorAll(DOMStrings.tooltip)[1].style.display =
                    "block";
            }
            document
                .querySelector(DOMStrings.inputDescription)
                .addEventListener("focus", function () {
                    document.querySelectorAll(
                        DOMStrings.tooltip
                    )[0].style.display = "none";
                });
            document
                .querySelector(DOMStrings.inputValue)
                .addEventListener("focus", function () {
                    document.querySelectorAll(
                        DOMStrings.tooltip
                    )[1].style.display = "none";
                });
        },
        changeType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.inputType +
                    "," +
                    DOMStrings.inputDescription +
                    "," +
                    DOMStrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle("red-focus");
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
        },
        getDOMStrings: function () {
            return DOMStrings;
        },
    };
})();

// GOALBAL APP CONTROLLER Nơi thao tác với người dùng
var controller = (function (budgetCtrl, UICtrl) {
    function setupListenerEvents() {
        var DOM = UICtrl.getDOMStrings();
        document
            .querySelector(DOM.inputBtn)
            .addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
        document
            .querySelector(DOM.container)
            .addEventListener("click", ctrlDeleteItem);
        document
            .querySelector(DOM.inputType)
            .addEventListener("change", UICtrl.changeType);
    }

    function updateBudget() {
        // 1. Calculate budget
        budgetController.caculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Update the UI
        UICtrl.displayBudget(budget);
    }

    function updatePercentages() {
        // 1. Caculate percentages
        budgetCtrl.caculatePercentages();

        // 2. Get percentages
        var percentages = budgetCtrl.getPercentage();

        // 3. Update UI with percentages
        UICtrl.displayPercentages(percentages);
    }

    function ctrlAddItem() {
        // 1. Get input value
        var input = UICtrl.getInput();
        if (
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Add the new item to our data structure
            var newItem = budgetCtrl.addItem(input, input.type);

            // 3.  Add the new item to the UI
            UICtrl.addListItem(input.type, newItem);

            // 4. Clear fields
            UICtrl.clearFields();

            // 5. calculate budget and update budget
            updateBudget();

            // 6. Update Percentages
            updatePercentages();
        } else {
            UICtrl.validationField(input);
        }
    }

    function ctrlDeleteItem(event) {
        var itemId, type, ID, splitId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split("-");
            type = splitId[0];

            ID = parseInt(splitId[1]);

            // 1. Delete item from data
            budgetCtrl.deleteItem(type, ID);

            // 2. Update budget
            updateBudget();

            // 3. Remove item from list
            UICtrl.deleteItemList(itemId);

            // 4. Update percentages
            updatePercentages();
        }
    }

    return {
        init: function () {
            setupListenerEvents();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
            console.log("App running!");
        },
    };
})(budgetController, UIController);

controller.init();
