import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const feedbackRouter = express.Router();
feedbackRouter.use(express.json());

feedbackRouter.get("/", async (_req, res) => {
    try {
        const feedback = await collections.feedback.find({}).toArray();
        res.status(200).send(feedback);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

feedbackRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const feedback = await collections.feedback.findOne(query);

        if (feedback) {
            res.status(200).send(feedback);
        } else {
            res.status(404).send(`Failed to find feedback: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find feedback: ID ${req?.params?.id}`);
    }
});

feedbackRouter.post("/", async (req, res) => {
    try {
        const feedback = req.body;
        const result = await collections.feedback.insertOne(feedback);

        if (result.acknowledged) {
            res.status(201).send(`Created a new feedback: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create new feedback.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

feedbackRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const feedback = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.feedback.updateOne(query, { $set: feedback });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find feedback: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update feedback: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

feedbackRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.feedback.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove feedback: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find feedbacks: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

