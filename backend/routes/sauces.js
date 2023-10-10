const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtr = require('../controllers/sauceCtr');

router.get('/', auth, sauceCtr.getAllSauces);
router.post('/', auth, multer, sauceCtr.createSauce);
router.get('/:id', auth, sauceCtr.getOneSauce);
router.put('/:id', auth, multer, sauceCtr.modifySauce);
router.delete('/:id', auth, sauceCtr.deleteSauce);
router.post('/:id/like', auth, sauceCtr.likeSauce);



module.exports = router;