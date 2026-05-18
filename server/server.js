import OpenAI from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const prisma = new PrismaClient();
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin: "*",
    },
});
app.use(cors());
app.use(express.json());
io.on("connection",(socket)=>{
   console.log("User connected");
});
app.get("/",(req,res)=>{
    res.send("Backend running");
});
app.get("/incidents",async(req,res)=>{
    try{
        const incidents =
          await prisma.incident.findMany({
          where: {
            status: {
            not: "Resolved",
          },
        },
    orderBy: {
      updated_at: "desc",
    },
  });
        res.json(incidents);
    }catch(error){
        res.status(500).json({
            error: "Failed to fetch incidents",
        });
    }
});
app.post("/incidents",async(req,res)=>{
    try{
        const{
            title,
            description,
            priority,
            reporter_name,
        }=req.body;
        if(
            !title||
            !description||
            !priority||
            !reporter_name
        ){
            return res.status(400).json({
                error: "All fields required",
            });
        }
        const incident = await prisma.incident.create({
            data:{
                title,description,
                priority,
                reporter_name,
            },
        });
        io.emit("incident-created");
        res.json(incident);
    }catch (error) {
  console.log(error);

  res.status(500).json({
    error: error.message,
  });
}
});
app.get("/incidents/:id",async(req,res)=>{
   try{
      const incident = await prisma.incident.findUnique({
        where:{
            id:Number(req.params.id),
        },
        include:{
            updates: true,
            ai_results:true,
        },
      });
      res.json(incident);
   }catch(error){
    res.status(500).json({
        error: "Failed to fetch incident",
    });
   }
});
app.post("/incidents/:id/updates",async(req,res)=>{
    try{
        const { message, author_name } = req.body;
        const update = await prisma.incidentUpdate.create({
            data:{
                incident_id: Number(req.params.id),
                message,
                author_name,
            },
        });
        await prisma.incident.update({
            where:{
                id: Number(req.params.id),
            },
            data:{
                latest_update: message,
            },
        });
        io.emit("new-update", update);
        res.json(update);
    }catch(error){
        res.status(500).json({
            error: "Failed to add update",
        }); 
    }
});
app.patch("/incidents/:id/status",async(req,res)=>{
  try{
    const { status } = req.body;
    const updatedIncident = 
    await prisma.incident.update({
        where:{
            id:Number(req.params.id),
        },
        data:{
            status,
        },
    });
    io.emit("status-updated");
    res.json(updatedIncident);
  }catch (error) {
  console.log(error);

  res.status(500).json({
    error: error.message,
  });
}
});
app.post("/incidents/:id/ai-summary",async(req,res)=>{
  try{
    const incident = await prisma.incident.findUnique({
        where:{
            id:Number(req.params.id),
        },
        include:{
            updates:true,
        },
    });
    const updateText = incident.updates.map((u)=>`${u.author_name}:${u.message}`).join("\n");
    const prompt = `Incident Title:${incident.title}
    Description:${incident.description}
    Updates: ${updateText}
    Give:
    1.Short Incident Summary
    2. Suggested Next Action`;
    const completion =
  await client.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
    const result = completion.choices[0].message.content;
    await prisma.aIResult.create({
        data:{
            incident_id: incident.id,
            type:"summary",
            result_text: result,
        },
    });
    res.json({
        result,
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
        error: error.message,
    });
  }
});
httpServer.listen(process.env.PORT,()=>{
  console.log(`Server running on port ${process.env.PORT}`);
});