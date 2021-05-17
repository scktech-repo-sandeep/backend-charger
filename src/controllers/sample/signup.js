const AWS = require("aws-sdk");
const config = require("../../config/db");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

const registerCustomer = async function (req, res) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "charger_register";
  const Item = { ...req.body };
  Item.id = uuidv1();
  const salt = await bcrypt.genSalt(10);
  Item.password = await bcrypt.hash(Item.password, salt);
  const params = {
    TableName: table,
    Item: Item,
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: err,
      });
    } else {
      console.log(data);
      res.send({
        success: true,
        message: "SUCCESS",
        movie: Item,
      });
    }
  });
};

module.exports = {
  registerCustomer,
};
