//api.js
const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
    const { offset = 0, limit = 25, tag } = req.query;

    try {
        res.json(
            await Products.list({
                offset: Number(offset),
                limit: Number(limit),
                tag,
            })
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProduct(req, res, next) {
    const { id } = req.params;

    try {
        const product = await Products.get(id);
        if (!product) {
            return next();
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createProduct(req, res) {
    console.log('Request body:', req.body);
    res.json(req.body); // Placeholder response
}

async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        await Products.delete(id);
        res.status(202).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedProduct = await Products.update(id, updatedData);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
});
