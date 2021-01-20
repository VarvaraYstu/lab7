import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //создание уникального ID

const router = express.Router();

let users =[]; //массив, в котором храним все данные

//Метод создания элемента
router.post('/', (req, res) => {
    const user = req.body;

    const userWithId = {...user, id: uuidv4()};
    users.push(userWithId);

    res.send(userWithId.id);
});

//Метод изменения элемента
router.put('/:id',(req, res) => {

    const {id} = req.params;
    const {firstName, lastName} = req.body;
    console.log(firstName);
    const user = users.find((user) => user.id === id);
    user.firstName = firstName;
    user.lastName = lastName;


    res.send(`User with the id ${id} was updated`);

});

//Метод чтения всех элементов
router.get('/', (req,res)=>{
    res.send(users);
});

//Метод получения элемента по ID
router.get('/:id',(req,res)=>{
    const { id } = req.params;

    const  foundUser = users.find((user) => user.id === id);

    res.send(foundUser);
});

//Метод удаления элемента
router.delete('/:id',(req,res) => {
    const { id } = req.params;

    users = users.filter((user) => user.id !== id);

    res.send(`User with id ${id} deleted from the database.`)
});



export default router;