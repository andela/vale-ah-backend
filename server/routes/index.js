const router = require('express').Router();

router.use('/api', (req, res) => {
  res.send('Test');
});

module.exports = router;
