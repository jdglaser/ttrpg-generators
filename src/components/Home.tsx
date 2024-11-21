import tutorialOne from "../assets/first.gif";
import tutorialFour from "../assets/fourth.gif";
import tutorialTwo from "../assets/second.gif";
import tutorialThree from "../assets/third.gif";

export default function Home() {
  return (
    <>
      <h1
        style={{
          margin: 0,
          padding: 0,
          top: "-15px",
          lineHeight: "2rem",
          marginBottom: "1rem",
        }}
      >
        Worlds Without Number Random Generators
      </h1>
      <h2>About</h2>
      <p>
        Welcome! One of the most popular resources for TTRPG world-building
        among GMs is the excellent book{" "}
        <a href="https://www.drivethrurpg.com/en/product/348791/worlds-without-number">
          <em>Worlds Without Number</em>
        </a>{" "}
        by the brilliant{" "}
        <a href="https://sine-nomine-publishing.myshopify.com/pages/about-us">
          Kevin Crawford
        </a>
        . While it's an incredible TTRPG in its own right (and definitely worth
        checking out), its GM-focused content is among the best in the industry.
        A generous free version, containing 90% of the content, is also
        available{" "}
        <a href="https://www.drivethrurpg.com/en/product/348809/worlds-without-number-free-edition">
          online here
        </a>
        .
      </p>
      <p>
        I'm a huge fan of the random tables in this book. Most of them are
        system-agnostic, and Crawford even encourages using the world-building
        content for other systems (see page 220). I created this website to make
        using these random tables simpler and faster, helping GMs focus on
        building fantastic worlds and RPG settings.
      </p>
      <p>
        I primarily made this website for myself, but I figured others might
        find it useful as well. The code for the website can be found{" "}
        <a href="https://github.com/jdglaser/ttrpg-generators/tree/main">
          here
        </a>{" "}
        and the code is open source under the{" "}
        <a href="https://github.com/jdglaser/ttrpg-generators/blob/main/LICENSE">
          MIT License
        </a>
        . If you notice any issues feel free to open up an issue on GitHub and I
        will do my best to take a look (but no promises, I am a full time
        software engineer and dad 🙂). I also plan to add more tables from the
        book and features to the site. If you have ideas, feel free to share by
        opening an issue on GitHub.
      </p>
      <h2>Usage Guide</h2>
      <p>
        Open the menu in the sidebar and select a category. On first opening the
        page, random results will be rolled on each table. Clicking the
        "refresh" button will refresh all table results
      </p>
      <img
        style={{ border: "1px solid black", maxWidth: "100%" }}
        src={tutorialOne}
      ></img>
      <p>
        Each bolded bullet point is the header for one of the tables found in
        the book. Clicking any of the individual table headers will reroll just
        that table.
      </p>
      <img
        style={{ border: "1px solid black", maxWidth: "100%" }}
        src={tutorialTwo}
      ></img>
      <p>
        Clicking the "Copy Rich Text" button will copy the contents of the
        tables in rich text format for pasting in rich text editors like Google
        Docs or Microsoft Word
      </p>
      <img
        style={{ border: "1px solid black", maxWidth: "100%" }}
        src={tutorialThree}
      ></img>
      <p>
        Clicking the "Copy Markdown" button will copy the contents of the tables
        in markdown format for pasting into markdown editors like{" "}
        <a href="https://obsidian.md/">Obsidian</a>
      </p>
      <img
        style={{ border: "1px solid black", maxWidth: "100%" }}
        src={tutorialFour}
      ></img>
    </>
  );
}
