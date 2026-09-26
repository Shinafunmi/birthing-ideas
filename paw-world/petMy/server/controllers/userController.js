import ImageKit from '@imagekit/nodejs';
import User from '../models/User.js';
import fs from 'fs'

// get users data using userId

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        res.json({success: true, user});
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.json({success: false, message: 'Failed to fetch user data'});
    }
};

// update user data using userId
export const updateUser = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {username, full_name, bio, location, email_addresses, image_url} = req.body;

        const tempUser = await User.findById(userId);
        if(!tempUser) {
            return res.json({success: false, message: "User not found"});
        }

        const updates = {};
        if (username !== undefined) updates.username = username;
        if (full_name !== undefined) updates.full_name = full_name;
        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (email_addresses !== undefined) updates.email_addresses = email_addresses;
        if (image_url !== undefined) updates.image_url = image_url;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if(!user) {
            return res.json({success: false, message: "User not found"});
        }

       const profile = req.files.profile && req.files.profile[0]
       const cover = req.files.cover && req.files.cover[0]

       if(profile) {
        // user.profile_picture = profile.path;
        const buffer = fs.readFileSync(profile.path)
        const response = await ImageKit.upload({
            file: buffer,
            fileName: profile.originalname,

        })
        const url = ImageKit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'},
                { format: 'webp' },
                { width: '512'}
            ]
        })
       }
       if(cover) {
        user.cover_photo = cover.path;
       }

        res.json({success: true, user});
    } catch (error) {
        console.error('Error updating user data:', error);
        res.json({success: false, message: 'Failed to update user data'});
    }
};