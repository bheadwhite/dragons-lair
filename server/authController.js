const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get('db');
    const [user] = await db.get_user([username]);
    if (user) {
      res.status(409).send('Username is taken');
    }
    const hash = bcrypt.hashSync(password);
    const [registeredUser] = await db.register_user([isAdmin, username, hash]);

    delete registeredUser.hash;
    req.session.user = { ...registeredUser };

    res.status(200).send(req.session.user);
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db');
    const [user] = await db.get_user([username]);
    if (!user) {
      res.status(401).send('User not found');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      res.status(403).send('incorrect password');
      return;
    }

    delete user.hash;

    req.session.user = { ...user };
    res.status(200).send(req.session.user);
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  },
};
