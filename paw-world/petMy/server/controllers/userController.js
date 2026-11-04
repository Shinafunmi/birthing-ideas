import ImageKit from '@imagekit/nodejs';
import Connection from '../models/Connection.js';
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

        if (tempUser.username !== username) {
            const existingUser = await User.findOne({username});
            if(existingUser) {
                username = tempUser.username; // Revert to the original username
                return res.json({success: false, message: "Username already exists"});
            }
        }

        const updates = {};
        if (username !== undefined) updates.username = username;
        if (full_name !== undefined) updates.full_name = full_name;
        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (email_addresses !== undefined) updates.email_addresses = email_addresses;
        if (image_url !== undefined) updates.image_url = image_url;

        const updatedData = { ...updates };

        const profile = req.files?.profile && req.files.profile[0];
        const cover = req.files?.cover && req.files.cover[0];

        if (profile) {
            const buffer = fs.readFileSync(profile.path);
            const response = await ImageKit.upload({
                file: buffer,
                fileName: profile.originalname,
            });

            const url = ImageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' }
                ]
            });
            updatedData.profile_picture = url;
        }

        if (cover) {
            const buffer = fs.readFileSync(cover.path);
            const response = await ImageKit.upload({
                file: buffer,
                fileName: cover.originalname,
            });

            const url = ImageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            });
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res.json({success: true, user, message: 'profile updated successfully'})

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.json({success: false, message: 'Failed to update user data'});
    }
};

// Find users using username, email, location, name

export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { input } = req.body

        const allUsers = await User.find({
            $or: [
                {
                    username: new RegExp(input, 'i')                   
                },
                {
                    email: new RegExp(input, 'i' )
                },
                {
                    full_name: new RegExp(input, 'i')
                },
                {
                    location: new RegExp(input, 'i')
                },
            ]
        })

        const filteredUsers = allUsers.filter(user=> user._id !== userId);
           

        res.json({success: true, users: filteredUsers}); // revisit
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.json({success: false, message: 'Failed to fetch user data'});
    }
};

// Follow users
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            return res.json({success: false, message: 'you are already following this user' })
        }

        user.following.push(id);
        await user.save()

        const toUser = await User.findByid(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({success: true, message: 'Now you are following this user'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
} 

//unfollow User

export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const user = await User.findById(userId)

       user.following = user.following.filter(user => user !== id);
       await user.save()

       const toUser = await User.findById(id)
       toUser.followers = user.followers.filter(user=> user !== id);
       await toUser.save()

        res.json({success: true, message: 'You are no longer following this user'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
} 

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // Check if user has sent more than 5 friend requests in the last 24 hours
        const twentyFourHoursAgo = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        );

        const sentRequestsCount = await Connection.countDocuments({
            from: userId,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        if (sentRequestsCount >= 5) {
            return res.json({
                success: false,
                message: 'You have reached the limit of 5 friend requests in the last 24 hours'
            });
        }

        // Check if user is sending a request to themselves
        if (userId === id) {
            return res.json({
                success: false,
                message: 'You cannot send a friend request to yourself'
            });
        }

        // Check if user is already friends with the target user
        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.friends.includes(id)) {
            return res.json({
                success: false,
                message: 'You are already friends with this user'
            });
        }

        // Check if a connection or friend request already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { from: userId, to: id },
                { from: id, to: userId }
            ]
        });

        if (existingConnection) {
            if (existingConnection.status === 'accepted') {
                return res.json({
                    success: false,
                    message: 'You are already connected with this user'
                });
            }

            return res.json({
                success: false,
                message: 'A friend request already exists'
            });
        }

        // Create a new friend request
        await Connection.create({
            from: userId,
            to: id
        });

        return res.json({
            success: true,
            message: 'Friend request sent successfully'
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};
