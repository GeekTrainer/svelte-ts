import express, {Express} from 'express';
import cors from 'cors';
import { Send } from 'express-serve-static-core';

interface TypedRequest<T> extends Express.Request {
    body: T
}

interface TypedResponse<T> extends Express.Response {
    json: Send<T, this>;
}

interface TodoItem {
    id: number;
    name: string;
    completed: boolean;
}

const todoItems: Array<TodoItem> = [
    {
        id: 0,
        name: 'Run demo',
        completed: false
    }
]

const app = express();
app.use(cors());
app.use(express.json());

app.get('', (req, res) => res.json(todoItems));

app.post('', (req: TypedRequest<TodoItem>, res: TypedResponse<TodoItem>) => {
    const newItem = {
        ...req.body,
        id: todoItems.length
    }
    todoItems.push(newItem);
    res.json(newItem);
});

app.put('', (req: TypedRequest<TodoItem>, res: TypedResponse<TodoItem>) => {
    todoItems[req.body.id] = req.body;
    res.json(req.body);
});

const port = process.env.PORT || 3100;
app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});