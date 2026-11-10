import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail  from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "petmy-app"
 });

// Create an empty array where we'll export future Inngest functions

const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
        triggers: {
            event: "clerk/user.created"
        }
    },
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        let username = email_addresses[0].email_address.split("@")[0];  

        // check if user already exists in the database
       const user = await User.findOne({username})

       if (user) {
        username = username + Math.floor(Math.random() * 10000);
       }

       const userData = {
        _id: id,
        username: username,
        email: email_addresses[0].email_address,
        full_name: first_name + " " + last_name,
        profile_picture: image_url
       };

         await User.create(userData);
       
    }
);

// ingest function to sync user updation from clerk to our database

const syncUserUpdation = inngest.createFunction(
    {
        id: "sync-user-from-clerk-update",
        triggers: {
            event: "clerk/user.updated"
        }
    },
    
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
       
        const updatedUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url
        };
        await User.findByIdAndUpdate(id, updatedUserData);
       
    }
);

// ingest function to sync user deletions from clerk to our database

const syncUserDeletion = inngest.createFunction(
    {
        id: "sync-user-from-clerk-delete",
        triggers: {
            event: "clerk/user.deleted"
        }
    },
    async ({event}) => {
        const {id} = event.data;
        await User.findByIdAndDelete(id);
    }
);


// inngest function to send reminder when a new connection request is added
const sendConnectionRequest = inngest.createFunction(
    {
        id: "send-connection-request",
        triggers: {
            event: "app/connection-request"
        }
    },
    async ({ event, step }) => {
        const { connectionId } = event.data;

        await step.run("Send Connection Request Email", async () => {
            const connection = await Connection.findById(connectionId)
                .populate("sender")
                .populate("receiver");

            if (!connection) {
                return { message: "Connection not found" };
            }

            const subject = "New Connection Request";
            const body = `
                <p>Hello ${connection.receiver.full_name},</p>
                <p>You have a new connection request from ${connection.sender.full_name}.</p>
            `;

            await sendEmail({ to: connection.receiver.email, subject, body });
            return connection;
        });

        const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await step.sleepUntil(in24Hours);

        await step.run("send-connection-request-reminder", async () => {
            const connection = await Connection.findById(connectionId)
                .populate("sender")
                .populate("receiver");

            if (connection?.status === "pending") {
                const subject = "Reminder: Connection Request Pending";
                const body = `
                    <p>Hello ${connection.receiver.full_name},</p>
                    <p>This is a reminder that you have a pending connection request from ${connection.sender.full_name}.</p>
                `;

                await sendEmail({ to: connection.receiver.email, subject, body });
                return { message: "Reminder email sent successfully" };
            }

            return { message: "No pending connection reminder needed" };
        });
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendConnectionRequest
];