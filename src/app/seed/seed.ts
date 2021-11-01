import { User } from "../entity/user"
import { Post } from "../entity/post"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const dataSeed = async (connection) => {
    const userRepository = connection.getRepository(User);
    const postRepository = connection.getRepository(Post);
    const encryptedPassword = await bcrypt.hashSync("1234", +process.env.SALT_ROUNDS);
    const user = new User();
    user.email = "user@example.com"
    user.password = encryptedPassword;
    await userRepository.save(user);

    const user2 = new User();
    user2.email = "user2@example.com"
    user2.password = encryptedPassword;
    await userRepository.save(user2);

    const user3 = new User();
    user3.email = "user3@example.com"
    user3.password = encryptedPassword;
    await userRepository.save(user3);

    for (let i = 0; i < 5; i++) {
        const post = new Post();
        post.title = "제목 " + i;
        post.text = "내용 " + i;
        post.user = user;
        await postRepository.save(post);
    }
    for (let i = 5; i < 10; i++) {
        const post = new Post();
        post.title = "제목 " + i;
        post.text = "내용 " + i;
        post.user = user2;
        await postRepository.save(post);
    }
    for (let i = 10; i < 15; i++) {
        const post = new Post();
        post.title = "제목 " + i;
        post.text = "내용 " + i;
        post.user = user3;
        await postRepository.save(post);
    }
}