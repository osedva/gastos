const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/new", auth, async (req, res) => {
    try {
        const { title, amount, date, category } = req.body;
        if(!title || !amount || !category) {
            return res.status(400).json({error: "Todos los campos son obligatorios"});
        }

        const expense = new Expense({
            title,
            amount,
            date: date || Date.now(),
            category,
            user: req.user.id
        })

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

//Listar los gastos
router.get("/", auth, async (req, res) => {
    try {
      const expenses = await Expense.find({ user: req.user.id });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//Actualizar un gasto
router.put("/:id", auth, async (req, res) => {
  const { title, amount, date, category } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(
      {_id: req.params.id, user: req.user.id }, 
      {
        title,
        amount,
        date: date || Date.now(),
        category,
        user: req.user.id
       }, 
      {new: true, runValidators: true}
  );

    if(!expense) {
      return res.status(404).json({error: "Gasto no encontrado"})
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el gasto" });
  }
})



//Eliminar un gasto



router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete({_id: req.params.id});
    if (expense) {
      res.json(expense);
      //res.status(201).send("Gasto eliminado");
    } else {
      res.status(404).send("Gasto no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el gasto");
  }
});


module.exports = router;