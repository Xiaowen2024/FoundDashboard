import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const tradingHistoryRouter = express.Router();
tradingHistoryRouter.use(express.json());

tradingHistoryRouter.get("/", async (_req, res) => {
    try {
        const trades = await collections.tradingHistory.find({}).toArray();
        res.status(200).send(trades );
    } catch (error) {
        res.status(500).send(error.message);
    }
});

tradingHistoryRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const trades = await collections.tradingHistory.findOne(query);

        if (trades) {
            res.status(200).send(trades);
        } else {
            res.status(404).send(`Failed to find a trading history: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a trading history: ID ${req?.params?.id}`);
    }
});

tradingHistoryRouter.post("/", async (req, res) => {
    try {
        const trade = req.body;
        const result = await collections.tradingHistory.insertOne(trade);

        if (result.acknowledged) {
            res.status(201).send(`Failed to find a trading history: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to find a trading history.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

tradingHistoryRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const trade = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tradingHistory.updateOne(query, { $set: trade });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated the trading history: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find a trading history: ID ${id}`);
        } else {
            res.status(304).send(`Failed to find update an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

tradingHistoryRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tradingHistory.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a trading history: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a trading history: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a trading history: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
