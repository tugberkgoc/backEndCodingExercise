'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "transactions", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initials",
    "created": "2022-03-14T03:55:27.845Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
        fn: "createTable",
        params: [
            "transactions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "brandId": {
                    "type": Sequelize.STRING(6),
                    "field": "brandId",
                    "allowNull": false
                },
                "stripeCustomerId": {
                    "type": Sequelize.STRING,
                    "field": "stripeCustomerId",
                    "allowNull": false
                },
                "stripeChargeId": {
                    "type": Sequelize.STRING,
                    "field": "stripeChargeId",
                    "allowNull": false
                },
                "transactionDate": {
                    "type": Sequelize.DATEONLY,
                    "field": "transactionDate",
                    "allowNull": false
                },
                "transactionType": {
                    "type": Sequelize.STRING(10),
                    "field": "transactionType",
                    "allowNull": false
                },
                "amountOfCredits": {
                    "type": Sequelize.INTEGER,
                    "field": "amountOfCredits",
                    "allowNull": false
                },
                "costPerCredit": {
                    "type": Sequelize.DECIMAL(18, 2),
                    "field": "costPerCredit",
                    "allowNull": false
                },
                "discount": {
                    "type": Sequelize.DECIMAL(18, 2),
                    "field": "discount",
                    "allowNull": false
                }
            },
            {
                "transaction": transaction
            }
        ]
    }];
};
var rollbackCommands = function(transaction) {
    return [{
        fn: "dropTable",
        params: ["transactions", {
            transaction: transaction
        }]
    }];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
