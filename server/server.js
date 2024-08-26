// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { ObjectId } = require('mongoose').Types;

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://sks:123@cluster0.ngtnn.mongodb.net/?retryWrites=true', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Todo schema and model
// const todoSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   date: { type: Date, default: Date.now } // Default to current date if not provided
// });

// const Todo = mongoose.model('Todo', todoSchema);

// // Routes
// app.post('/api/todos', async (req, res) => {
//   const { title, description } = req.body;

//   if (!title || !description) {
//     return res.status(400).json({ error: 'Title and description are required' });
//   }

//   try {
//     const newTodo = new Todo({
//       title,
//       description,
//       date: new Date() // Set the current date
//     });
//     await newTodo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     console.error('Failed to create todo:', err); // Log detailed error
//     res.status(500).json({ error: 'Failed to create todo', details: err.message });
//   }
// });

// app.get('/api/todos', async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     const todos = await Todo.find()
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     res.json(todos);
//   } catch (err) {
//     console.error('Failed to fetch todos:', err); // Log detailed error
//     res.status(500).json({ error: 'Failed to fetch todos', details: err.message });
//   }
// });

// app.put('/api/todos/:id', async (req, res) => {
//     console.log(req.body)
//   const { title, description } = req.body;
//   const { id } = req.params;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid Todo ID' });
//   }

//   try {
//     const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description }, { new: true });
//     if (!updatedTodo) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }
//     res.json(updatedTodo);
//   } catch (err) {
//     console.error('Failed to update todo:', err); // Log detailed error
//     res.status(500).json({ error: 'Failed to update todo', details: err.message });
//   }
// });

// app.delete('/api/todos/:id', async (req, res) => {
//   const { id } = req.params;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid Todo ID' });
//   }

//   try {
//     const result = await Todo.findByIdAndDelete(id);
//     if (!result) {
//       return res.status(404).json({ error: 'Todo not found' });
//     }
//     res.json({ message: 'Todo deleted' });
//   } catch (err) {
//     console.error('Failed to delete todo:', err); // Log detailed error
//     res.status(500).json({ error: 'Failed to delete todo', details: err.message });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// For environment variables

const app = express();

// Configure CORS for allowing frontend to interact with backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect("mongodb+srv://sks:123@cluster0.ngtnn.mongodb.net/?retryWrites=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define your Todo model
const Todo = mongoose.model('Todo', new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false } // Add a completed field
}));

// Routes for your API
const router = express.Router();

// Get all todos (with pagination)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const todos = await Todo.find().skip(skip).limit(limit);
    const count = await Todo.countDocuments();
    res.json({ todos: todos || [], total: count }); // Ensure todos is an array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new Todo({
      title,
      description,
      date: new Date() // Use the current date
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // Return updated document
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/todos', router);

// Start your backend server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
