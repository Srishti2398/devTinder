const express = require('express');
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const cors = require('cors');


// 🔧 FIXED typo in filename ("connecionRequest" → "connectionRequest")
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// 🔍 GET pending connection requests for logged-in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// 🔍 GET all accepted connections for logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);

        // ✅ Return the "other user" in each connection
        const connections = connectionRequests.map((row) => {
            return row.fromUserId._id.equals(loggedInUser._id)
                ? row.toUserId
                : row.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully",
            data: connections,
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


userRouter.get("/feed",userAuth,async (req, res) =>  {
    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) ||10;
        limit = limit>50 ?50:limit;

        const skip = (page-1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id},{toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId").populate("fromUserId","firstName").populate("toUserId","firstName");

        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            if (req.fromUserId && req.fromUserId._id) {
             hiddenUsersFromFeed.add(req.fromUserId._id.toString());
            }
            if (req.toUserId && req.toUserId._id) {
            hiddenUsersFromFeed.add(req.toUserId._id.toString());
            }


        });
        console.log(hiddenUsersFromFeed);

        const users = await User.find({
          $and: [
            {_id :{$nin: Array.from(hiddenUsersFromFeed)} ,},
            {_id: {$ne: loggedInUser._id } }
        ],
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.json({data:users});

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);

    }

});

module.exports = userRouter;
