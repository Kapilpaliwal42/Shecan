import express from 'express';
import { Login, Register, Change_Role, getAllUsers, AllUsers } from './AuthControllers.js';
import { protect, isAdmin, authorization } from './middlewares.js';

const Router = express.Router();

Router.post('/register', Register);
Router.post('/login', Login);
Router.get("/myProfile", protect, (req, res) => {
    res.status(200).json({ data: req.user });
});
Router.get("/admin", protect, isAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome Admin" });
});

Router.put("/changeRole", protect, authorization('admin', 'superadmin', 'manager'), Change_Role);
Router.get("/users", protect, authorization('admin', 'superadmin', 'manager'), getAllUsers);
Router.get("/getUsers", protect, AllUsers); 

export default Router;
