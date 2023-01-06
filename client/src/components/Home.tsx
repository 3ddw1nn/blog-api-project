import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../util/axios";
import { PostDocument } from "../../../src/models/post";

import Moment from "moment";
// import { useRefreshToken } from "../hooks/useRefreshToken";

Moment.locale("en");

const Home = () => {
  const [posts, setPosts] = useState<PostDocument[]>([]);
  useEffect(() => {
    api.get("/").then((res) => {
      setPosts(res.data.posts);
    });
  }, []);

  const { auth } = useAuth();

  const content = posts.map((post: any) => (
    <div key={post._id}>
      <ul className="text-white flex justify-center">
        <Link
          key={post._id}
          to={`/posts/${post._id}`}
          // postID={post._id}
          // onClick={() => handleViewPost(post._id)}
          className="m-6 text-white w-72 h-78 hover:text-white  rounded-lg box-border p-5 cursor-pointer transition-transform transition-duration hover:-translate-y-3 border-2 border-indigo-500 hover:border-white hover:transition-duration-1000"
        >
          <h3 className="text-2xl">{post.post_title}</h3>
          <p className="mt-4 max-h-44 overflow-hidden -o-ellipsis-lastline text-sm">
            {post.text}
          </p>
          <div className="mt-4 hover:text-white  text-indigo-500 text-right">
            Read more...
          </div>
          <div className="mt-4">
            {" "}
            {Moment(post.timestamp).format("MMMM DD yyyy")}
          </div>
        </Link>
      </ul>
    </div>
  ));

  return auth?.roles?.includes("5051") ? (
    <div>
      <div className="flex justify-center m-8">
        <Link
          className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500 text-sm"
          to="/create-post"
        >
          Create a Post
        </Link>
      </div>
      <div>
        <div className="mt-10 flex flex-wrap justify-center">{content}</div>
      </div>
    </div>
  ) : (
    <div>
      <div className="mt-10 flex flex-wrap justify-center">{content}</div>
    </div>
  );
};

export default Home;
