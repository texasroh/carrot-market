import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Post: NextPage<{ post: string }> = ({ post }) => {
  return (
    <div
      className="blog-post-content"
      dangerouslySetInnerHTML={{ __html: post }}
    ></div>
  );
};

export default Post;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  return {
    props: {
      post: value,
    },
  };
};

export const getStaticPaths = () => {
  const files = readdirSync("./posts").map((file) => ({
    params: {
      slug: file.split(".")[0],
    },
  }));

  return {
    paths: files,
    fallback: false,
  };
};
