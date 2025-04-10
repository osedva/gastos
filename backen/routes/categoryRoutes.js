const express = require("express");
const auth = require("../middleware/auth");
const Category = require("../models/Category");
const router = express.Router();

router.post("/new", auth, async (req, res) => {
    try {
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({error: "El nombre es obligatorio"});
        }

    // Verificar si ya existe una categoría con el mismo nombre para el mismo usuario
    const categoryExists = await Category.findOne({
        name: name.trim(),
        user: req.user.id,
    });
    
    if (categoryExists) {
      return res
      .status(400)
      .json({ error: "Ya existe una categoria con este nombre" });
    }

    const category = new Category({
        name,
        user: req.user.id
    });

        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

// Actualizar Categoria
router.put("/:id", auth, async (req, res) => {
    const { name } = req.body;
  
    try {
      const category = await Category.findByIdAndUpdate(
        {_id: req.params.id, user: req.user.id }, 
        { name }, 
        {new: true, runValidators: true}
    );
  
      if(!category) {
        return res.status(404).json({error: "Categoría no encontrada"})
      }
  
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la categoría" });
    }
  })
// Listar Categorias
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorias" });
  }
});
// Exportar el router
module.exports = router;