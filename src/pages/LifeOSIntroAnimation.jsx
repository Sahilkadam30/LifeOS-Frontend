import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LifeOSIntroAnimation = () => {
  const [hiding, setHiding] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const finishIntro = () => {
    setHiding(true);
    setTimeout(() => {
      if (token) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }, 900);
  };

  useEffect(() => {
    const timer = setTimeout(finishIntro, 4200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');

        .lo-intro{
          position:fixed;inset:0;display:grid;place-items:center;overflow:hidden;
          font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          background:
            radial-gradient(circle at 50% 42%,rgba(255,255,255,.98) 0 20%,rgba(238,248,255,.9) 45%,rgba(220,240,252,.9) 100%);
          transition:opacity .8s ease,transform .9s ease;
          z-index:9999;
          color:#14213d;
        }
        .lo-intro.lo-hide{opacity:0;transform:scale(1.04);pointer-events:none}

        .lo-glow{position:absolute;border-radius:50%;filter:blur(30px);opacity:.5;animation:loFloat 7s ease-in-out infinite}
        .lo-g1{width:220px;height:220px;background:#69b9ff;left:8%;top:18%}
        .lo-g2{width:260px;height:260px;background:#66e0ad;right:8%;bottom:12%;animation-delay:-2s}
        .lo-g3{width:140px;height:140px;background:#ffd76b;right:22%;top:8%;animation-delay:-4s}

        .lo-scene{position:relative;width:min(1050px,92vw);height:min(720px,90vh);display:flex;flex-direction:column;align-items:center;justify-content:center}

        .lo-orbit{position:absolute;width:min(650px,72vw);height:min(650px,72vw);border:1px solid rgba(39,123,189,.12);border-radius:50%;animation:loSpin 24s linear infinite}
        .lo-orbit:before,.lo-orbit:after{content:"";position:absolute;border-radius:50%;background:#fff;box-shadow:0 5px 20px rgba(30,90,130,.12)}
        .lo-orbit:before{width:9px;height:9px;top:18%;left:5%}
        .lo-orbit:after{width:7px;height:7px;bottom:15%;right:8%}

        .lo-brand{
          position:relative;z-index:3;text-align:center;
          animation:loBrandIn 1.2s cubic-bezier(.2,.8,.2,1) both;
        }
        .lo-logo{
          font-size:clamp(4.5rem,11vw,8.5rem);font-weight:800;letter-spacing:-.08em;
          line-height:.9;color:#17233f;
        }
        .lo-logo .lo-o{
          display:inline-flex;align-items:center;justify-content:center;
          width:.78em;height:.78em;margin:0 .02em;border-radius:50%;
          color:white;font-size:.64em;vertical-align:middle;letter-spacing:0;
          background:linear-gradient(135deg,#2d9cf4,#36d69a);
          box-shadow:0 12px 35px rgba(45,156,244,.25);
          position:relative;
        }
        .lo-logo .lo-o:after{
          content:"";position:absolute;width:18%;height:38%;border:3px solid white;
          border-left:0;border-top:0;transform:rotate(38deg);bottom:21%;left:40%;
          border-radius:0 0 7px 0;
        }
        .lo-tagline{
          margin-top:24px;font-size:clamp(.85rem,1.8vw,1.15rem);letter-spacing:.16em;
          text-transform:uppercase;color:#58708c;animation:loFadeUp 1s .45s both;
        }
        .lo-motto{
          margin-top:14px;font-size:clamp(1rem,2vw,1.3rem);color:#263f5d;
          animation:loFadeUp 1s .7s both;
        }

        .lo-modules{position:absolute;inset:0;z-index:2;pointer-events:none}
        .lo-module{
          position:absolute;width:74px;height:74px;border-radius:22px;display:grid;place-items:center;
          background:rgba(255,255,255,.8);backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,.9);box-shadow:0 12px 35px rgba(45,82,112,.13);
          opacity:0;transform:scale(.5);
          animation:loModuleIn .7s cubic-bezier(.2,.9,.2,1) forwards;
        }
        .lo-module span{font-size:27px}
        .lo-module small{position:absolute;top:79px;font-size:11px;font-weight:700;color:#58708c;white-space:nowrap}
        .lo-m1{left:8%;top:25%;animation-delay:.7s}.lo-m2{left:4%;top:58%;animation-delay:.85s}
        .lo-m3{left:20%;bottom:8%;animation-delay:1s}.lo-m4{right:8%;top:25%;animation-delay:1.15s}
        .lo-m5{right:4%;top:58%;animation-delay:1.3s}.lo-m6{right:20%;bottom:8%;animation-delay:1.45s}
        .lo-m7{left:30%;top:6%;animation-delay:1.6s}.lo-m8{right:30%;top:6%;animation-delay:1.75s}

        .lo-loader-wrap{position:absolute;bottom:8%;display:flex;flex-direction:column;align-items:center;gap:12px;animation:loFadeUp 1s 1s both}
        .lo-loader{width:180px;height:5px;border-radius:20px;background:#dceaf4;overflow:hidden}
        .lo-loader i{display:block;width:0;height:100%;border-radius:20px;background:linear-gradient(90deg,#3b9df6,#39d59a);animation:loLoad 3.6s ease forwards}
        .lo-loading{font-size:11px;color:#7890a7;letter-spacing:.14em;text-transform:uppercase}

        .lo-skip{
          position:fixed;right:24px;bottom:22px;border:0;background:rgba(255,255,255,.7);
          padding:9px 15px;border-radius:20px;color:#557089;font-size:12px;cursor:pointer;
          transition:.2s;z-index:10000;font-family:inherit;
        }
        .lo-skip:hover{background:#fff;transform:translateY(-2px)}

        @keyframes loBrandIn{from{opacity:0;transform:translateY(30px) scale(.92);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
        @keyframes loFadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}
        @keyframes loModuleIn{to{opacity:1;transform:scale(1)}}
        @keyframes loLoad{to{width:100%}}
        @keyframes loSpin{to{transform:rotate(360deg)}}
        @keyframes loFloat{50%{transform:translate(25px,-18px) scale(1.08)}}

        @media(max-width:700px){
          .lo-module{width:56px;height:56px;border-radius:17px}
          .lo-module span{font-size:21px}.lo-module small{top:60px;font-size:9px}
          .lo-m1{left:3%;top:20%}.lo-m2{left:2%;top:67%}.lo-m3{left:12%;bottom:8%}
          .lo-m4{right:3%;top:20%}.lo-m5{right:2%;top:67%}.lo-m6{right:12%;bottom:8%}
          .lo-m7{left:18%;top:4%}.lo-m8{right:18%;top:4%}
          .lo-tagline{letter-spacing:.08em}
        }
        @media(prefers-reduced-motion:reduce){
          *,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important}
        }
      `}</style>

      <div className={`lo-intro${hiding ? " lo-hide" : ""}`}>
        <div className="lo-glow lo-g1"></div>
        <div className="lo-glow lo-g2"></div>
        <div className="lo-glow lo-g3"></div>

        <main className="lo-scene">
          <div className="lo-orbit"></div>

          <div className="lo-modules" aria-hidden="true">
            <div className="lo-module lo-m1"><span>🏋️</span><small>Gym</small></div>
            <div className="lo-module lo-m2"><span>🎨</span><small>Art</small></div>
            <div className="lo-module lo-m3"><span>📝</span><small>Notes</small></div>
            <div className="lo-module lo-m4"><span>✈️</span><small>Travel</small></div>
            <div className="lo-module lo-m5"><span>💰</span><small>Finance</small></div>
            <div className="lo-module lo-m6"><span>🎵</span><small>Music</small></div>
            <div className="lo-module lo-m7"><span>📅</span><small>Planner</small></div>
            <div className="lo-module lo-m8"><span>🚀</span><small>Goals</small></div>
          </div>

          <section className="lo-brand">
            <div className="lo-logo">
              Life<span className="lo-o">O</span>S
            </div>
            <div className="lo-tagline">Track your habits · Build your dreams · Live better</div>
            <div className="lo-motto">Small steps. Big life.</div>
          </section>

          <div className="lo-loader-wrap">
            <div className="lo-loader"><i></i></div>
            <div className="lo-loading">Preparing your LifeOS</div>
          </div>
        </main>

        <button className="lo-skip" onClick={finishIntro}>Skip intro</button>
      </div>
    </>
  );
};

export default LifeOSIntroAnimation;