import { Hono } from 'hono';
import { GetAllController } from '../Controllers/GetAll';
import { RegisterUserController } from '../Controllers/RegisterUser';
import { GetUserByIdController } from '../Controllers/GetUserById';
import { UpdateUserController } from '../Controllers/UpdateUser';
import { DeleteUserController } from '../Controllers/Delete';
import { LoginUserController } from '../Controllers/Login';

const router = new Hono();

// ✅ Get All Users
router.get('/', GetAllController);

// ✅ Get User By ID
router.get('/id/:id', GetUserByIdController);

// ✅ Update a User
router.patch('/:id',  UpdateUserController);

// ✅ Delete a User
router.delete('/:id', DeleteUserController);

// ✅ Register a User
router.post('/', RegisterUserController);

// ✅ Login a User
router.post('/login', LoginUserController);

export default router;
