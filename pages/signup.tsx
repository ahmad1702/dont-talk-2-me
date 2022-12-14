import { Button, Grid, Input, Spacer } from "@nextui-org/react";
import axios from "axios";
import { get } from "lodash-es";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useContext, useState } from "react";
import { UserContext } from "../Auth/UserProvider";


const backgroundVideos = ["airpods", "mayonaise", "takis", "nooffense"];
const VIDEO_SRC = `assets/videos/${backgroundVideos[Math.floor(Math.random() * backgroundVideos.length)]
  }.mp4`;

type ErrorMessage = {
  title: string;
  msg: string;
  type: "error" | "warning";
};

const signup: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [errMsg, setErrMsg] = useState<ErrorMessage | null>(null);

  const { setCurrentUser } = useContext(UserContext);

  const router = useRouter();

  const handleSignUp = async (e: any) => {
    if (e) {
      e.preventDefault();
    }
    if (password !== password2) {
      setErrMsg({
        title: "Error",
        msg: 'Both Passwords Must Match',
        type: 'error'
      })
      return 0;
    }
    const res = await axios.post(`${window.location.origin}/api/users`, {
      username: username,
      password: password,
    });
    console.log('res:', res)

    const resUser = get(res, "data");
    if (resUser && get(resUser, 'username').length > 0) {
      setCurrentUser(resUser);
      localStorage.setItem("user", JSON.stringify(resUser));
      router.push("/");
    }

    const errStatusi = [404, 400, 500];
    if (get(res, "status") === 200) {
    } else if (errStatusi.includes(get(res, "response.status"))) {
      let tempErrMsg = "Something went wrong, please try again later.";
      setErrMsg({
        title: "Error",
        msg: tempErrMsg,
        type: "error",
      });
    }
  };
  return (
    <div className="w-full h-full md:h-screen md:flex">
      <div
        className="h-96 md:h-screen w-full md:w-1/2 bg-red-800"
      >
        <video
          autoPlay
          muted
          loop
          id="myVideo"
          className="w-full h-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" className="object-cover" />
        </video>
      </div>
      <div className="md:h-screen w-full md:w-1/2 md:flex flex-col justify-center items-center mt-10 py-30 md:py-0 md:px-10">
        <form onSubmit={(e) => handleSignUp(e)}>
          <Grid.Container gap={3}>
            <Grid xs={12}>
              <div>
                <div className='text-4xl font-extrabold'>
                  ?????? DontTalk2Me <span className='font-normal'>| Sign Up</span>
                </div>
              </div>
            </Grid>
            {errMsg && (
              <Grid xs={12}>
                <div className="h-auto bg-red-200 -mt-5 w-full rounded-2xl p-3 text-red-800">
                  <>
                    <div className="text-md font-bold">{errMsg.title}</div>
                    <div className="text-xs">{errMsg.msg}</div>
                  </>
                </div>
              </Grid>
            )}
            <Grid xs={12}>
              <Input
                bordered
                fullWidth
                labelPlaceholder="Username"
                name={"username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Spacer y={0.5} />
            <Grid xs={12}>
              <Input.Password
                fullWidth
                bordered
                aria-label="Password"
                labelPlaceholder="Password"
                name={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Spacer y={0.5} />
            <Grid xs={12}>
              <Input.Password
                fullWidth
                bordered
                aria-label="Password2"
                labelPlaceholder="Confirm Password"
                name={"password2"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                auto
                className='text-white bg-blue-500  hover:bg-blue-700 hover:-translate-y-0.5 w-full shadow-none h-12 rounded-2xl'
                onClick={(e) => router.push('/signup')}
                type="submit"
              >
                Sign Up
              </Button>
            </Grid>
            <Grid xs={12}>
              <div className='w-full flex items-center justify-between'>
                <div className='w-2/5 bg-slate-800 dark:bg-white h-0.5 rounded-full'></div>
                <div>Or</div>
                <div className='w-2/5 bg-slate-800 dark:bg-white h-0.5 rounded-full'></div>
              </div>
            </Grid>
            <Grid xs={12}>
              <Button
                auto
                className="text-white bg-slate-800  hover:bg-slate-700 dark:bg-white dark:hover:bg-neutral-300 dark:text-slate-900 hover:-translate-y-0.5 w-full shadow-none h-12 rounded-2xl focus:border-2 focus:border-bg-blue-900 focus-within:border-2 focus-within:border-bg-blue-900"
                onClick={(e) => router.push('/login')}
              >
                Log-In
              </Button>
            </Grid>
          </Grid.Container>
        </form>
      </div>
    </div>
  );
};

export default signup;
