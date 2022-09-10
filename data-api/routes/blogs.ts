import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { BlogPreview, Blog, TailwindConfig } from "../utils/interfaces";
import { cacheData } from "../utils/utilFunctions";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import fp from "fastify-plugin";

const blogs: FastifyPluginAsync = async (server: FastifyInstance) => {
    server.get("/blogs", async (req, res): Promise<Array<BlogPreview>> => {
        const blogPreviewArray: Array<BlogPreview> = [];
        const blogArray: Array<BlogPreview> = await cacheData({
            key: 'blogs-array',
            dataSchema: {},
        });
        blogArray.forEach((blog) => {
            const { date, est_read_time, title, emoji, description, url } = blog;
            blogPreviewArray.push({
                date,
                est_read_time,
                title,
                emoji,
                description,
                url
            });
        });
        return blogPreviewArray;
    });

    server.get<{Params: {endpoint: string}}>("/blog/:endpoint", async (req, res): Promise<Blog | null> => {
        const id: string = req.params.endpoint;
        const blogData = (await cacheData({
            key: `${id}-blog`,
            dataSchema: {url: id},
        }))[0];
        if (!blogData) return null
        const { date, est_read_time, title, emoji, description, url, content } = blogData;
        const blog: Blog = {
            date,
            est_read_time,
            title,
            emoji,
            description,
            url,
            content
        };
        const rawCSS = "@tailwind base;\n@tailwind components;\n@tailwind utilities;";
        const tailwindConfig: TailwindConfig = {
            content: [{ raw: content, extension: "html" }]
        };
        const css: string = (await postcss([tailwindcss(tailwindConfig)]).process(rawCSS)).css;
        blog.content += `<style>${css}</style>`;
        return blog;
    });
};

export default fp(blogs);