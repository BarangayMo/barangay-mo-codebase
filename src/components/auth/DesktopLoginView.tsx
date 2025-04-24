
import { FC } from 'react';
import { LoginForm } from './LoginForm';
import { LoginReview } from './LoginReview';

const REVIEWS = [{
  text: "Amazing! So easy to use and helped me with my account quickly.",
  author: "Maria D.",
  subtitle: "Resident",
  avatar: "https://randomuser.me/api/portraits/women/68.jpg"
}];

export const DesktopLoginView: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9FB] px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden border-2 border-[#e0e2ec] scale-100 md:scale-100">
        <div className="hidden md:flex flex-col w-1/2 bg-[#528462] text-white p-12 justify-between gap-8" style={{ background: "linear-gradient(120deg, #39bc90 40%, #72d1de 100%)" }}>
          <div>
            <div className="text-xl font-bold mb-8 tracking-widest">BARANGAY MO</div>
            <div className="mt-8">
              <div className="font-extrabold text-4xl leading-tight drop-shadow">Your Community, Smarter</div>
              <div className="opacity-90 mt-6 text-lg">Login to connect with your Barangay. Get updates, manage your RBI, shop, and more—with a modern experience.</div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <div className="rounded-2xl bg-white/[.16] p-5 backdrop-blur text-base drop-shadow flex items-center gap-3">
              <img src={REVIEWS[0].avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white/60 flex-shrink-0" />
              <div>
                <div className="italic">&quot;{REVIEWS[0].text}&quot;</div>
                <div className="mt-2 flex items-center gap-2 text-white/80 text-xs">
                  <b>{REVIEWS[0].author}</b>
                  <span className="rounded bg-white/40 px-2 py-0.5 ml-2">{REVIEWS[0].subtitle}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white/90" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12 md:px-12 md:py-16">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
