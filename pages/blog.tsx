import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface Post {
  title: string;
  date: string;
  category: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog">
      <h1 className="my-5 text-center text-lg font-semibold">Latest Posts:</h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5">
            <span className="text-lg text-red-500">{post.title}</span>
            <div>
              <span>
                {post.date} / {post.category}
              </span>
            </div>
          </div>
        ))}
      </ul>
    </Layout>
  );
};
export default Blog;

export const getStaticProps = async () => {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const { data } = matter(content);
    return data;
  });
  return {
    props: { posts: blogPosts },
  };
};
