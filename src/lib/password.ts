import bcrypt from "bcryptjs";

export const hashPassword = async (pass: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
};

export const comparePassword = async (pass: string, hash: string) => {
    return await bcrypt.compare(pass, hash);
};
