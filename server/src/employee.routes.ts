import * as express from "express";
import * as mongodb from "mongodb";
const redis = require("redis");
import { collections } from "./database";

export const employeeRouter = express.Router();
const client = redis.createClient();

async function main() {

    client.on('error', (err: Error)  => console.log('Redis Client Error', err));
    await client.connect();

}

  
employeeRouter.use(express.json());

employeeRouter.get("/", async (_req, res) => {
    try {
      // Check if data is cached in Redis
      client.get("employees", async (err: Error, cachedEmployees: string) => {
        if (cachedEmployees) {
          // If data exists in cache, send the cached data
          const employees = JSON.parse(cachedEmployees);
          res.status(200).send(employees);
        } else {
          // If data is not cached, retrieve it from the database
          const employees = await collections.employees.find({}).toArray();
          // Cache the data for future requests (set cache expiry if needed)
          client.set("employees", JSON.stringify(employees));
          res.status(200).send(employees);
        }
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

  employeeRouter.get("/:id", async (req, res) => {
    try {
      const id = req?.params?.id;
      const query = { _id: new mongodb.ObjectId(id) };
  
      // Check if data is cached in Redis
      client.get(`employee:${id}`, async (err: Error, cachedEmployee: string) => {
        if (cachedEmployee) {
          // If data exists in cache, send the cached data
          const employee = JSON.parse(cachedEmployee);
          res.status(200).send(employee);
        } else {
          // If data is not cached, retrieve it from the database
          const employee = await collections.employees.findOne(query);
  
          if (employee) {
            // Cache the data for future requests (set cache expiry if needed)
            client.set(`employee:${id}`, JSON.stringify(employee));
            res.status(200).send(employee);
          } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
          }
        }
      });
    } catch (error) {
      res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
  });

  employeeRouter.post("/", async (req, res) => {
    try {
      // Clear the cache for employees since a new employee is added
      client.del("employees");
  
      const employee = req.body;
      const result = await collections.employees.insertOne(employee);
  
      if (result.acknowledged) {
        res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
      } else {
        res.status(500).send("Failed to create a new employee.");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });
  

employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.updateOne(query, { $set: employee });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
