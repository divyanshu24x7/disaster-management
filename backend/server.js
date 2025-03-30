import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Function to classify a tweet using Python script
const classifyTweet = (tweet) => {
    return new Promise((resolve, reject) => {
        const process = spawn("py", ["-3.12", "scripts\\bert.py", tweet]);

        let result = "";
        process.stdout.on("data", (data) => (result += data.toString()));
        process.stderr.on("data", (data) => console.error("Error:", data.toString()));

        process.on("close", () => {
            try {
                const output = JSON.parse(result.trim()); // Parse JSON from Python
                resolve(output);
            } catch (error) {
                reject(error);
            }
        });
    });
};


app.post("/classify-tweet", async (req, res) => {
    try {
        let { tweet } = req.body;
        if (!tweet) return res.status(400).json({ error: "No tweet provided" });

        let classifiedTweet = await classifyTweet(tweet);
        res.json(classifiedTweet);
    } catch (error) {
        res.status(500).json({ error: "Error processing tweet" });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
