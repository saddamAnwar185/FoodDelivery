const { setUser } = require('../middleWares/auth');
const {Users, headersImages, Foods, Orders, Store} = require('../Models/Models')
const bcrypt = require('bcrypt');
const { handleSendEmail, handleWelcomeEmail, handleOrderPlacedEmail, handleCancelOrderEmail } = require('./SendEmail');
const saltRounds = 10
const Cloudnery = require('./Cloudnery')

// Hashing password function
const hashPassword = async (password) => {
  try {
    // Generate salt asynchronously
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword; // Return the hashed password
  } catch (error) {
    console.error('Error hashing password:', error); // Catch any error during the process
    throw error;
  }
};

const handleSingUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const file = req.files?.image
        const base64Image = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
        const verificationCode = Math.floor(Math.random() * 100001);
        const hashedPassword = await hashPassword(password);
        const existingUser = await Users.findOne({email})
        
        if(existingUser){
            if(existingUser.isVerifed === true) {
                res.json({
                    'sucess': false,
                    'messege': 'Email Already Exist'
                })
            } else if(existingUser.isVerifed === false) {
                const result = Cloudnery.uploader.upload(base64Image,{
                    folder: 'FoodDelivery Users'
                })
                existingUser.verificationCode = verificationCode
                existingUser.password = hashedPassword
                existingUser.profilePic.secure_url = (await result).secure_url
                existingUser.profilePic.public_id = (await result).public_id
                
                await existingUser.save()
                handleSendEmail(existingUser.email, verificationCode)
                res.json({
                    'sucess': true,
                    'messege': 'OTP resent. Please Verify You Email'
                })
            }
        } else if(!existingUser){
            const result = Cloudnery.uploader.upload(base64Image, {
                folder: 'FoodDelivery Users'
            })
            const newUser = new Users({
                name, email, password: hashedPassword, verificationCode: verificationCode, profilePic: {
                    secure_url: (await result).secure_url,
                    public_id: (await result).public_id
                }
            })
            await newUser.save()
            if(newUser){
                handleSendEmail(newUser.email, newUser.verificationCode)
                res.status(200).json({
                    'sucess': true,
                    'messege': `Verification code send to ${newUser.email}`
                })
            } 
        }
        
    } catch (error) {
        console.error("Error in handleSingUp:", error);
        res.status(500).json({
            sucess: false,
            messege: "Server error. Please try again.",
        });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const loginUser = await Users.findOne({ email });
        
        if (!loginUser) {
            return res.status(400).json({
                sucess: false,
                message: "❌ Wrong email or password" });
        }

        // Check if the user is verified
        if (!loginUser.isVerifed) {
            return res.status(400).json({
                sucess: false,
                message: "❌ Verify your email from signup and login again" });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, loginUser.password);

        if (!isMatch) {
            return res.status(400).json({
                sucess: false,
                message: "❌ Wrong email or password" });
        }

        const uid = setUser(loginUser);
        res.cookie('uid', uid);

        res.json({
            'sucess': true,
            'message': "✅ Login successful!",
            'user': loginUser
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
};

const handleVerifyCode = async(req, res) => {
    const {verificationCode} = req.body
    try {
        const verifyUser = await Users.findOne({ verificationCode:verificationCode })
        if (!verifyUser) {
            res.json({
                'sucess': false,
                'message': 'Wrong Code'
            })
        }
        else if(verifyUser){
            verifyUser.isVerifed = true
            verifyUser.verificationCode = undefined
            await verifyUser.save()
            handleWelcomeEmail(verifyUser.email, verifyUser.name)
            res.json({
                'sucess': true,
                'message': 'SingUp Sucessfull'
            })
        }

    } catch (error) {
        res.json({
            'sucess': false,
            'message': error.messege || 'Internal Server Error'
        })
    }
}

const handleUserDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteUser = await Users.findById(id);

        // Check if user exists
        if (!deleteUser) {
            return res.status(404).json({
                sucess: false,
                messege: "User not found",
            });
        }
        // Prevent Admin Deletion
        if (deleteUser.role === "Admin") {
            return res.json({
                sucess: false,
                messege: `User ${deleteUser.name} is an Admin and cannot be deleted.`,
            });
        }

        // Proceed to delete if not Admin
        const deletedUser = await Users.findByIdAndDelete(id);
        const deleteImage = await Cloudnery.uploader.destroy(deletedUser.profilePic.public_id)

        if (deletedUser || deleteImage) {
            return res.json({
                sucess: true,
                messege: `User ${deletedUser.name} has been deleted sucessfully`,
            });
        } else {
            return res.json({
                sucess: false,
                messege: "User could not be deleted",
            });
        }
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            messege: error.message || "Internal Server Error",
        });
    }
};

