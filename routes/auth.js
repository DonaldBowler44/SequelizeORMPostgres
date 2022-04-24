const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');

router.post('/users', async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await User.create({ name, email, password, role });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    
        return res.json(user)
      } catch (err) {
        console.log(err)
        return res.status(500).json(err)
      };
});

router.get('/users', async (req, res) => {
    try {
      const users = await User.findAll()
  
      return res.json(users)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  });

  router.get('/users/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
      const user = await User.findOne({
        where: { uuid },
        // include: 'posts',
      })
  
      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })

  router.post('/posts', async (req, res) => {
    const { userUuid, body } = req.body
  
    try {
      const user = await User.findOne({ where: { uuid: userUuid } })
  
      const post = await Post.create({ body, userId: user.id })
  
      return res.json(post)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  })

  router.get('/posts', async (req, res) => {
    try {
      const posts = await Post.findAll({ include: 'user' })
  
      return res.json(posts)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  });

  router.delete('/users/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    try {
      const user = await User.findOne({ where: { uuid } })
  
      await user.destroy()
  
      return res.json({ message: 'User deleted!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  });
  
  router.put('/users/:uuid', async (req, res) => {
    const uuid = req.params.uuid
    const { name, email, role } = req.body
    try {
      const user = await User.findOne({ where: { uuid } })
  
      user.name = name
      user.email = email
      user.role = role
  
      await user.save()
  
      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })

  module.exports = router;