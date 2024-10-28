require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');


const port = 8080
const app = express();
app.use(express.json());
app.use(cors());

const MAX_USERS = 3; //Máximo de usuários

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));


const Author = mongoose.model('Author', {
    name: { type: String, required: true },
    bookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    version: { type: Number, default: 1 }
});
const Publisher = mongoose.model('Publisher', {
    name: { type: String, required: true },
    version: { type: Number, default: 1 }
});
const Book = mongoose.model('Book', {
    title: { type: String, required: true },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    shelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
    version: { type: Number, default: 1 }
});

const Shelf = mongoose.model('Shelf', {
    name: { type: String, required: true },
    email: { type: String },
    bookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    version: { type: Number, default: 1 }
});

const User = mongoose.model('User', {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});


app.get('/', (req, res) => {
    res.send('Servidor rodando e conectado ao MongoDB!');
});


//GET
app.get('/authors', async (req, res) => {
    try {
        const authors = await Author.find(); // Busca todos os autores
        res.status(200).send(authors); // Retorna os autores em formato JSON
    } catch (error) {
        res.status(500).send(error); // Retorna erro caso ocorra um problema
    }
});

app.get('/authors/search', async (req, res) => {
    const { name } = req.query; // Recebe o nome do autor como parâmetro de consulta
    try {
        if (!name) {
            return res.status(400).send({ message: 'Nome do autor é necessário' });
        }
        const authors = await Author.find({ name: { $regex: new RegExp(name, "i") } }); // Busca autores cujo nome contém o termo fornecido (case-insensitive)
        if (authors.length === 0) {
            return res.status(404).send({ message: 'Nenhum autor encontrado com esse nome' });
        }
        res.status(200).send(authors); // Retorna autores encontrados
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/authors/:id', async (req, res) => {
    const { id } = req.params; // Recebe o ID do autor como parâmetro na URL
    try {
        const author = await Author.findById(id); // Busca o autor pelo ID
        if (!author) {
            return res.status(404).send({ message: 'Autor não encontrado' });
        }
        res.status(200).send(author); // Retorna o autor encontrado
    } catch (error) {
        res.status(500).send(error); // Retorna erro caso ocorra um problema
    }
});


app.get('/publishers', async (req, res) => {
    try {
        const publishers = await Publisher.find(); // Busca todos as editoras
        res.status(200).send(publishers); // Retorna as editoras em formato JSON
    } catch (error) {
        res.status(500).send(error); // Retorna erro caso ocorra um problema
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find(); // Busca todos os livros
        res.status(200).send(books); // Retorna os livros em formato JSON
    } catch (error) {
        res.status(500).send(error); // Retorna erro caso ocorra um problema
    }
});


app.get('/shelves', async (req, res) => {
    try {
        const shelves = await Shelf.find(); // Busca todos as estantes
        res.status(200).send(shelves); // Retorna as estantes em formato JSON
    } catch (error) {
        res.status(500).send(error); // Retorna erro caso ocorra um problema
    }
});

// POSTS
// Função genérica para verificar duplicatas
const findDuplicates = async (model, itemsArray, fields) => {
    const query = {};
    fields.forEach(field => {
        query[field] = { $in: itemsArray.map(item => item[field]) };
    });
    return await model.find(query);
};

// Função genérica para modificar duplicatas, adicionando 'version'
const handleDuplicates = (itemsArray, existingItems, fields) => {
    return itemsArray.map(item => {
        const isDuplicate = existingItems.some(existing =>
            fields.every(field => existing[field] === item[field])
        );

        if (isDuplicate) {
            // Incrementa a versão do item duplicado
            item.version = (item.version || 1) + 1;
        }

        return item;
    });
};

// Função principal genérica para adicionar livros/autores
const addItems = async (model, req, res, fields) => {
    try {
        const items = req.body;
        const itemsArray = Array.isArray(items) ? items : [items];

        // Verificar duplicados
        const existingItems = await findDuplicates(model, itemsArray, fields);

        if (existingItems.length > 0) {
            console.log(`${model.modelName}s repetidos encontrados:`);
            existingItems.forEach(item => {
                console.log(`Repetido: ${fields.map(field => `${item[field]}`).join(', ')}`);
            });

            // Modificar duplicatas
            const uniqueItems = handleDuplicates(itemsArray, existingItems, fields);

            // Inserir itens, incluindo os duplicados com identificador de versão
            const result = await model.insertMany(uniqueItems);
            return res.status(201).send({
                message: `${model.modelName}s inseridos, incluindo duplicados com identificador único (versão).`,
                result
            });
        } else {
            // Inserir itens diretamente se não houver duplicados
            const result = await model.insertMany(itemsArray);
            return res.status(201).send(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
};

// Rotas para adicionar livros e autores
app.post('/books', (req, res) => addItems(Book, req, res, ['title', 'publisher', 'authorId']));
app.post('/authors', (req, res) => addItems(Author, req, res, ['name']));
app.post('/shelves', (req, res) => addItems(Shelf, req, res, ['name', 'description']));
app.post('/publishers', (req, res) => addItems(Publisher, req, res, ['name']));

//LOGIN E SIGN UP

// Função para validação básica de email e senha
const validateFields = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    next();
};
// LOGIN
app.post("/login", validateFields, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Comparar a senha digitada com a senha armazenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json("exist");
        } else {
            res.status(400).json({ message: 'Credenciais incorretas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});

// SIGNUP
app.post("/signup", validateFields, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userCount = await User.countDocuments();

        // Verificar se o número de usuários excede o limite máximo
        if (userCount >= MAX_USERS) {
            return res.status(403).json({ message: "O número máximo de usuários foi atingido. Não é possível criar mais contas." });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar o usuário', error });
    }
});

app.listen(port, () => {
    console.log('Servidor rodando na porta ', port);
});