const handleForgetPassword = async (req, res) => {
    const {email, otp} = req.body
    const verificationCode = Math.floor(Math.random() * 100001);
    const user = await Users.findOne({email})
    if(email){
        if(!user) {
            res.json({
                'sucess': false,
                'messege': 'User not Found'
            })
        } else if(user){
            user.isVerifed = false,
            user.verificationCode = verificationCode
            await user.save()
            const result = handleSendEmail(user.email, verificationCode)
            if(result){
                res.json({
                    'sucess': true,
                    'messege': 'OTP Sent.'
                })
            } else if (!result) {
                res.json({
                    'sucess': false,
                    'messege': 'Cannot sent OTP'
                })
            }
        }
    } else if(otp){
        const verifyUser = await Users.findOne({verificationCode: otp})
        if(!verifyUser){
            res.json({
                'sucess': false,
                'messege': 'Wrong Code'
            })
        } else if (verifyUser){
            if(verifyUser.verificationCode === otp){
                verifyUser.isVerifed = true
                verifyUser.verificationCode = undefined
                await verifyUser.save()
                res.json({
                    'sucess': true,
                    'messege': 'Enter Your New Password',
                    'userId': verifyUser._id
                })
            }
        }
    }
}

const handleSetNewPasswod = async (req, res) => {
    const id = req.params.id
    const {password} = req.body
    const hashedPassword = await hashPassword(password);
    const user = await Users.findById(id)
    try {
        if(!user) {
            res.json({
                'sucess': false,
                'messege': 'Something went wrong'
            })
        } else if (user) {
            user.password = hashedPassword
            await user.save()
            res.json({
                'sucess': true,
                'messege': 'Password Changed Sucessfully'
            })
        }
    } catch (error) {
        res.json({
            'sucess': false,
            'mesege': 'Internal Server Error'
        })
    }
}

