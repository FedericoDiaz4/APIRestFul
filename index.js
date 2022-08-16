import express from 'express';

const PORT = 8080;
const app = express();
const router = express.Router();
const productos = [];

app.use(express.static('public'));
app.use('/api/productos', router);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', (req,res) => {
    res.json(productos)
});

router.get('/:id', (req,res) => {
    const data = productos.find(p=>p.id == req.params.id);
    return data !== undefined ? res.status(200).json(data) : res.status(400).json({error: "Producto no encontrado"})
});

router.post('/', (req, res) => {
    const {title, price, thumbnail} = req.body;
    const prod = {id: productos.length + 1, title:title, price:price, thumbnail: thumbnail}
    productos.push(prod);
    return res.status(200).json(prod);
});

router.put('/:id', (req,res) => {
    const data = productos.find(p=>p.id == req.params.id);
    if (data === undefined) {
        return res.status(400).json({error: "Producto no encontrado"})
    }
    const {title, price, thumbnail} = req.body;
    data.title = title;
    data.price = price;
    data.thumbnail = thumbnail;
    productos[productos.indexOf(p=>p.id == req.params.id)] = data;
    res.status(200).json({data});
})

router.delete('/:id', (req,res) => {
    const dataDeleted = productos.splice(productos.indexOf(p=>p.id == req.params.id), 1) || undefined;
    if (dataDeleted === undefined) {
        return res.status(400).json({error: "Producto no encontrado"})
    }
    res.status(200).json(productos);
})

const server = app.listen(PORT, () => {
    console.log(`Servidor levantado en puerto ${PORT}`)
})

server.on('error', error => {
    console.log(error);
})