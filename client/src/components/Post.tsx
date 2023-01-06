import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import api from "../util/axios";
import Moment from "moment";
import Comment from "./Comment";

Moment.locale("en");

function Post() {
  const params = useParams();

  // const [loading, setLoading] = useState<boolean>(true);
  const [text, setText] = useState<string>();
  const [post_title, setPost_title] = useState<string>();
  const [timestamp, setTimestamp] = useState<string>();
  // const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState<string>();
  const [author_job_title, setAuthor_job_title] = useState<string>();
  const [author_image, setAuthor_image] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!params.id) {
        return;
      }
      // setLoading(true);
      const response = await api.get(`/posts/${params.id}`, {
        withCredentials: true,
      });
      setText(response.data.post.text);
      setPost_title(response.data.post.post_title);
      setTimestamp(response.data.post.timestamp);
      setAuthor(response.data.post.user.username);
      setAuthor_job_title(response.data.post.user.job_title);
      setAuthor_image(response.data.post.user.image);
      // setLoading(false);
    })();
  }, [params.id]);

  return (
    <div>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-slate-900"></main>
      <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
        <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
          <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
              <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                  src={`..${author_image}`}
                  className="mr-4 w-16 h-16 rounded-full"
                  alt="User Profile Pic"
                ></img>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {author}
                  </div>
                  <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    {author_job_title}
                  </p>
                </div>
              </div>
            </address>
            <h1 className="mb-2 text-3xl font-extrabold leading-tight text-white">
              {post_title}
            </h1>
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              Published: {Moment(timestamp).format("MMMM DD yyyy, h:mm A")}
            </p>
          </header>
          <p className="text-white"> {text}</p>
          <section className="not-format mt-10">
            <Comment />
          </section>
        </article>
      </div>
    </div>
  );
}

export default Post;
