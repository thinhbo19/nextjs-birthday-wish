import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "../styles/Name.module.css";
import ConfettiGenerator from "confetti-js";
import messages from "../utils/birthdayWishes";
import useTheme from "../hooks/useTheme";
import * as htmlToImage from "html-to-image";
import FileSaver from "file-saver";
import Image from "next/image";
import ImageHP from "../public/1.png";

const Home = () => {
  const name = "Phú";
  const color = 0;

  const [downloading, setDownloading] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const audioRef = useRef();
  const [isClient, setIsClient] = useState(false); // Kiểm tra xem đang chạy trên client

  const { setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true); // Thiết lập trạng thái khi đang ở phía client

    setTheme(color);

    if (downloading === false) {
      const confettiSettings = {
        target: "canvas",
        start_from_edge: true,
      };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      audioRef.current.play();
    }
  }, [color, downloading]);

  useEffect(() => {
    if (downloading === true && downloadedOnce === false) {
      downloadImage();
    }
  }, [downloading, downloadedOnce]);

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const downloadImage = () => {
    if (downloadedOnce === true) return;

    const node = document.getElementById("image");

    if (node) {
      setDownloadedOnce(true);

      htmlToImage.toPng(node).then((blob) => {
        FileSaver.saveAs(blob, "birthday-Home.png");
        setDownloading(false);
      });
    }
  };

  const title = (name) => {
    const Home = "Happy Birthday " + name + "!";
    const base_letters = [];
    const name_letters = [];

    for (let i = 0; i < Home.length; i++) {
      if (i < 15) {
        const letter = Home.charAt(i);
        base_letters.push(
          <span key={i} style={{ "--i": i + 1 }}>
            {letter}
          </span>
        );
      } else {
        const letter = Home.charAt(i);
        name_letters.push(
          <span key={i} style={{ "--i": i + 1 }} className={styles.span}>
            {letter}
          </span>
        );
      }
    }

    return (
      <>
        {downloading ? (
          <h1
            className={styles.titleImg}
            style={{ "--Home-length": Home.length }}
          >
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        ) : (
          <h1 className={styles.title} style={{ "--Home-length": Home.length }}>
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        )}
      </>
    );
  };

  if (downloading) {
    return (
      <div className={styles.containerImg} id="image" onClick={downloadImage}>
        {downloadImage()}
        <main className={styles.image}>
          <div>
            <div className={styles.main}>{title(name)}</div>

            <div style={{ height: 40 }} />

            <p className={styles.descImg}>
              {messages[randomNumber(0, messages.length)].value}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday {name}</title>
        <meta name="description" content={`A surprise birthday Home!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas className={styles.canvas} id="canvas"></canvas>

      <main className={styles.animate}>
        <div className={styles.imageContainer}>
          <Image src={ImageHP} width={300} height={300} alt="phu"></Image>
        </div>

        <div>
          <div className={styles.main}>{title(name)}</div>
          <p className={styles.desc}>
            {messages[randomNumber(0, messages.length)].value}
          </p>
        </div>

        {/* Render ảnh nhỏ */}
      </main>

      <audio ref={audioRef} id="player" autoPlay>
        <source src="media/hbd.mp3" />
      </audio>
    </div>
  );
};

export default Home;
