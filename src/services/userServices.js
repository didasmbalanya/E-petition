import database from '../models';
import AuthenticationHelper from '../utils/AuthenticationHelper';

const { jwtSign, comparePassword } = AuthenticationHelper;
class UserService {
  static async addUser(newUser) {
    const addedUser = await database.users.create(newUser);
    return addedUser;
  }

  static async findUserByEmail(userEmail) {
    const user = await database.users.findOne({ where: { email: userEmail } });
    if (!user) return false;
    return user;
  }

  static async signIn(email, pass) {
    // compare password
    const currentUser = await UserService.findUserByEmail(email);

    const checkPass = comparePassword(pass, currentUser.dataValues.password);

    if (checkPass) {
      const { password, ...userWP } = currentUser.dataValues;
      const token = jwtSign(userWP);
      return { token, ...userWP };
    }
    return null;
  }
}

export default UserService;