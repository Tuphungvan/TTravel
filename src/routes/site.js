const express = require('express')
const router = express.Router()
const siteController = require('../app/controllers/SiteController')
const { route } = require('express/lib/application')
const res = require('express/lib/response')
// newsController.index
router.get('/search', siteController.Search)
router.get('/', siteController.index)
router.get('/tours/:slug', siteController.detail);

module.exports = router