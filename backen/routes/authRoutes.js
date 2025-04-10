const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const validator = require("validator");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
      // Sacamos los datos de la petición
      const { name, email, password } = req.body;
      // Validando el correo
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }
  
      // Validando la contraseña que sea de minimo caracteres
      if (!validator.isLength(password, { min: 6 })) {
        return res
          .status(400)
          .json({ error: "La contraseña debe tener al menos 6 caracteres" });
      }
      // Validando si ya existe un usuario en la base de datos con el correo
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Ya existe un usuario con este correo" });
      }
  
  // Encriptar la constraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      
      await user.save();
      res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  //Ruta para login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Credenciales inválidas" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Ruta para verificar el token
router.get("/verify", auth, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});
  module.exports = router;