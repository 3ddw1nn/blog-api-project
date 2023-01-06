function ForgotPasswordSubmission() {
  return (
    <div>
      <div className=" mt-10 text-white text-3xl flex justify-center font-bold">
        <h3>Check your Email</h3>
      </div>
      <div className="h-screen flex justify-center">
        <div className="py-6 px-8 h-fit mt-20 bg-slate-600 rounded shadow-xl">
          <div className="mt-6 text-white text-l flex flex-col">
            <p className="flex justify-center">
              An email has been sent. Please click the link in your email and
              follow the password recovery steps
            </p>
          </div>
          <div className="mt-8 flex justify-center ">
            <a
              className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500 text-sm"
              href="/"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordSubmission;
