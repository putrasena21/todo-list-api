const { User, Todo } = require("../models");

module.exports = {
  createTodo: async (req, res) => {
    try {
      const { title, description } = req.body;

      await Todo.create({
        userId: req.user.id,
        title,
        description,
      });

      const payload = {
        title,
        description,
      };

      return res.created("Todo created", payload);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  listTodo: async (req, res) => {
    try {
      const listTodo = await User.findAll({
        attributes: ["id", "email", "name"],
        where: {
          id: req.user.id,
        },
        include: [
          {
            model: Todo,
            as: "list",
            attributes: ["id", "title", "description"],
          },
        ],
      });

      return res.success("Success get all data", listTodo);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  detailTodo: async (req, res) => {
    try {
      const { todoId } = req.params;

      const todo = await Todo.findByPk(todoId);

      if (req.user.id !== todo.userId) {
        return res.unauthorized("You not authorized");
      }

      const payload = {
        title: todo.title,
        description: todo.description,
      };

      return res.success("Success get todo", payload);
    } catch (err) {
      return res.serverError(err.message);
    }
  },

  updateTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { title, description } = req.body;

      if (title) req.body.title = title;
      if (description) req.body.description = description;

      const todo = await Todo.findByPk(todoId);
      if(req.user.id !== todo.userId){
        return res.unauthorized('You not authorized')
      }

      await Todo.update(
        {
          title,
          description,
        },
        {
          where: {
            id: todoId,
          },
        }
      );

      const payload = {
        title,
        description,
      };

      return res.success("Todo updated", payload);
    } catch (err) {
      return res.serverError(err.message);
    }
  },
};
