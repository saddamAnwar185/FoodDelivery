const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl).then(()=>{
    console.log('connected')
}).catch((error)=> {
    console.log(error)
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    },
    profilePic: {
        type: String,
        required: true
    },
    profilePic: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    isVerifed: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    }
})

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    }
})

const headerImages = new mongoose.Schema({
    image: {
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true
        }
    }
})

const orderSchema = new mongoose.Schema({
    item: {
        type: Object,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
   },
   status: {
    type: String,
    default: 'packing',
    required: true
   },
   adress: {
    type: String,
    required: true
   },
   paymentMethod: {
    type: String,
    required: true
   },
   phone: {
    type: Number,
    required: true
   },
   isCancled: {
    type: Boolean,
    required: true,
    default: false
   }
   
})

const storeSchema = new mongoose.Schema({
    isOpen: {
        type: Boolean,
        default: true
    }
})

const Users = mongoose.model("Users", userSchema)
const Foods = mongoose.model("Foods", foodSchema)
const headersImages = mongoose.model("HeaderImages", headerImages)
const Orders = mongoose.model('Orders', orderSchema)
const Store = mongoose.model("Store", storeSchema)

module.exports = {Users, Foods, headersImages, Orders, Store}