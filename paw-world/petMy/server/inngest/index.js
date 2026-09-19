import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "petmy-app" });

// Create an empty array where we'll export future Inngest functions
export const functions = [];
const syncUserCreation = inngest.createFunction(
    {id: "sync-user-from-clerk"},
    {event: "clerk/user.created"},
    async ({event, step}) => {
        const {id, first_name, last_name, email_adresses, image_url} = event.data;
        let username = email_adresses[0].email_address.split("@")[0];  

        // check if user already exists in the database
       const user = await User.findOne({username})

       if (user) {
        username = username + Math.floor(Math.random() * 10000);
       }

       const userData = {
        _id: id,
        username: username,
        email: email_adresses[0].email_address,
        full_name: first_name + " " + last_name,
        profile_picture: image_url
       };

         await User.create(userData);
      

       
    }
);

// ingest function to sync user creation from clerk to our database

const syncUserUpdation = inngest.createFunction(
    {id: "sync-user-from-clerk"},
    {event: "clerk/user.updated"},
    async ({event, step}) => {
        const {id, first_name, last_name, email_adresses, image_url} = event.data;
       
        const updatedUserData = {
            email: email_adresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url
        };
        await User.findByIdAndUpdate(id, updatedUserData);
       
    }
);

// ingest function to sync user deletions from clerk to our database

const syncUserDeletion = inngest.createFunction(
    {id: "sync-user-from-clerk"},
    {event: "clerk/user.deleted"},
    async ({event, step}) => {
        const {id} = event.data;
        await User.findByIdAndDelete(id);
    }
);


// Create an empty array where we'll export future Inngest functions
export const functions = [
syncUserCreation,
syncUserUpdation,
syncUserDeletion
];