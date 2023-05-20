import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSpeechSynthesis } from "react-speech-kit";
import { Button } from "@mantine/core";
import { useWidget } from "src/store/hooks/useWidget";
import useSound from "use-sound";
import { db, storage } from "../../../firebase.config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// import cashDefault from "../../../public/sound/default_cash.mp3";
// import ReactAudioPlayer from "react-audio-player";
/* eslint-disable */

// check color and layout
// check filter

export default ({ profile, handlerName, notFound }) => {
  // const audioRef = useRef();
  const [play] = useSound("/sound/default_cash.mp3", {
    onend: () => {
      console.info("Sound ended!");
    },
  });

  const { data, setData, setArchive } = useWidget("widget-msg", handlerName);
  // console.log(data, "data", handlerName);
  const [currentSpeakingMsg, setCurrentSpeakingMsg] = useState(null);
  const buttonRef = useRef(null);
  const [state, setState] = useState(false);
  const onEnd = () => {
    // Remove the just read message from the data array
    setTimeout(() => {
      setData((prevData) =>
        prevData.filter((msg) => msg.id !== currentSpeakingMsg?.id)
      );
      setArchive(currentSpeakingMsg?.id);
      setCurrentSpeakingMsg(null);
      setState(false);
    }, 5000);
  };
  const { speak, speaking } = useSpeechSynthesis({
    onEnd,
  });

  useEffect(() => {
    // Check if there is a new unread message and the text-to-speech is not currently active
    if (data.length > 0 && !state && !speaking) {
      setCurrentSpeakingMsg(data[0]);
    }
  }, [data, state, speaking]);

  useEffect(() => {
    // Trigger speech when there is a new message to read
    if (currentSpeakingMsg && !speaking) {
      play();
      if (currentSpeakingMsg?.message) {
        speak({ text: currentSpeakingMsg?.message });
      } else {
        setTimeout(() => {
          onEnd();
        }, 5000);
      }
    }
  }, [currentSpeakingMsg, speak, speaking]);
  console.log(profile, "profile");

  return (
    <div className="border-red-500 w-full h-full">
      {/* <audio ref={audioRef} src={"/sound/default_cash.mp3"} /> */}
      {!!currentSpeakingMsg && (
        <div
          style={{
            fontSize: 60,
            background: profile?.appearance?.bg_color ?? "red",
            color: profile?.appearance?.text_color ?? "white",
          }}
          className={`my-4 p-4 rounded-sm text-center`}
        >
          <div style={{ fontSize: 60 }}>
            <span>{currentSpeakingMsg?.from ?? "Someone"}</span>&nbsp;
            {profile?.appearance?.template_text ?? " just donate you "}
            {/* just donate you */}
            &nbsp;
            <span>${currentSpeakingMsg?.value}</span>
          </div>
          {currentSpeakingMsg?.message}
        </div>
      )}
      <Button
        className="invisible"
        ref={buttonRef}
        onClick={() => {
          play();
          // console.log(audioRef, "??");
          // audioRef?.current?.play();
          // speak({ text: "Sponsor just donate you $100" });
          console.log("running");
          // speak({ text: "Sponsor just donate you $100000" });
          // setState(true);
        }}
      >
        Test
      </Button>
    </div>
  );
};

// FAKE VOICE LINE
// TYPING TEXT
// REVEAL

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    // Query Firestore based on the handler property
    const q = query(collection(db, "handler"), where("handler", "==", slug[0]));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Data exists for the provided slug
      const profile = [];

      querySnapshot.forEach((doc) => {
        profile.push({ id: doc.id, ...doc.data() });
      });

      return {
        props: {
          profile: profile[0],
          handlerName: slug[0],
        },
      };
    } else {
      // Data does not exist for the provided slug
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching data: ", error);

    return {
      notFound: true,
    };
  }
}

// useEffect(() => {
//   if (buttonRef.current) {
//     // Trigger the button click programmatically after 5 seconds
//     setTimeout(() => {
//       buttonRef?.current.click();
//     }, 5000);
//   }
// }, []);

// const [isPaused, setIsPaused] = useState(false);
// const [utterance, setUtterance] = useState(null);
// const [voice, setVoice] = useState(null);
// const [pitch, setPitch] = useState(1);
// const [rate, setRate] = useState(1);
// const [volume, setVolume] = useState(1);

// useEffect(() => {
//   const synth = window.speechSynthesis;
//   const u = new SpeechSynthesisUtterance(text);
//   setUtterance(u);

//   // Add an event listener to the speechSynthesis object to listen for the voiceschanged event
//   synth.addEventListener("voiceschanged", () => {
//     const voices = synth.getVoices();
//     setVoice(voices[0]);
//   });

//   return () => {
//     synth.cancel();
//     synth.removeEventListener("voiceschanged", () => {
//       setVoice(null);
//     });
//   };
// }, [text]);

// const handlePlay = () => {
//   const synth = window.speechSynthesis;

//   if (isPaused) {
//     synth.resume();
//   } else {
//     utterance.voice = voice;
//     utterance.pitch = pitch;
//     utterance.rate = rate;
//     utterance.volume = volume;
//     synth.speak(utterance);
//   }

//   setIsPaused(false);
// };
