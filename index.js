import express from 'express';
import Contenedor from './contenedor.js';

const PORT = 8080;
const app = express();
const router = express.Router();
const archivo = new Contenedor('./productos.txt');

app.use(express.static('public'));
app.use('/api/productos', router);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req,res) => {
    try {
        const productos = await archivo.getAll();
        return res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"No se encuentran productos"});
    }
});

router.get('/:id', async (req,res) => {
    try {
        const data = await archivo.getById(req.params.id);
        return data !== null ? res.status(200).json(data) : res.status(400).json({error: "Producto no encontrado"})    
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"No se encuentran productos"});
    }
});

router.post('/', async (req, res) => {
    const {title, price, thumbnail} = req.body;
    try {
        const prod = await archivo.save({title:title, price:price, thumbnail: thumbnail})
        return res.status(200).json(prod);
    } catch (error) {
        return res.status(500).json({error:"No se pudo agregar el productos"});
    }
});

router.put('/:id', async (req,res) => {
    try {
        const data = req.body
        if (data === null) {
            return res.status(500).json({error: "Producto no encontrado"});
        }
        data.id = req.params.id;
        await archivo.edit(req.params.id, data);
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({error: "No se pudo editar el articulo"});
    }
})

router.delete('/:id', async (req,res) => {
    try {
        await archivo.deleteById(req.params.id);    
        res.status(200).json({success: "Producto eliminado"});
    } catch (error) {
        return res.status(500).json({error: "Producto no encontrado"})
    }
})

const server = app.listen(PORT, () => {
    console.log(`Servidor levantado en puerto ${PORT}`)
})

server.on('error', error => {
    console.log(error);
})