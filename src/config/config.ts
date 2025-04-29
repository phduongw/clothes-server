import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    clientSecret: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 8828,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    clientSecret: process.env.CLIENT_SECRET ?? '3gAn@130599_y3u3mv0t4n'
}

export default config;