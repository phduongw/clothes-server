import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    clientSecret: string;
    expiresIn: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 8828,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    clientSecret: process.env.CLIENT_SECRET ?? 'duongExtension@',
    expiresIn: process.env.EXPIRES_IN ?? '1h'
}

export default config;