import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { assert } from "console";
const redis = require("redis");

export const cryptoRouter = express.Router();
cryptoRouter.use(express.json());

cryptoRouter.get("/", async (_req, res) => {
    try {
        const cryptoData = await collections.crypto.find({}).toArray();
        res.status(200).send(cryptoData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

cryptoRouter.get("/", async (req, res) => {
    try {
        const { assetName } = req.query; 
        let query = {}; 

        if (assetName) {
            query = { asset_name: assetName }; 
        }
        const cryptoData = await collections.crypto.find(query).toArray();
        res.status(200).send(cryptoData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

cryptoRouter.post("/", async (req, res) => {
    try {
        const cryptoData = req.body;
        const result = await collections.crypto.insertOne(cryptoData);

        if (result.acknowledged) {
            res.status(201).send(`Added new trade information: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to finish the trade.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

cryptoRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const cryptoData = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.crypto.updateOne(query, { $set: cryptoData});

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to get trade information: ID ${id}`);
        } else {
            res.status(304).send(`Failed to get trade information: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

cryptoRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.crypto.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to get trade information: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to get trade information: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});