const handleUploadHeaderVideo = async (req, res) => {
    const file = req.files?.video; // Expecting 'video' file

    if (!file) {
        return res.json({
            success: false,
            message: "No video provided",
        });
    }

    try {
        // Check if there is already a video
        const existingVideo = await headersImages.findOne();
        if (existingVideo) {
            return res.json({
                success: false,
                message: "A video is already uploaded. Delete the existing one before uploading a new one.",
            });
        }

        // Upload using Cloudinary's upload_stream (Better for large files)
        const uploadStream = Cloudnery.uploader.upload_stream(
            {
                folder: "/foodDeliveryVideos",
                resource_type: "video",
                timeout: 120000 // Increase timeout
            },
            async (error, result) => {
                if (error) {
                    return res.json({
                        success: false,
                        message: "Video upload failed",
                        error: error.message
                    });
                }

                const uploadVideo = new headersImages({
                    image: {
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    },
                });

                await uploadVideo.save();

                return res.json({
                    success: true,
                    message: "Video Uploaded Successfully",
                });
            }
        );

        uploadStream.end(file.data); // Send the file data to Cloudinary
    } catch (error) {
        return res.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

const handleAddFood = async (req, res) => {
    const {title, description, price, category} = req.body
    const file = req.files?.file
    const base64Image = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
    try {
        const result = await Cloudnery.uploader.upload(base64Image, {
            folder: 'Food Images'
        })
        const newFood = new Foods({
            title,
            description,
            price,
            category,
            image: {
                secure_url: result.secure_url,
                public_id: result.public_id
            }

        })
        await newFood.save()

        if(newFood&&result){
            res.json({
                'sucess': true,
                'messege': 'Food Added Sucessfully'
            })
        } else {
            res.json({
                'sucess': false,
                'messege': 'Food not Added'
            })
        }
    } catch (error) {
        if(error){
            res.json({
                'sucess': false,
                'messege': error.messege || 'Something Went Wrong'
            })
        }
    }

    
}

const handleDeleteFood = async (req, res) => {
    const id = req.params.id
    
    const deletedItem = await Foods.findByIdAndDelete(id)
    const result = await Cloudnery.uploader.destroy(deletedItem.image.public_id)

    try {
        if(deletedItem && result) {
            res.json({
                'sucess': true,
                'messege': 'Item Deleted SucessFully'
            })
        } else {
            res.json({
                'sucess': false,
                'messege': 'Item Not Deleted'
            })
        }
    } catch (error) {
        res.json({
            'sucess': false,
            'messege': error.message || 'Internal Server Error'
        })
    }
}

const handleOrderPlace = async (req, res) => {
    try {

        const id = req.params.id
    const {item, adress, phone, paymentMethod} = req.body
    const newOrder = new Orders({
        item,
        createdBy: id,
        adress,
        phone,
        paymentMethod
    })

    await newOrder.save()
    await handleOrderPlacedEmail(item)
    
        if(newOrder) {
            res.json({
                'sucess': true,
                'messege': 'Order placed SucessFully',
                newOrder
            })
        } else {
            res.json({
                'sucess': false,
                'messege': 'Order not placed'
            })
        }
    } catch (error) {
        
        res.json({
            'sucess': false,
            'messege': error.message || 'Internal Server Error'
        })
    }
}

const handleShowOrders = async(req, res) => {
    const orders = await Orders.find({}).populate('createdBy')
    try {
        if(orders){
            res.json({
                orders
            })
        }
    } catch (error) {
        res.json({
            'messege': error.message || 'internal Server Error'
        })
    }
}

const handleChangeOrderStatus = async(req, res) => {
    const id = req.params.id
    const {status} = req.body
    try {
        const changeOrderStatus = await Orders.findByIdAndUpdate(id, {
            status
        })
    
        if(changeOrderStatus) {
            res.json({
                'sucess': true,
                'messege': 'Status Change Sucessfully'
            })
        } else {
            res.json({
                'sucess': false,
                'message': 'Status Not changed' 
            })
        }
    } catch (error) {
        res.json({
            'sucess': false,
            'message': error.message || 'Internal Server Error'
        })
    }
}

const handleViewOrders = async(req, res) => {
    const id = req.params.id
    const orders = await Orders.find({createdBy: id}).populate('createdBy')
    try {
        if(orders){
            res.json({
                orders
            })
        }
    } catch (error) {
        res.json({
            'message': error.message || 'Internal Server Error'
        })
    }
}

const handleDeleteOrder = async(req, res) => {
    const id = req.params.id
    try {
        const deleteOrder = await Orders.findByIdAndDelete(id)
    if(deleteOrder){
        res.json({
            'sucess': true,
            'messege': 'Order Deleted Sucessfully'
        })
    } else {
        res.json({
            'sucess': false,
            'messege': 'Order not deleted'
        })
    }
    } catch (error) {
        res.json({
            'sucess': false,
            'messege': error.message || 'Internal Server Error'
        })
    }
}

const handleCancleOrder = async(req, res) => {
    const id = req.params.id
    const {userId} = req.body

    try {
        const cancleOrder = await Orders.findByIdAndUpdate(id, {
            isCancled: true
        })
        const user = await Users.findById(userId)
        await handleCancelOrderEmail(user.name)
        if(cancleOrder){
            res.json({
                'sucess': true,
                'messege': 'Order Cancel Sucessfully'
            })
        } else {
            res.json({
                'sucess': false,
                'messege': 'Order Not Cancelled'
            })
        }
    } catch (error) {
        res.json({
            'sucess': false,
            'messege': error.message || 'Internal server error'
        })
    }

}

const handleToggleStore = async(req, res) => {
    const { isOpen } = req.body;
    const id = '67dc7d65d83415d790d373f4'

    try {

        if (isOpen === 'true') {
            
            await Store.findByIdAndUpdate(id, {
                isOpen: true
            })

            res.json({
                'sucess': true,
                'message': 'Store open',
            });
        } else if (isOpen === 'false') {

            await Store.findByIdAndUpdate(id, {
                isOpen: false
            })

            res.json({
                'sucess': true,
                'message': 'Store Close',
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            'sucess': false,
            'messege': error.message || 'Internal Server Error'
        });
    }
};

const showStoreToggle = async = async(req, res) => {
    const id = '67dc7d65d83415d790d373f4'
    const store = await Store.findById(id)

    try {
        res.json({
            store
        })
    } catch (error) {
        res.json({
            error
        })
    }
}




module.exports = {handleSingUp, handleLogin, handleVerifyCode, handleUserDelete, handleForgetPassword, handleSetNewPasswod, handleUploadHeaderVideo, handleAddFood, handleDeleteFood, handleOrderPlace, handleShowOrders, handleChangeOrderStatus, handleViewOrders, handleDeleteOrder, handleCancleOrder, handleToggleStore, showStoreToggle}  