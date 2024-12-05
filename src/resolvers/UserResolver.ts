// src/resolvers/UserResolver.ts
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { SignInResponse, SignOutResponse, SignUpResponse, User } from '../entities/User';
import { Organization } from '../entities/Organization';
import { generateToken } from '../utils/jwt';
import { signUpUser } from '../utils/cognito';
import { BlacklistedToken } from '../entities/TokenEntity';
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// import { sendResetEmail } from "../utils/emailUtils";

const userRepository = AppDataSource.getRepository(User);

// export const userResolvers = {
//   Query: {
//     me: async (_: any, __: any, context: any) => {
//       const userId = context.user?.id;
//       if (!userId) throw new Error("Not authenticated");
//       return userRepository.findOneBy({ id: userId });
//     },
//   },
//   Mutation: {
//     signup: async (_: any, { email, password }: any) => {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = userRepository.create({ email, password: hashedPassword });
//       await userRepository.save(user);
//       return "User created successfully";
//     },
//     signin: async (_: any, { email, password }: any, context: any) => {
//       const user:any = await userRepository.findOneBy({ email });
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         throw new Error("Invalid credentials");
//       }
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
//       context.res.cookie("token", token, { httpOnly: true });
//       return token;
//     },
//     signout: async (_: any, __: any, context: any) => {
//       context.res.clearCookie("token");
//       return true;
//     },
//     requestPasswordReset: async (_: any, { email }: any) => {
//       const user = await userRepository.findOneBy({ email });
//       if (!user) return false;

//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
//       // user.resetToken = token;
//       await userRepository.save(user);

//       // await sendResetEmail(email, token);
//       return true;
//     },
//     // resetPassword: async (_: any, { token, newPassword }: any) => {
//     //   const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     //   const user = await userRepository.findOneBy({ id: decoded.id, resetToken: token });
//     //   if (!user) throw new Error("Invalid token");

//     //   user.password = await bcrypt.hash(newPassword, 10);
//     //   user.resetToken = null;
//     //   await userRepository.save(user);

//     //   return true;
//     // },
//   },
// };


@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    try {
      return await AppDataSource.getRepository(User).find();
    } catch (error) {
      throw new Error("Error fetching users");
    }
  }

  @Mutation(() => SignUpResponse)
  async signUp(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("phone") phone: string,
    @Arg("role") role: string,
    @Arg("password") password: string,
    @Arg("status") status: string,
    @Arg("type") type: string,
    @Arg("organizationId") organizationId: number
  ): Promise<SignUpResponse> {
    // Check if organization exists
    // const organization = await AppDataSource.getRepository(Organization).findOne({
    //   where: { id: organizationId },
    // });
    // if (!organization) {
    //   throw new Error("Organization not found");
    // }

    // Check if email is already in use
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.role = role;
    user.status = status;
    user.type = type;
    user.password = hashedPassword;
    user.organizationId = organizationId;

    try {
      await AppDataSource.getRepository(User).save(user);
      return {
        message: 'User registered successfully',
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error: any) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  @Mutation(() => SignInResponse)
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<SignInResponse> {
    // Find the user by email
    const user :any = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found.");
    }

    console.log(user,"paaaaaaaaaaaaaaaaaaaa------------------")
    if (!user.password) {
      throw new Error("Password is not set for this user.");
    }
    // Check if the password is correct
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid credentials.");
    }

    // Generate a JWT token (or any other token you prefer)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return {
      token,
      user, 
    };
  }
  @Mutation(() => SignOutResponse)
  async signout(@Arg("token") token: string): Promise<SignOutResponse> {
    try {
      // Decode the token to ensure it's valid
      const decodedToken: any = jwt.decode(token);
      if (!decodedToken) {
        throw new Error("Invalid token.");
      }

      // Add the token to the blacklist
      const blacklistedTokenRepo = AppDataSource.getRepository(BlacklistedToken);
      await blacklistedTokenRepo.save({
        token,
        expiresAt: new Date(decodedToken.exp * 1000), // Convert expiration time to a Date
      });

      return {
        message: "Signout successful.",
        success: true,
      };
    } catch (error:any) {
      console.error("Signout error:", error.message);

      return {
        message: "Signout failed. Please try again.",
        success: false,
      };
    }
  }
}
//---------------------------------------------------------------------------------------------------
// export const UserResolver = {
//   Query: {
//     users: async () => {
//       const userRepository = AppDataSource.getRepository(User);
//       return await userRepository.find();
//     },
//   },
//   Mutation: {
//     createUser: async (
//       _: any,
//       { firstName, lastName, phone, email, role, organizationId, type, password, status }: any
//     ) => {
//       try {
//         console.log("Creating user with:", { firstName, lastName, phone, email, role, organizationId, type, status });
    
//         // Check for missing fields or invalid input
//         if (!firstName || !lastName || !phone || !email || !role || !organizationId || !type || !password || !status) {
//           throw new Error("Missing required fields.");
//         }
    
//         const userRepository = AppDataSource.getRepository(User);
    
//         // Ensure the email is unique
//         const existingUser = await userRepository.findOne({ where: { email } });
//         if (existingUser) {
//           throw new Error("email already in use.");
//         }
    
//         const hashedpassword = await bcrypt.hash(password, 10);
    
//         const user = userRepository.create({
//           firstName,
//           lastName,
//           phone,
//           email,
//           role,
//           organizationId:parseInt(organizationId),
//           type,
//           password: hashedpassword,
//           status,
//         });
    
//         await userRepository.save(user);
    
//         console.log("User created successfully:", user);
//         return user;
//       } catch (error:any) {
//         console.error("Error creating user:", error);
//         throw new Error(`Failed to create user: ${error.message}`);
//       }
//     },
//     signIn: async (_: any, { email, password }: { email: string; password: string }) => {
//       try {
//         console.log("Signing in user with email:", email);

//         const userRepository = AppDataSource.getRepository(User);

//         // Find the user by email
//         const user:any = await userRepository.findOne({ where: { email } });
//         if (!user) {
//           throw new Error("User not found.");
//         }

//         // Compare the provided password with the stored hashed password
//         const ispasswordValid = bcrypt.compare(password, user.password);
//         if (!ispasswordValid) {
//           throw new Error("Invalid password.");
//         }

//         // Generate a JWT token
//         const token = jwt.sign(
//           { id: user.id, email: user.email, role: user.role },
//           JWT_SECRET,
//           { expiresIn: "1h" }
//         );

//         console.log("User signed in successfully:", user);

//         // Return the token and user details
//         return {
//           token,
//           user,
//         };
//       } catch (error: any) {
//         console.error("Error during sign-in:", error);
//         throw new Error(`Failed to sign in: ${error.message}`);
//       }
//     },


//     signOut: async (_: any, { token }: { token: string }) => {
//       try {
//         // Invalidate the token by adding it to a blacklist
//         if (!token) {
//           throw new Error("No token provided.");
//         }

//         invalidatedTokens.add(token);

//         // Optionally, clear the token client-side by providing feedback to the user
//         return true; // Sign-out successful
//       } catch (error: any) {
//         throw new Error(`Failed to sign out: ${error.message}`);
//       }
//     },
    

  
//   },
// };