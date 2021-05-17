const AWS = require("aws-sdk");
const config = require("../../config/db");
const uuidv1 = require("uuid/v1");

//save charger
const addCharger = function (req, res) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_charger";

  const Item = {
    id: uuidv1(),
    chargerName: req.body.chargerName,
    chargerId: req.body.chargerId,
    serviceId: "PTR" + Math.floor(100000 + Math.random() * 900000),
    powerRating: req.body.powerRating,
    availability: req.body.availability,
    plugType: req.body.plugType,
    cost: req.body.cost,
    location: {
      long: req.body.location.long,
      lat: req.body.location.lat,
      pincode: req.body.location.pincode,
    },
    amenities: req.body.amenities,
    isActive: 1,
  };

  var params = {
    TableName: table,
    Item: Item,
  };
  try {
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
          data: Item,
        });
      }
    });
  } catch (e) {
    res.send({
      success: true,
      message: e,
    });
  }
};

//get charger by chargerId
const getCharger = async function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();
  const table = "app_charger";
  var params = {
    TableName: table,
    KeyConditionExpression: "#charger = :chargerId",
    ExpressionAttributeNames: {
      "#charger": "chargerId",
    },
    ExpressionAttributeValues: {
      ":chargerId": req.query.chargerId,
    },
  };

  docClient.query(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: JSON.stringify(err, null, 2),
      });
    } else {
      res.send({
        success: true,
        message: "SUCCESS",
        data: data.Items[0],
      });
    }
  });
};


module.exports = {
  addCharger,
  getCharger,
};
