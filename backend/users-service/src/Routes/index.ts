import { Hono } from 'hono';

const router = new Hono();

// ✅ Get All Users
router.get('/', (c) => {
  return c.json({ message: 'Obtuviste todos y cada uno de los usuarios' });
});

// ✅ Get User By ID
router.get('/id/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ message: `Obtuviste el usuario con ID ${id}` });
});

// ✅ Update a User
router.patch('/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ message: `Actualizaste el usuario con ID ${id}` });
});

// ✅ Delete a User
router.delete('/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ message: `Eliminaste el usuario con ID ${id}` });
});

// ✅ Register a User
router.post('/', async (c) => {
  return c.json({ message: 'Registraste un usuario' });
});

// ✅ Login a User
router.post('/login', async (c) => {
  return c.json({ message: 'Iniciaste sesión' });
});

export default router;
