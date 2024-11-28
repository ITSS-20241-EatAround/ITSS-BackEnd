import { DataTypes } from "sequelize";
import sequelize from "../../config/db/dbConnect.js";
import bcrypt from 'bcrypt';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }, 
        name : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_image:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://i0.wp.com/static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg?ssl=1"
        }
    },
    {
        timestamps: true,
    }
);
    
//hook để hash password
User.beforeCreate(async(user, option)=>{
    if(!user.password){
        throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});
User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});


export default User;