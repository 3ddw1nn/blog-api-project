import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import api from "../util/axios";
import Moment from "moment";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

Moment.locale("en");

function Comment() {
  const { auth } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  // const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState([]);
  const [comment_text, setComment_text] = useState<string>();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!params.id) {
        return;
      }
      // setLoading(true);
      const response = await api.get(`/posts/${params.id}`);
      // setLoading(false);
      setComments(response.data.comments);
      // setComments_text(response.data.comments.text);
      console.log(response.data.comments);
    })();
  }, [params.id, comments.length]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");

    const body = {
      comment_text,
    };
    // api.get("/");

    console.log(body);

    api
      .post(`/posts/${params.id}`, body, { withCredentials: true })
      .then((res) => {
        console.log(res);
        // const roles = Object.values(res?.data?.user?.roles);
        setComments(res.data.comments);
        setComment_text("");
        navigate(`/posts/${params.id}`);
      })
      .catch((err) => {
        console.error(err);
        if (!err?.response) {
          setErrMsg("Err: No Server Response");
        } else if (!body.comment_text) {
          setErrMsg("Err: Missing Comment");
        } else if (err.response?.status === 401) {
          setErrMsg("Err: Unknown Error");
        } else {
          setErrMsg("Err: Submission Error");
        }
      });
  };

  const commentForm = (
    <div>
      <section className="text-red-500 flex justify-center">
        <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {" "}
          {errMsg}
        </p>
      </section>
      <form onSubmit={submitHandler}>
        <div className="w-full mb-4 rounded-lg bg-gray-700 border-gray-500">
          <div className="rounded-t-lg py-1 px-1 bg-gray-800">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment_text"
              rows={4}
              name="comment_text"
              className="w-full px-4 py-2 text-sm border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400"
              placeholder="Write a comment..."
              onChange={(e) => {
                setComment_text(e.target.value);
              }}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-600">
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-indigo-700"
            >
              Post comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const commentContent = comments.map((comment: any) => (
    <div key={comment._id}>
      <ul className="mt-8 flex justify-center">
        <div className=" bg-gray-800 h-fit w-full p-7 mb-6 rounded-2xl">
          <div className="flex flex-row items-center justify-center">
            <img
              src={`..${comment.user.image}`}
              className="mr-10 object-cover rounded-full h-20 w-20"
              alt="profile"
            />
            <div className="w-3/4">
              <p className="mb-1 text-slate-500 w-full md:w-2/3 ml-1 text-sm">
                {Moment(comment.timestamp).format("MMMM DD yyyy, h:mm A")}
              </p>
              <p className="m-4 text-white w-full md:w-2/3 ml-1 text-m">
                {comment.comment_text}
              </p>
              <div className="flex justify-center w-2/3 mt-8">
                <span className="mr-2 text-sm font-semibold text-indigo-600">
                  {comment.user.username}
                </span>
                <span className="text-sm mr-2 font-semibold text-slate-500">
                  /{" "}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {comment.user.job_title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  ));

  return auth?.roles?.includes("2001") ? (
    <div className="mt-10 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
          Discussion ( {comments.length} )
        </h2>
      </div>
      <div>{commentForm}</div>
      <div>{commentContent}</div>
    </div>
  ) : (
    <div className="mt-10 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
          Discussion ( {comments.length} )
        </h2>
      </div>
      <div>{commentContent}</div>
    </div>
  );
}

export default Comment;
